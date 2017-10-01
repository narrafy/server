const facebookApi = require('../facebook-api')
const watson = require('./watson')
const context = require('./context')

//callback after the message was received by the backend
async function callback_received_message(input, stored_log) {

	//populate the request object to send to watson
	const request = watson.populateRequest(input, stored_log)

	//Send the input to the conversation service
	try {

		const conversation = await watson.ask(request)
		if (conversation && conversation.output) {
			const context_data = await context.pushContext(request.id, conversation)
			//watson have an answer
			//declare local variables
			var currentContext = context_data.context

			var message = {}
			//mine watson response
			message.text = watson.mineResponse(context_data.output.text)
			//add quick replies to facebook message
			if (currentContext && currentContext.quick_replies) {
				message.quick_replies = currentContext.quick_replies
			}
			//if its a recap node, send the story to the user
			//if(context.IsRecapNode(data.context))
			//{
			//   message.text = context.GetRecapStory(data);
			//   fb.SendMessage(request.id, message);
			// } else {
			await facebookApi.sendMessage(request.id, message)
			console.log("Watson replies with: " + message.text + " " + request.id)
			await context.runContextTasks(conversation)

		} else {
			await facebookApi.sendMessage(request.id, {
				text: 'I am probably training again.' +
				'Please write me later!'
			})
		}

	} catch (err) {
		console.log("error in the facebook callback function " + err)
		await facebookApi.sendMessage(request.id, {text: err})
	}
}

async function messengerRequest(body) {
	var events = body.entry[0].messaging
	for (var i = 0; i < events.length; i++) {
		var event = events[i]
		var data = {
			sender: event.sender.id,
			text: ""
		}

		//user interacts with the page for the first time
		if (event.optin || event.postback) {
			switch (event.postback.payload) {
				//user interacts with the page for the first time.
				case 'optin': {
					const {input, stored_log} = await context.getContext(data)
					await callback_received_message(input, stored_log)
				}
					break
				case 'CONTACT_REQUEST':
					await facebookApi.sendMessage(data.sender, "Human on the way. We will contact you as soon as possible!")
					await facebookApi.sendMessage(process.env.ADMIN_FB_ID, "Check the facebook page!")
					break
				//clear context button was pressed
				case 'CLEAR_CONTEXT': {
					const {input, stored_log} = await context.clearContext(data)
					await callback_received_message(input, stored_log)
				}
					break
				default:
					break
			}
		}

		//a conversation starts
		if (event.message) {
			//user picks from quick replies
			if (event.message.text) {
				if (event.message.text === "Let's try again") {
					const {input, stored_log} = await context.clearContext(data)
					await callback_received_message(input, stored_log)
				} else {
					data.text = event.message.text
					const {input, stored_log} = await context.getContext(data)
					await callback_received_message(input, stored_log)
				}
			}
		}
	}
}

async function webRequest(id, body, res) {
	var data = {};
	if (body) {
		if (body.input) {
			data.text = body.input.text
		}
		if (body.context) {
			data.context = body.context
		}
	}

	//Send the input to the conversation service
	data = await watson.ask(data);
	const response = await updateMessage(id, data)
	return res.json(response)
}

async function updateMessage(id, conversation) {
	var responseText = null
	if (conversation.output) {

		await context.pushContext(id, conversation)
		await context.runContextTasks(conversation)

		if (conversation.output.text && conversation.output.text[0]) {
			//if(context.IsRecapNode(data.context)){
			//    data.output.text = context.GetRecapStory(data);
			//} else {
			conversation.output.text = watson.mineResponse(conversation.output.text)
			//}
			return conversation
		}
	} else {
		conversation.output = {}
	}

	if (conversation.intents && conversation.intents[0]) {
		var intent = conversation.intents[0]
		if (intent.confidence >= 0.75) {
			responseText = "I understood you but I don't have an answer yet. Could you rephrase your question? "
		} else {
			responseText = "I didn't get that. Sometimes only a human can help. Do you want to talk to one?"
		}
	}

	await context.pushContext(id, conversation)
	await context.runContextTasks(conversation)

	//if(context.IsRecapNode(data.context)){
	//  data.output.text = context.GetRecapStory(data);
	//} else {
	conversation.output.text = watson.mineResponse(responseText)
	//}
	return conversation
}

module.exports = {

	messengerRequest: messengerRequest,

	async web(req, res) {
		return webRequest(req.sessionID, req.body, res)
	},
}