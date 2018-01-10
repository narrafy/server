const config = require('../config')
const WatsonClient = require('watson-developer-cloud/conversation/v1')

const conversation = new WatsonClient({
	username: config.conversation.username,
	password: config.conversation.password,
	url: config.conversation.url,
	version_date: '2017-05-26',
	/* headers: {
        "X-Watson-Learning-Opt-Out": "1"
    }*/
})

function createPayload(data) {
	if (!data.workspace) {
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
		workspace_id: data.workspace,
		context: {
			access_token: data.access_token,
			workspace: data.workspace,
			fb_user: data.fb_user
		},
		input: {}
	}

	if (data && data.text) {
		payload.input.text = data.text
	}
	if (data && data.context) {
		// The client must maintain context/state
		payload.context = data.context
		payload.context.workspace = data.workspace
		payload.context.fb_user = data.fb_user
	}
	return payload
}

async function ask(data) {

	const payload = createPayload(data)

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

function populateRequest(input, stored_log) {
	var request = {
		id: input.sender,
		text: input.text,
		workspace: input.workspace,
		access_token: input.access_token
	}
	if (stored_log[0] && stored_log[0].context) {
		request.context = stored_log[0].context;
	}
	return request
}

module.exports = {
	populateRequest: populateRequest,
	ask: ask,
}