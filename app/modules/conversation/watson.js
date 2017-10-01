const emojiReplacer = require('../utils/emoji')
const config = require('../config')
const WatsonClient = require('watson-developer-cloud/conversation/v1')
const watson_workspace = config.watson.workspaceId

const conversation = new WatsonClient({
	// If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checkedx
	// After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
	username: config.conversation.username,
	password: config.conversation.password,
	url: config.conversation.url,
	version_date: '2017-02-03',
	version: 'v1'
})

function createPayload(data, workspace) {
	if (!workspace) {
		return {
			'output': {
				'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' +
				'<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' +
				'Once a workspace has been defined the intents may be imported from ' +
				'<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
			}
		}
	}
	var payload = {
		workspace_id: workspace,
		context: {},
		input: {}
	}

	if (data && data.text) {
		payload.input.text = data.text
	}
	if (data && data.context) {
		// The client must maintain context/state
		payload.context = data.context
	}
	return payload
}

async function ask(data) {

	const payload = createPayload(data, watson_workspace)

	return new Promise((resolve, reject) => {
		conversation.message(payload, function (err, response) {
			if (err) {
				reject(err)
			} else {
				resolve(response)
			}
		})
	})

}

function mineResponse(data) {
	var text = ''
	if (data) {
		if (data.length > 0 && data[1]) {
			text = data[0] + ' ' + data[1]
		} else if (data[0]) {
			text = data[0]
		}
	}
	return emojiReplacer.replaceEmojiKey(text)
}

function populateRequest(input, stored_log) {
	var request = {
		id: input.sender,
		text: input.text
	}
	if (stored_log[0] && stored_log[0].context) {
		request.context = stored_log[0].context
	}
	return request
}

module.exports = {
	mineResponse: mineResponse,
	populateRequest: populateRequest,
	ask: ask,
}