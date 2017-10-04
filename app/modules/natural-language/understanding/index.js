const natural = require('natural')
const config = require('../../config')
const tokenizer = new natural.WordTokenizer()
const db = require('../../db')
const NluClient = require('watson-developer-cloud/natural-language-understanding/v1.js')
const nluClient = new NluClient({
	'username': config.nlu.username,
	'password': config.nlu.password,
	'version_date': '2017-02-27',
	'url': config.nlu.url
})

const log = require('../../log')

async function parseContextItem(data) {
    let itemText = data.item.text;
    try {
        if (isSentence(itemText)) {
            let semantic_data = await parseText(itemText)
            data.semantic_data = semantic_data
            await db.saveSemantics(data)
            return semantic_data
            }
        }catch(e){
            log.error(e)
            return null
    }
}

function isSentence(sentence) {
    const tokenizedSentence = tokenizer.tokenize(sentence)
    return tokenizedSentence.length > 1
}

async function parseText(text) {
    const parameters = {
        'features': {
            'semantic_roles': {}
        },
        'text': text
    }
    return analyze(parameters)
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