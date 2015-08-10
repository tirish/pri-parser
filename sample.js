var path = require('path');

var input = path.resolve('./resources.pri');

var pri = require('./index');

var config = {

    makePriPath: undefined, //priority over windowsVersion & makePriArch
    windowsVersion: undefined,
    makePriArch: undefined,
    xmlFileName: undefined,
    xmlFilePath: undefined, //priority over xmlFileName
    keepXml: undefined,
    verbose: false,
    uriOnly: true
};
pri.parse(input,config,function(data){

    console.log(JSON.stringify(data,null,2));
});