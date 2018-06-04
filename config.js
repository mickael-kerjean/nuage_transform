module.exports = {
    port: 8335,
    convert_video: {
        '1080': {audio: 160, video: 1000, size: 1080},
        'other': {audio: 128, video: 360, size: 360}
    },
    audio: {
        codec: 'libmp3lame',
        bitrate: '128k',
        channel: 2
    },
    video: {
        codec: 'libx264',
        bitrate: 1024
    }
}
