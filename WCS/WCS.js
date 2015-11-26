var express = require('express');
var app = express();

var xml = require('xml');
var fs = require('fs');
var xml2js = require('xml2js');
var utils = require('./Utils.js')

var coveragesNameList = [];
var coveragesFullNameList = [];
var coveragesPath = './data/';

var _capabilitiesResponse;

//var capabilitesManager = require('./GetCapabilitiesManager')();
//var describeCoverageManager = require('./DescribeCoverageManager')();
//var getCoverageManager = require('./GetCoverageManager')



//var cover = fs.readFile('./data/LE71850182002192SGS00_B1.TIF', function (err,data) {
//    tiffParser.parseHeader(data);
//    tiffParser.consoleTiffProperty()
//});

fs.watch('./data/', function (event,filename) {

    console.log(event,filename)
});
function validateCapabilitiesResponse()
{
    coveragesFullNameList = fs.readdirSync(coveragesPath);
    console.log(coveragesFullNameList)
    var contents = [];
    var id = 0;
    coveragesFullNameList.forEach(function (item) {
        var name = item.replace(/\.[^/.]+$/, "");//remove filename extension
        coveragesNameList.push(name);
        contents.push(
            {CoverageSummary : [
                {Identifier : id},
                {Title : name},
                {Abstract: "null"}
            ]}
        );

        id++;
    });

    var capabilitiesJSON = {
        Capabilities:[
            {_attr : {
                version : "1.1.2"
            }},
            {ServiceIdentification :  [
                {Title : "SPBU"},
                {ServiceType : "WCS"},
                {ServiceTypeVersion : "1.1.2"}
            ]},
            {Contents : contents}
        ]
    };
    _capabilitiesResponse = xml(capabilitiesJSON, { declaration: true });
}

function getCapabilitiesResponse()
{
    return _capabilitiesResponse;
}

function getCapabilities(request,response)
{
    response.send(getCapabilitiesResponse());
}


/////////////////describeCoverageSection

var geoTiffMetadataObjectList = [];

function describeCoverage(request,response)
{
    var identifier = request.query.identifiers;
    var headerObj = geoTiffMetadataObjectList[identifier];
    var bbox = headerObj.GetBBox().coord;
    var jsonObject = {
        CoverageDescription : [
            {Title : coveragesNameList[identifier]},
            {Identifier : identifier},
            {Abstract : "null"},
            {Domain : [
                {SpatialDomain : [
                    {BoundingBox : [
                        {_attr : {
                            crs : 'urn:ogc:def:crs:EPSG:'+headerObj.getCRSCode(),
                            dimensions : headerObj.samplesPerPixel
                        }},
                        {LowerCorner :  bbox[1][0] + ' ' + bbox[1][1]},
                        {UpperCorner :  bbox[3][0] + ' ' + bbox[3][1]}
                    ]}
                ]}
            ]},
            {Range : [

            ]},
            {SupportedCRS : 'urn:ogc:def:crs:EPSG:'+headerObj.getCRSCode()},
            {SupportedFormat : "Tiff"},
        ]
    };
    var descriptions = {
        CoverageDescriptions : [jsonObject]
    };
    console.log(xml(descriptions,{ declaration: true }))
    response.send(xml(descriptions,{ declaration: true }));
}

function loadMetadata()
{
    coveragesFullNameList.forEach(function (item) {
        var cover = fs.readFileSync(coveragesPath+item);
        cover = utils.toArrayBuffer(cover);
        var tiffParser = new (require('./GeotiffParser.js')).GeoTIFFParser();
        tiffParser.parseHeader(cover);
        geoTiffMetadataObjectList.push(tiffParser);

        console.log(tiffParser.GetBBox())
    })
}
/////////////////getCoverageSection
function getCoverage(request,response)
{
    var identifier = request.query.identifier;
    //var coverageJSONObject = {
    //    Coverage : [
    //        {Title : coveragesNameList[identifier]},
    //        {Identifier : identifier},
    //        {Abstract : 'null'},
    //        {Reference : {_attr : {
    //            "href" : coverageFilePath,
    //            role : 'coverage'
    //        }}},
    //        {Reference : {_attr : {
    //            "href" : headerFilePath,
    //            role : 'metadata'
    //        }}}
    //
    //    ]
    //};
    //var coveragesJSON = {
    //    Coverages : [coverageJSONObject]
    //};
    //console.log(coverageFilePath)
    //console.log(xml(coveragesJSON,{ declaration: true }))
    ////response.send( xml(coveragesJSON,{ declaration: true }));

    response.download(coveragesPath+coveragesFullNameList[identifier], function (err) {
        if(err)
        {
            console.log("Coverage "+coveragesNameList[identifier]+" didnt send", err)
        }
        else
        {
            console.log("Coverage "+coveragesNameList[identifier]+" sent")
        }
    });
}

function init()
{
    validateCapabilitiesResponse();
    loadMetadata()
}

init();

//////////OperationTypes
RequestTypes = {};
RequestTypes.GETCOVERAGE = "getcoverage";
RequestTypes.GETCAPABILITIES = "getcapabilities";
RequestTypes.DESCRIBECOVERAGE= "describecoverage";

app.use(function(req, res, next) {
    for (var key in req.query)
    {
        req.query[key.toLowerCase()] = req.query[key];
    }
    next();
});

app.get('/WCS',function(request,response){
    var query = request.query;
    var requestType = query.request;
    if(requestType.toLowerCase() == RequestTypes.GETCAPABILITIES)
    {
        getCapabilities(request,response);
    }
    else if(requestType.toLowerCase() == RequestTypes.DESCRIBECOVERAGE)
    {
        describeCoverage(request,response);
    }
    else if(requestType.toLowerCase() == RequestTypes.GETCOVERAGE)
    {
        getCoverage(request,response);
    }
});


var server = app.listen(25565, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('WCS server is listening at //%s:%s', host, port);
});

module.exports.app = app;
