const natural = require('natural')
const postag = require('pos')
const config = require('../../config')
const db = require('../../db')
const log = require('../../log')
const NluClient = require('watson-developer-cloud/natural-language-understanding/v1.js')
const nluClient = new NluClient({
	'username': config.nlu.username,
	'password': config.nlu.password,
	'version_date': '2017-02-27',
	'url': config.nlu.url
})

//function to parse a sentence and assign a part
//of speech to an item
function pos(sentence){

    let words = new postag.Lexer().lex(sentence);
    let taggedWords = new postag.Tagger().tag(words);
    let objects = [];
    let actions = [];
    let subjects = [];
    for (let i in taggedWords) {
        var taggedWord = taggedWords[i];
        var word = taggedWord[0];
        var tag = taggedWord[1];


        if(isActionPOS(tag))
        {
           actions.push(word)
        }
        if(isObjectPOS(tag))
        {
            objects.push(word)
        }
        if(isSubjectPOS(tag))
        {
            subjects.push(word)
        }
    }

    return {
        sentence: sentence,
        subject: subjects,
        object: objects,
        action: actions
    };
}

function isActionPOS(word) {
    return word === "VB" ||
        word === "VBD" ||
        word === "VBG" ||
        word === "VBN" ||
        word === "VBZ" ||
        word ===  "VBP"
}

function isObjectPOS(tag)
{
    return tag === "JJ" ||
        tag === "JJR" ||
        tag === "JJS" //||
        //tag === "NN" ||
        //tag === "NNP" ||
        //tag === "NNPS" ||
        //tag === "NNS"
}

function isSubjectPOS(tag){
    return tag === "PRP" ||
        tag === "PRP"
}

async function analyze(parameters) {
    return new Promise((resolve, reject) => {
        nluClient.analyze(parameters, function (err, response) {
            if (err) {
                reject(err)
            } else {
                resolve(response)
            }
        })
    })
}

module.exports = exports = {
    pos:pos
}