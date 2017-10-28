const facebookApi = require('../facebook-api')
const watson = require('./watson')
const context = require('./context')
const config = require('../config')
const nlg = require('../natural-language/generation')
const email = require('../email')
const db = require('../db')

//callback after the message was received by the backend
async function reply(input, stored_log) {

	//populate the request object to send to watson
	const request = watson.populateRequest(input, stored_log)

    if(!request.workspace)
    {
        const { access_token, workspace } = await setContextConfig(input.customer_id)
        request.access_token = access_token
        request.workspace = workspace
    }

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
                let reqData = {
                    id: request.id,
                    access_token: currentContext.access_token
                };
                await facebookApi.sendWebView(reqData, currentContext.web_view)
                currentContext.web_view = ""
            } else {
                await facebookApi.sendMessage({
                    id: request.id,
                    message: message,
                    access_token: currentContext.access_token
                })
            }

			console.log("Watson replies with: " + message.text + " " + request.id)

		}

	} catch (err) {
		console.log("error in the reply function " + err.stack)
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

async function setContextConfig(customer_id)
{
    //refactor use projection to return only this two fields
    let customerConfig = await db.getConfig(customer_id)
    return { access_token: customerConfig.facebook.access_token, workspace: customerConfig.conversation.workspace}
}

async function messengerRequest(body, customer_id) {
    var events = body.entry[0].messaging
    for (var i = 0; i < events.length; i++) {
        var event = events[i]
        let data = {
            sender: event.sender.id,
            text: "",
            customer_id: customer_id
        }

        //user interacts with the page for the first time
        if (event.optin || event.postback) {

            switch (event.postback.payload) {
                //user interacts with the page for the first time.
                case 'optin': {

                    const { input, stored_log } = await context.getContext(data)

                    await reply(input, stored_log)

                   }
                   break
                case 'CONTACT_REQUEST':{
                    let config = await db.getConfig(customer_id)
                    //reply to the user
                    let user_message = {
                        id: data.sender,
                        message: {
                            text: "Human on the way. We will contact you as soon as possible!"
                        },
                        access_token: config.facebook.access_token
                    }
                    await facebookApi.sendMessage(user_message)

                    //notify admin
                    let admin_message = {
                        id: config.facebook.admin_id,
                        message: {
                            text: "Check the facebook page!"
                        }
                    }
                    email.notifyAdmin(admin_message.message.text)

                    await facebookApi.sendMessage(admin_message)
                }
                    break

                //clear context button was pressed
                case 'CLEAR_CONTEXT': {

                    const {input, stored_log} = await context.clearContext(data)

                    await reply(input, stored_log)
                }
                    break
                default:
                    break
            }
        }

        //a conversation starts
        if (event.message) {
            if (event.message.text) {
                    data.text = event.message.text
                    const {input, stored_log} = await context.getContext(data)
                    await reply(input, stored_log)
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

            let customer_id = body.context.customer_id
            const { access_token, workspace } = await setContextConfig(customer_id)
            data.access_token = access_token
            data.workspace = workspace
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