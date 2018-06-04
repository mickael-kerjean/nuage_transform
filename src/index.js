const http = require('http'),
      path = require('path'),
      url = require("url"),
      fs = require('fs'),
      busboy = require('busboy'),
      config = require('../config'),
      { transcode_image, transcode_raw } = require('./image/');


var server = http.createServer(function(req, res) {
    if(req.method == "POST"){
        var handler = new busboy({ headers: req.headers });
        handler.on('file', function(fieldName, stream, filename, encoding, mimeType){
            const type = mimeType.split("/")[0];
            if(fieldName === "image"){
                const params = url.parse(req.url, true).query;
                if(params.size !== undefined){
                    res.setHeader("Content-Type", "image/jpeg");
                    stream = stream
                        .pipe(transcode_raw(mimeType, params.size, params.meta, res)) // convert to a normal format if needed
                        .pipe(transcode_image(params.size, params.meta)); // optimise for display
                }else{
                    res.sendHeader("Content-Type", mimeType);
                }
            }
            let http_code = 200;
            stream
                .on('error', (e) => {
                    if(e.toString().indexOf("unsupported image format") !== -1) http_code = 415;
                    else http_code = 422;
                })
                .on('end', () => {
                    res.statusCode = http_code;
                    res.end();
                }).pipe(res);
        });
        req.pipe(handler);
    }else{
        res.writeHead(200, {
            'Content-Type': 'text/html',
        });
        fs.createReadStream(path.join(__dirname,"index.html")).pipe(res);
    }
});

server.listen(config.port, () => {
    console.log("> Server running on port %s", config.port)
});
