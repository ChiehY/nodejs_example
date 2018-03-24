/**
 * Created by moepus on 16/10/2017.
 */
var request = require('request');
var fs = require('fs');
var decoder = require("./decoder.js");
var mkdirs = require('node-mkdirs');

function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

function gfsHour(date)
{
    //if(date.getUTCHours()<10){
    //     return "0" + date.getUTCHours();
//     }
//     else
   // return date.getUTCHours();
    return Math.floor(date.getUTCHours() / 3) * 3;
}

function padHour(a)
{
    a = ""+a;
    if(a.length<2)
        return "0"+a;
    return a;
}

var typeLst = ['precip_3hr','cape','total_precipitable_water','mean_sea_level_pressure'];


(function downloader(date,i) {
    var date = date || new Date();
    console.log(date);
    var floder = `${typeLst[i]}/${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}/`;
    var floderUrl = `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}/`;
    var hour = gfsHour(date);


    var url = "https://gaia.nullschool.net/data/gfs/"+floderUrl+padHour(hour)+"00-"+typeLst[i]+"-gfs-0.25.epak"

    console.log(url);

    request(
        {
            url: url,
            encoding: null,
        }
        , function (error, response, data) {
            if(error)
            {
                console.log(error);
                setTimeout(function(){
                    downloader(date);
                },30000);
                return;
            }
            mkdirs(floder);
            fs.writeFile(floder + padHour(hour) + ".epak", data, 'binary', function () {

                if(date>new Date(2016,6,1))
                {
                    if(i<typeLst.length-1)
                    {
                        downloader(date,i+1);
                        return;
                    }
                    downloader(new Date(date - 3*3600*1000),0);
                }
            });

        })

})(undefined,0);
