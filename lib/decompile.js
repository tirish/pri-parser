var child = require('child_process');
var path = require('path');
var fs = require('fs');
var xml = require('xml2js');
var findMakePri = require('./find-make-pri');
var _ = require('lodash');

var tmpDirectory = path.resolve('./tmp');

function parseXml(filePath, callback){

    var parser = new xml.Parser();
    fs.readFile(filePath, function(err, data) {
        parser.parseString(data, function (err, result) {
            callback(result);
        });
    });

}

function decompile(priFilePath, config, callback){

    if(_.isFunction(config)){
        callback = config;
        config = {};
    }

    //configure
    var makePriPath = config.makePriPath || findMakePri(config.windowsVersion, config.makePriArch);
    var outputFileName = config.xmlFileName || 'tmp_'+new Date().getTime();
    var outputFilePath = config.xmlFilePath;
    if(!outputFilePath){
        //put it in tmp directory
        if(!fs.existsSync(tmpDirectory))
            fs.mkdirSync(tmpDirectory);

        outputFilePath = path.join(tmpDirectory,outputFileName+'.xml');
    }

    if(!fs.existsSync(makePriPath)){
        throw 'Expected makepri.exe to be located at: '+makePriPath;
    }


    fs.exists(outputFilePath, function(result){

        if(result){
            console.log('removing output file');
            fs.unlinkSync(outputFilePath);
        }

        var makePri = child.execFile(makePriPath,['dump','/if',priFilePath,'/of',outputFilePath],
            function (error, stdout, stderr) {
                stdout = stdout.replace(/\00/g,'');

                if(stdout && config.verbose)
                    console.log(stdout);
                if(stderr && config.verbose)
                    console.log(stderr);
                if (error !== null)
                    console.log(error);

            });

        makePri.on('close', function(){
            parseXml(outputFilePath, function(data){

                if(config.keepXml){
                    callback(data);
                } else {
                    if(config.verbose)
                        console.log('removing xml file: ' + outputFilePath);
                    fs.unlink(outputFilePath, function () {
                        callback(data);

                    });
                }
            });

        });

    });


}



module.exports = decompile;