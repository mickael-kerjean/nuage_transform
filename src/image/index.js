const sharp = require("sharp"),
      fs = require('fs'),
      Transform = require('stream').Transform,
      ex = require("exiv2"),
      spawn = require("child_process").spawn;

module.exports.transcode_image = function(size, meta){
    const [width, height] = parseSize(size);

    const ret = sharp()
          .resize(width, height)
          .withoutEnlargement()
          .jpeg()
    if(meta === "true") return ret.withMetadata();
    return ret;
}

module.exports.transcode_raw = function(mimeType, size, meta, res){
    /*
     * The RAW Transcode let go anything that's not a RAW Pictures. Because transcoding is a
     * very CPU intensive feature, we first try to get thumbnails infos as it's much faster and
     * very often good enough
     */
    if(isRaw(mimeType) === false){
        res.setHeader("Cache-Control", "max-age=604800");
        return new Transform({
            transform: function (chunk, encoding, callback){
                this.emit("ready");
                callback(false, chunk);
            }
        });
    }

    const filename = "/tmp/photo_"+Math.random().toString(24).replace(/^0\./, "");
    const file = fs.createWriteStream(filename);
    const [width] = parseSize(size);

    return new Transform({
        transform: function(chunk, encoding, done){
            file.write(chunk);
            done();
        },
        flush: function(done){
            let self = this;
            file.end(() => {
                return extract_preview.call(this, filename, width, meta)
                    .then(() => res.setHeader("Cache-Control", "max-age=604800"))
                    .catch((e) => {
                        width < 400 ? res.setHeader("Cache-Control", "max-age=2592000") : res.setHeader("Cache-Control", "max-age=604800");
                        return transcode_tiff.call(this, filename, width, meta)
                    })
                    .then(() => complete(filename, done));
            });
            function complete(filename, done){
                fs.unlink(filename, () => {});
                done();
            }
        }
    });

    function extract_preview(filename, width, meta){
        return new Promise((done, error) => {
            ex.getImagePreviews(filename, (err, previews) => {
                if(err) return error(err);
                let candidates = previews.filter((preview) => isGoodEnough(preview.width, width, preview.mimeType));
                if(candidates.length < 1) return error();

                const preview = candidates.slice(-1)[0];
                if(!preview.data) return error();
                if(meta === true){
                    // TODO INSERT METADATA
                    this.push(preview.data);
                }else{
                    this.push(preview.data);
                }
                done();
            });
        });

        function isGoodEnough(preview_width, width, mimeType){
            if(preview_width < width*0.7 && width > 400) return false;
            if(mimeType !== "image/jpeg") return false;
            return true;
        }
    }

    function transcode_tiff(filename, width, meta){
        const child = spawn("dcraw", [
            "-T", // convert to tiff
            "-c", // write to standard output
            "-v", // keey metadata
            "-w", // image filter
            filename
        ]);
        child.stdout.on('data', (data) => {
            this.push(data);
        });
        return new Promise((done, err) => {
            child.on('exit', (code, signal) => {
                this.end();
                done();
            });
        });
    }

    function isRaw(mimeType){
        return [
            "image/x-tif",
            "image/x-canon-cr2",
            "image/x-canon-crw",
            "image/x-nikon-nef",
            "image/x-nikon-nrw",
            "image/x-sony-arw",
            "image/x-sony-sr2",
            "image/x-minolta-mrw",
            "image/x-minolta-mdc",
            "image/x-olympus-orf",
            "image/x-panasonic-rw2",
            "image/x-pentax-pef",
            "image/x-epson-erf",
            "image/x-raw",
            "image/x-x3f",
            "image/x-fuji-raf",
            "image/x-aptus-mos",
            "image/x-mamiya-mef",
            "image/x-hasselblad-3fr",
            "image/x-adobe-dng",
            "image/x-samsung-srw",
            "image/x-kodak-kdc",
            "image/x-kodak-dcr"
        ].indexOf(mimeType) !== -1;
    }
}


function parseSize(size){
    if(typeof size !== 'string') size = "250";
    size = size.split("x");
    const width = parseInt(size[0]),
          height = parseInt(size[1]) || null;

    return [width, height];
}
