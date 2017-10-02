const natural = require('natural')
const config = require('../../config')
const tokenizer = new natural.WordTokenizer()
const db = require('../db')
const NluClient = require('watson-developer-cloud/natural-language-understanding/v1.js')
const nluClient = new NluClient({
	'username': config.nlu.username,
	'password': config.nlu.password,
	'version_date': '2017-02-27',
	'url': config.nlu.url
})

async function semanticParse(context, array) {

    var conversation_id = context.conversation_id
    var parsedArray = []
    for (let i = 0; i < array.length; i++) {
        var context_var_name = array[i]
        if (context && context.hasOwnProperty(context_var_name)) {
            //found the context variable to send to semantic parser
            var context_var = context[context_var_name]
            if (context_var) {
                const item = await parseItem(context_var, context_var_name, conversation_id)
                parsedArray[context_var_name] = item
            }
        }
    }
    return parsedArray
}

async function parseItem(context_var, context_var_name, conversation_id) {
    if (isSentence(context_var)) {
        const semantic_data = await parseText(context_var)
        await db.saveSemantics({
            conversation_id: conversation_id,
            context_var: context_var_name,
            semantics: semantic_data
        })
        return semantic_data
    }
}

function isSentence(context_variable) {
    const tokenized_sentence = tokenizer.tokenize(context_variable)
    return tokenized_sentence.length > 1
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
	semanticParse: semanticParse
}