var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

var nlu = new NaturalLanguageUnderstandingV1({
    'username': process.env.NATURAL_LANGUAGE_UNDERSTANDING_USERNAME,
    'password': process.env.NATURAL_LANGUAGE_UNDERSTANDING_PASSWORD,
    'version_date': '2017-02-27'
});


function getSemanticRoles(sentence) {

    var parameters = {
        'features': {
            'semantic_roles': {}
        },
        'text': sentence
    };
    var semanticRoles = "";

    nlu.analyze(parameters, function(err, response) {
        if (err)
            console.log('error:', err);
        else{
            semanticRoles = JSON.stringify(response, null, 2);
            console.log(semanticRoles);
        }
    });
    return semanticRoles;
}

module.exports = {
    GetSemanticRoles: (sentence) => {
        getSemanticRoles(sentence);
    }
};