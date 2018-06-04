const ffmpeg = require('fluent-ffmpeg'),
      config = require('../../config'),
      fs = require("fs");

module.exports = function(path, params, fn){
    const file = path+".m3u8";
    return ffmpeg(path)
        .videoCodec(config.video.codec)
        .audioCodec(config.audio.codec)
        .audioBitrate(config.audio.bitrate)
        .videoBitrate(config.video.bitrate)
        .audioChannels(config.audio.channel)
        .format('mp4')
        .addOption('-hls_time', 10)
        .addOption('-hls_list_size', 0)
        .size('640x?')
        .on('progress', function(info) {
            fs.exists(file, (res) => {
                if(res === true) fn(fs.createReadStream(file));
            });
            console.log('progress ' + info.percent + '%');
        })
        .on('end', function() {
            console.log('file has been converted succesfully');
        })
        .on('error', function(err) {
            console.log('an error happened: ' + err.message);
        })
        //.save(file);
}
