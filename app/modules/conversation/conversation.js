const facebookApi = require('../facebook-api')
const watson = require('./watson')
const context = require('./context')
const nlg = require('../natural-language/generation')
const email = require('../email')

async function reply(input, stored_log, setcontext, db) {

	//populate the request object to send to watson
	const request = watson.populateRequest(input, stored_log)

    if(!request.workspace)
    {
        const { access_token, workspace } = setcontext;
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
            await context.runContextTasks(conversation, db)

            let ctx = conversation.context

            if(ctx){
                if(ctx.bot_active === false){
                    //return from function, don't push the context, human is talking
                    return conversation
                }else{
                    //then push to storage
                    await db.pushContext(request.id, conversation)
                }
            }

            //get a response from natural language generation service
            let messageArray = await nlg.message(conversation)

            for(let k =0 ; k < messageArray.length; k++)
            {
                await sendReplyToFacebook(request.id, conversation, messageArray[k])
            }
            return conversation
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

async function updateMessage(id, conversation, db) {
    var responseText = null

    if (conversation.output) {

        //run context tasks first
        await context.runContextTasks(conversation, db)

        //then push context
        await db.pushContext(id, conversation)

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

    await context.runContextTasks(conversation, db)

    await db.pushContext(id, conversation)

    let messages = await nlg.message(responseText)

    return { conversation, messages }
}

async function getContextAndReply(data, context, db){

    const {input, stored_log} = await context.getContext(data)

    await reply(input, stored_log, context, db)
}

async function PauseBot(data, context, db) {

    data.text = "shutdown"

    const {input, stored_log} = await context.getContext(data)


    const conversation = await reply(input, stored_log, context)

    //store the fact that the bot is disabled
    db.pushContext(data.sender, conversation)

    let dt = {
        id: data.sender,
        message: {
            text: "A person will shortly take over. I'm going back to training 💪. Call my name and I will be back!"
        },
        access_token: stored_log[0].context.access_token
    }

    await facebookApi.sendMessage(dt)

    //notify admin
    email.admin("Check the facebook page!")
}

async function messengerRequest(body, context, db) {
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
                    await getContextAndReply(data, context, db)
                }
                    break
                case 'CONTACT_REQUEST': {

                    await PauseBot(data)
                }
                    break

                //clear context button was pressed
                case 'CLEAR_CONTEXT': {

                    data.text= "let's try again"

                    await getContextAndReply(data, context, db)
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
                await getContextAndReply(data, context, db)
            }
        }
    }
}

async function webRequest(id, data, db) {
    //Send the input to the conversation service
    data = await watson.ask(data);
    return updateMessage(id, data, db)
}


module.exports = {

	messengerRequest: messengerRequest,

	async web(id, data, db) {
		return webRequest(id, data, db)
	},

    getStoryStub: nlg.getStoryStub,
}