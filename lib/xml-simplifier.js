
var _ = require('lodash');

function simplifyResourceMap(resourceMap){

    var sub;

    if(resourceMap) {
        sub = {};
        _.forEach(resourceMap, function (subtree) {

            var obj = sub[subtree.$.name] = {
                name: subtree.$.name

            };

            var children = simplifyNode(subtree);
            obj.resourceMap = children.resourceMap;
            obj.namedResource = children.namedResource;

        });
    }

    return sub;

}

function simplifyNamedResource(namedResource){
    var sub;
    if(namedResource) {
        sub = {};
        _.forEach(namedResource, function (subtree) {


            var obj = sub[subtree.$.name] = {
                name: subtree.$.name,
                uri: subtree.$.uri,
                values: _.map(subtree.Candidate, function(cand){
                    var lang = cand.$.qualifiers;
                    return {
                        lang: _.isString(lang) ? lang.replace('Language-',''):lang,
                        isDefault: cand.$.isDefault,
                        type: cand.$.type,
                        value: cand.Value[0]
                    };
                })

            };

            var children = simplifyNode(subtree);
            obj.resourceMap = children.resourceMap;
            obj.namedResource = children.namedResource;

        });
    }
    return sub;
}

function simplifyNode(subtree){
    var sub = {};
    if(subtree.ResourceMapSubtree){
        sub.resourceMap = simplifyResourceMap(subtree.ResourceMapSubtree);
    }
    if(subtree.NamedResource){
        sub.namedResource = simplifyNamedResource(subtree.NamedResource);
    }
    return sub;
}

function simplify(xmlData){

    var clean = {};

    var top = xmlData.PriInfo.ResourceMap;


    _.forEach(top, function(topLevel){
        var $ = topLevel.$;
        var langs = topLevel.Qualifiers[0].Language[0];
        clean[$.name] = {
            name: $.name,
            primary: !!$.primary,
            version: $.version,
            languages: langs ? _.isString(langs) ? langs.split(',') : langs : [],
            resourceMap: simplifyResourceMap(topLevel.ResourceMapSubtree),
            namedResource: simplifyNamedResource(topLevel.NamedResource)
        };


    });

    return clean;
}


function simplifyUriOnlyNode(node,arr){

    if(node.namedResource){
        //add em
        _.forIn(node.namedResource, function(subNode){
            arr.push({name: subNode.name, uri: subNode.uri, values: subNode.values});
        });
    }

    if(node.resourceMap){
        //recurse
        _.forIn(node.resourceMap, function(subNode){
           simplifyUriOnlyNode(subNode,arr);
        });
    }

}


function simplifyUriOnly(xmlData){


    var simple = simplify(xmlData);
    var arr = [];
    _.forIn(simple, function(value){
       simplifyUriOnlyNode(value,arr);
    });

    return arr;
}


module.exports = function(xmlData,uriOnly){
    if(uriOnly){
        return simplifyUriOnly(xmlData);
    } else {
        return simplify(xmlData);
    }
};