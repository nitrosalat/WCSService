var wcs = require('./WCS/WCS.js');
//var utils = require('./WCS/Utils.js');
//
//
//var writer = fs.createWriteStream('extracted.bil', {flags: 'w',encoding:'binary'});
//writer.on('finish', function() {
//    console.log("final");
//});
//var reader = fs.createReadStream('/home/nitrosalat/projects/CoverageServer/coverages/LE71850182002192SGS00_B1.bil')
//var buffer;
//var totalLength = 0;
//var chunks = [];
//reader.on('data',function(data){
//    totalLength += data.length
//    //buffer = new Buffer(data.length);
//    //console.time('time')
//    chunks.push(data);
//    //console.timeEnd('time')
//    //writer.write(buffer);
//
//});
//reader.on('end', function () {
//    console.time('time')
//    buffer = Buffer.concat(chunks,totalLength);
//    console.timeEnd('time');
//
//    var x,y;
//    x = 1500;
//    y = 1500;
//    console.time('extract');
//    var extracted = utils.extract(buffer,7551,8141,1,0,0,x,y);
//    console.timeEnd('extract');
//    console.log(extracted.length);
//    writer.write(extracted);
//    writer.end();
//});




//var fs = require('fs'),
//    drawing = require('pngjs-draw');
//PNG = drawing(require('pngjs2').PNG);
//var perlin = require('perlin-noise');
//var uuid = require('uuid');
//
//var writer = fs.createWriteStream('test.bsq', {flags: 'w',encoding:'binary'});
//writer.on('finish', function() {
//    console.log("final")
//});
//
//var options = {
//    flags: 'r',
//    encoding: 'ascii',
//    fd: null,
//    autoClose: true
//}
//var reader = fs.createReadStream('/home/nitrosalat/projects/CoverageServer/coverages/gl-latlong-1deg-landcover.bsq')
//var buffer;
//reader.on('data',function(data){
//    console.log(data.length)
//    buffer = new Buffer(data.length);
//    console.time('time')
//    for(var y = 0;y < 180;y+=1)
//    {
//        for(var x = 0;x < 360;x+=1)
//        {
//            var idx = y * 360 + x;
//            buffer.writeUInt8(data[idx],idx)
//
//
//        }
//    }
//    console.timeEnd('time')
//    writer.write(buffer);
//
//});
//
//var headerReader = fs.createReadStream('test.hdr');
//headerReader.on('data', function (data) {
//    var str = data.toString();
//    var header = {};
//    str.split('\n').forEach(function(x){
//        var arr = x.split(' ');
//        arr[1] && (header[arr[0]] = arr[1]);
//    });
//});
//
//function slice(xMin,yMin,xMax,yMin)
//{
//
//}




//function randomByte() {
//    return Math.floor(Math.random() * 255);
//}
//function encode(size) {
//
//
//    console.time('executionTime');
//    var cover = new PNG({
//        width: size,
//        height: size,
//        colorType: 2,
//        //deflateLevel : 0,
//        //deflateStrategy : 0,
//        //inputHasAlpha : false,
//        filterType: 4
//    });
//    var noise = perlin.generatePerlinNoise(size, size, {
//        octaveCount: 10,
//        amplitude: 10,
//        persistence: 0.4
//    });
//    for (var y = 0; y < cover.height; y++) {
//        for (var x = 0; x < cover.width; x++) {
//            var index = y * cover.width + x;
//
//            cover.drawPixel(x, y, [noise[index] * 255,0 , noise[index] * 255, 255]);
//
//
//            //[noise[index]*255,noise[index]*255,noise[index]*255,255])
//        }
//    }
//    console.timeEnd('executionTime');
//
//    cover.pack().pipe(fs.createWriteStream('/home/nitrosalat/projects/CoverageServer/out/' + uuid.v4() + '.png'));
//
//
//}
//
//
//function rgbInt(red, green, blue) {
//    var rgb;
//    rgb = red;
//    rgb = (rgb << 8) + green;
//    rgb = (rgb << 8) + blue;
//    return Math.floor(rgb);
//}
//
//function intToRGB(RGBint) {
//    var Blue = Math.floor(RGBint % 256);
//    var Green = Math.floor(RGBint / 256 % 256);
//    var Red = Math.floor(RGBint / 256 / 256 % 256);
//    return [Red, Green, Blue, 255];
//}
//
//
//encode(1000)

//var dst = new PNG({width: 1000, height: 1000});
//fs.createReadStream('c3bfe370-85ac-11e5-bb5c-df89c21518d4.png')
//    .pipe(new PNG())
//    .on('parsed', function() {
//        console.time('executionTime');
//        this.bitblt(dst, 0, 0, 1000, 1000, 0, 0);
//        console.timeEnd('executionTime')
//
//        dst.pack().pipe(fs.createWriteStream('out.png'));
//    });


//fs.createReadStream('2000px-Soccer_ball.svg.png')
//    .pipe(new PNG({
//        filterType: 4
//    }))
//    .on('parsed', function() {
//
//        for (var y = 0; y < this.height; y++) {
//            for (var x = 0; x < this.width; x++) {
//                var idx = (this.width * y + x) << 2;
//
//                // invert color
//                this.data[idx] = 255 - this.data[idx];
//                this.data[idx+1] = 255 - this.data[idx+1];
//                this.data[idx+2] = 255 - this.data[idx+2];
//
//                console.log(this.data[idx]);
//
//                // and reduce opacity
//                //this.data[idx+3] = this.data[idx+3] >> 1;
//            }
//        }
//
//        this.pack().pipe(fs.createWriteStream('out.png'));
//    });