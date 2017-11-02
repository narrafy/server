const facebookApi = require('../facebook-api')
const watson = require('./watson')
const context = require('./context')
const config = require('../config')
const nlg = require('../natural-language/generation')
const email = require('../email')
const db = require('../db')

async function reply(input, stored_log) {

	//populate the request object to send to watson
	const request = watson.populateRequest(input, stored_log)

    if(!request.workspace)
    {
        const { access_token, workspace } = await setContextConfig(input.customer_id)
        if(access_token)
            request.access_token = access_token
        if(workspace)
            request.workspace = workspace
        request.fb_user = true
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

            //get a response from natural language generation service
            let messageArray = await nlg.message(conversation)

            for(let k =0 ; k < messageArray.length; k++)
            {
                await sendReplyToFacebook(request.id, conversation, messageArray[k])
            }
		}
	} catch (err) {
		console.log("error in the reply function " + err.stack)
	}
}

async function sendReplyToFacebook(id, conversation, text) {

    let message = {
        text: text
    }
    //augment facebook message
    //add quick replies
    let currentContext = conversation.context

    if(currentContext && currentContext.quick_replies) {
        message.quick_replies = currentContext.quick_replies
    }
    if(currentContext && currentContext.web_view) {
        let reqData = {
            id: id,
            access_token: currentContext.access_token
        };
        await facebookApi.sendWebView(reqData, currentContext.web_view)
        currentContext.web_view = ""
    } else {
        await facebookApi.sendMessage({
            id: id,
            message: message,
            access_token: currentContext.access_token
        })
    }
    console.log("Watson replies with: " + message.text + " " + id)
}

async function updateMessage(id, conversation) {
    var responseText = null

    if (conversation.output) {

        //run context tasks first
        await context.runContextTasks(conversation)

        //then push context
        await context.pushContext(id, conversation)

        if (conversation.output.text && conversation.output.text[0]) {
            let messages = await nlg.message(conversation)
            return  { conversation , messages }
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

    let messages = await nlg.message(responseText)

    return { conversation, messages }
}

async function setContextConfig(customer_id) {
    //refactor use projection to return only this two fields
    let customerConfig = await db.getConfig(customer_id)
    if(customerConfig)
        return { access_token: customerConfig.facebook.access_token, workspace: customerConfig.conversation.workspace}
    return null
}

async function getContextAndReply(data){
    const {input, stored_log} = await context.getContext(data)
    //if the bot is disabled return
    if(stored_log &&
        stored_log.length > 0 &&
        stored_log[0].bot_active === false ) return
    await reply(input, stored_log)
}

async function messengerRequest(body) {
    var events = body.entry[0].messaging
    for (var i = 0; i < events.length; i++) {
        var event = events[i]
        let data = {
            sender: event.sender.id,
            text: "",
            customer_id: event.recipient.id
        }

        //user interacts with the page for the first time
        if (event.optin || event.postback) {

            switch (event.postback.payload) {
                //user interacts with the page for the first time.
                case 'optin': {
                    await getContextAndReply(data)
                }
                    break
                case 'CONTACT_REQUEST':{

                    data.text= "Narrafy go to sleep"

                    await getContextAndReply(data)

                    //notify admin
                    let admin_message = {
                        id: config.facebook.admin_id,
                        message: {
                            text: "Check the facebook page!"
                        }
                    }

                    await facebookApi.sendMessage(admin_message)
                    email.admin(admin_message.message.text)

                }
                    break

                //clear context button was pressed
                case 'CLEAR_CONTEXT': {

                    //const {input, stored_log} = await context.clearContext(data)


                    //await reply(input, stored_log)
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
                await getContextAndReply(data)
            }
        }
    }
}

async function webRequest(id, body) {
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

    return updateMessage(id, data)
}

module.exports = {

	messengerRequest: messengerRequest,

	async web(req) {
		return webRequest(req.sessionID, req.body)
	},
}