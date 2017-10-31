const natural = require('natural')
const postag = require('pos')
const config = require('../../config')
const tokenizer = new natural.WordTokenizer()
const db = require('../../db')
const log = require('../../log')
const NluClient = require('watson-developer-cloud/natural-language-understanding/v1.js')
const nluClient = new NluClient({
	'username': config.nlu.username,
	'password': config.nlu.password,
	'version_date': '2017-02-27',
	'url': config.nlu.url
})

async function parseContextItem(data) {
    let itemText = data.item.text;
    let semantic_data = parseText(itemText)
    data.semantic_data = semantic_data
    await db.saveSemantics(data)
    return semantic_data
}


function parseText(text) {

    return pos(text)

    /*if(isOneWord(text)){
        return pos(text)
    }

    try{
        const parameters = {
            'features': {
                'semantic_roles': {}
            },
            'text': text
        }
        let watsonData = await analyze(parameters)
        if (watsonData)
            return watsonData
        return pos(text)

    }catch (e) {
        return pos(text);
    }*/
}

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
        usage:  {
            text_units: 0,
            text_characters: 0,
            features: 1
        },
        semantic_roles: [
            {
                sentence: sentence,
                subject: subjects,
                object: objects,
                action: actions
            }
        ]
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
        tag === "JJS";
}

function isSubjectPOS(tag){
    return tag === "NN" ||
        tag === "NNP" ||
        tag === "NNPS" ||
        tag === "NNS";
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
	semanticParse: parseContextItem,
    pos:pos
}