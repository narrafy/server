/* natural language understanding */

var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

var nlu = new NaturalLanguageUnderstandingV1({
    'username': process.env.NATURAL_LANGUAGE_UNDERSTANDING_USERNAME,
    'password': process.env.NATURAL_LANGUAGE_UNDERSTANDING_PASSWORD,
    'version_date': '2017-02-27',
    'url': process.env.NLU_URL
});


function getSemanticRoles(sentence, cb) {

    var parameters = {
        'features': {
            'semantic_roles': {}
        },
        'text': sentence
    };
    nlu.analyze(parameters, function(err, response) {
        if (err)
            console.log('error:', err);
        else if(cb){
            cb(response);
        }
    });
}

module.exports = {
    GetSemanticRoles: (sentence, cb) => {
        getSemanticRoles(sentence, cb);
    }
};