/**
 * Created by nitrosalat on 18.11.15.
 */
function Extract(raw,nRows,nCols,depth,xMin,yMin,xMax,yMax)
{
    var width = xMax - xMin;
    var heigth = yMax - yMin;
    console.log(width,heigth)
    var buff = new Buffer(width*heigth*depth);
    var max = 0;
    for(var y = yMin,yNew = 0; y < yMax;y++,yNew++)
    {
        for(var x = xMin,xNew = 0; x < xMax;x++,xNew++)
        {
            var indexOfRaw = (y * nCols + x)*depth;
            var indexOfNewBuff = (yNew * width + xNew)*depth;
            buff.writeUInt8(raw.readUInt8(indexOfRaw),indexOfNewBuff);
        }
    }
    return buff;
}

module.exports.extract = Extract;

module.exports.toArrayBuffer = function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}