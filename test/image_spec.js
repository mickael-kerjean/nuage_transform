const transcoder = require('../src/audio/transcode'),
      fs = require('fs');

describe('image transcoding', () => {
    beforeEach((done) => {
        fs.exists('tmp', function(res){
            if(res === true){
                fs.unlinkSync('tmp', done);
            }
        });
    });
    it('gives original image if no params is included', (done) => {
        const res = transcode_jpg();
        res.on('end', function(){

        });
    });
    it('works on a jpg', (done) => {
        const res = transcode_jpg();
        res.on('end', function(){

        });
    });
    it('works on a png', (done) => {
        const res = transcode_png();
        res.on('end', function(){

        });
    });
    it('works on a svg', (done) => {
        const res = transcode_svg();
        res.on('end', function(){

        });
    });
    it('works on a exiff', (done) => {
        const res = transcode_exif();
        res.on('end', function(){

        });
    });
});


function transcode_jpg(params){
    return transcoder(fs.createReadStream('./mock/image.jpg'))
        .pipe(fs.WriteStream('./tmp'));
}
function transcode_png(params){
    return transcoder(fs.createReadStream('./mock/image.png'))
        .pipe(fs.WriteStream('./tmp'));
}
function transcode_svg(params){
    return transcoder(fs.createReadStream('./mock/image.svg'))
        .pipe(fs.WriteStream('./tmp'));
}
function transcode_svg(params){
    return transcoder(fs.createReadStream('./mock/image.exiff'))
        .pipe(fs.WriteStream('./tmp'));
}
