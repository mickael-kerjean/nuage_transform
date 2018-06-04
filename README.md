# Intro
Nuage is the web interface to manage your files on any cloud. This repo is the part of nuage which allow it to process media

# Media
Media processing comes in different containers to balance/set resource consumption between services

- Image processing: image magick is slow, get a look at https://github.com/jcupitt/libvips
- video processing: ffmpeg
- Audio processing: ffmpeg

server_conf: {
    ...
    processing_image: "http://image/",
    processing_video: "http://video/",
    processing_audio: "http://audio/"
}

media server expose:
  - GET /  => just a ping
  - GET /[type]/transcode?params=..... => transcode stream and send back response
