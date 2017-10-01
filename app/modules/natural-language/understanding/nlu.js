const config = require('../../config')
const NluClient = require('watson-developer-cloud/natural-language-understanding/v1.js')
const nluClient = new NluClient({
	'username': config.nlu.username,
	'password': config.nlu.password,
	'version_date': '2017-02-27',
	'url': config.nlu.url
})

async function getSemanticRoles(sentence, cb) {

	const parameters = {
		'features': {
			'semantic_roles': {}
		},
		'text': sentence
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
	getSemanticRoles: getSemanticRoles
}