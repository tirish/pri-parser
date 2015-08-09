//var parser = require('./resources-parser');
var parser = require('./xml-simplifier');
var decompile = require('./decompile');
var _ = require('lodash');

function run(inputFile,config, callback){

    if(_.isFunction(config)){
        callback = config;
        config = {};
    }

    decompile(inputFile,config,function(data){
        callback(parser(data, config.uriOnly));
    });

}

module.exports = run;