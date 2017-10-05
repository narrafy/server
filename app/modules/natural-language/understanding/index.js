const natural = require('natural')
const pos = require('pos')
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
    let semantic_data = await parseText(itemText)
    data.semantic_data = semantic_data
    await db.saveSemantics(data)
    return semantic_data
}


function isOneWord(sentence) {
    const tokenizedSentence = tokenizer.tokenize(sentence)
    return tokenizedSentence.length === 1
}

async function parseText(text) {
    if(isOneWord(text)){
        return parseTextV2(text)
    }
    try{
        const parameters = {
            'features': {
                'semantic_roles': {}
            },
            'text': text
        }
        return analyze(parameters)

    }catch (e) {
        return parseTextV2(text);
    }
}

function parseTextV2(sentence){

    let words = new pos.Lexer().lex(sentence);
    let taggedWords = new pos.Tagger().tag(words);
    let semantic_data= {};
    for (let i in taggedWords) {
        var taggedWord = taggedWords[i];
        var word = taggedWord[0];
        var tag = taggedWord[1];
        if(isActionPOS(tag))
        {
            return semantic_data = {
                usage:  {
                    text_units: 0,
                    text_characters: 0,
                    features: 1
                },
                semantic_roles: [
                    {
                        sentence: sentence,
                        subject: {
                            text: ""
                        },
                        object: {
                            text: ""
                        },
                        action: {
                            text: word,
                            normalized: "",
                            verb: {
                                text: word,
                                tense: tag
                            }
                        }
                    }
                ]
            };
        }
        if(isObjectPOS(tag))
        {
            return semantic_data = {
                usage:  {
                    text_units: 0,
                    text_characters: 0,
                    features: 1
                },
                semantic_roles: [
                    {
                        sentence: sentence,
                        subject: {
                            text: ""
                        },
                        object: {
                            text: word
                        },
                        action: {
                            text: "",
                            normalized: "",
                            verb: {
                                text: "",
                                tense: ""
                            }
                        }
                    }
                ]
            };
        }
    }
    return null;
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
	semanticParse: parseContextItem
}