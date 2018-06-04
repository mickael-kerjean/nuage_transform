const ffmpeg = require('fluent-ffmpeg'),
      config = require('../../config');

module.exports = function(stream, params){
    const bitrate = Number(params.bitrate) ? Number(params.bitrate) : 128;

    return ffmpeg(stream)
        .audioCodec('libmp3lame')
        .audioBitrate(bitrate);
}
