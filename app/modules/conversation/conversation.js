const facebookApi = require('../facebook-api')
const watson = require('./watson')
const context = require('./context')
const config = require('../config')
const nlg = require('../natural-language/generation')

//callback after the message was received by the backend
async function receiveMessage(input, stored_log) {

	//populate the request object to send to watson
	const request = watson.populateRequest(input, stored_log)

	//Send the input to the conversation service
	try {

	    const conversation = await watson.ask(request)
        //watson have an answer
        if (conversation && conversation.output) {

		    //run tasks first, context might change here
            await context.runContextTasks(conversation)

            //then push to db
			await context.pushContext(request.id, conversation)


            let message = {}

            //get a response from natural language generation
            message.text = await nlg.message(conversation)

            //augment facebook message
            //add quick replies
            let currentContext = conversation.context;
            if(currentContext && currentContext.quick_replies) {
                message.quick_replies = currentContext.quick_replies
            }
            if(currentContext && currentContext.web_view) {
                await facebookApi.sendWebView(request.id, currentContext.web_view)
                currentContext.web_view = ""
            }
            else
                await facebookApi.sendMessage(request.id, message)
			console.log("Watson replies with: " + message.text + " " + request.id)

		} else {
			await facebookApi.sendMessage(request.id, {
				text: 'I am probably training again.' +
				'Please write me later!'
			})
		}

	} catch (err) {
		console.log("error in the facebook callback function " + err.stack)
	}
}


async function updateMessage(id, conversation) {
    var responseText = null
    if (conversation.output) {

        //run context tasks first
        await context.runContextTasks(conversation)

        //then push context
        await context.pushContext(id, conversation)

        if (conversation.output.text && conversation.output.text[0]) {

            conversation.output.text = await nlg.message(conversation)

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


    await context.runContextTasks(conversation)

    await context.pushContext(id, conversation)

    conversation.output.text = await nlg.message(responseText)

    return conversation
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
                    await receiveMessage(input, stored_log)
                }
                    break
                case 'CONTACT_REQUEST':
                    await facebookApi.sendMessage(data.sender, "Human on the way. We will contact you as soon as possible!")
                    await facebookApi.sendMessage(config.facebook.admin_id, "Check the facebook page!")
                    break
                //clear context button was pressed
                case 'CLEAR_CONTEXT': {
                    const {input, stored_log} = await context.clearContext(data)
                    await receiveMessage(input, stored_log)
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
                    await receiveMessage(input, stored_log)
                } else {
                    data.text = event.message.text
                    const {input, stored_log} = await context.getContext(data)
                    await receiveMessage(input, stored_log)
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

module.exports = {

	messengerRequest: messengerRequest,

	async web(req, res) {
		return webRequest(req.sessionID, req.body, res)
	},
}