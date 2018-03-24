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
    return Math.floor(date.getUTCHours() / 3) * 3;
}

function currentDate() {
	var date = new Date();
	return `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}/`;
}

function downloader() {
    request(
        {
            url: url  //需要下载的url地址,
            encoding: null,
        }
        , function (error, response, data) {
            var epak = decoder.decodeEpak(toArrayBuffer(data));
            var header = epak.header;

            var floder = currentDate();
            mkdirs(floder);

            var date = new Date();
            var hour = gfsHour(date);

            //var jpak = JSON.stringify(epak);
            fs.writeFile(floder + hour + ".epak", data, 'binary', function () {
            });

            console.log(date);
        });
}

downloader();
setInterval(downloader, 3600*1000 * 3);