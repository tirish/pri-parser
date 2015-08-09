var _ = require('lodash');

function getResources(xmlData){

    var subTree = xmlData.PriInfo.ResourceMap[0].ResourceMapSubtree;

    var resourcesElem = _.find(subTree, function(elem){

        return elem.$.name === 'Resources' || elem.ResourceMapSubtree[0].$.name === 'Resources';

    });


    if(resourcesElem.$.name !== 'Resources') resourcesElem = resourcesElem.ResourceMapSubtree[0];
    var resources = resourcesElem.NamedResource;


    return _.map(resources, function(res){

        var name = res.$.name;
        var uri = res.$.uri;

        var values = {};

        _.forEach(res.Candidate, function(cand){
            var lang = cand.$.qualifiers;

            if(!_.has(values,lang)) {
                var val = cand.Value[0];
                values[lang] = val;
            }
        });

        return {
            name: name,
            uri: uri,
            values: values
        };

    });


}

module.exports = getResources;