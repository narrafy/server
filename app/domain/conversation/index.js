const facebookApi = require('../facebook')
const watson = require('./watson')
const context = require('./context')
const nlg = require('../../service/nlp/generation')
const email = require('../../service/email')
const storage = require('./storage')
const Customer = require('../customer')

async function getStats(db) {
    let model= {};
    let avg_model = await db.getAvgStats()

    if(avg_model) {
        model.avg_minutes = Number((avg_model.minutes).toFixed(2));
        model.avg_counter = Number((avg_model.counter).toFixed(2));
    }

    let total_count = await db.getConversationCount()
    if(total_count && total_count.length > 0){
        model.total_count = total_count[0].total_doc
    }
    model.dataset = [];

    let dataset = await db.getConversationDataSet()
    if(dataset){
        dataset.forEach(item =>
        {
            model.dataset.push({counter: item.counter, minutes: Number((item.minutes).toFixed(2))});
        })
    }

    return model
}

async function reply(input, stored_log, setcontext) {

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
            await context.runContextTasks(conversation)

            let ctx = conversation.context

            if(ctx){
                if(ctx.bot_active === false){
                    //return from function, don't push the context, human is talking
                    return conversation
                }else{
                    //then push to storage
                    conversation.id = request.id;
                    conversation.date = new Date();
                    await storage.pushContext(conversation)
                }
            }

            //get a response from natural language generation service
            let messageArray = nlg.parse(conversation.output.text)

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

async function updateMessage(id, conversation) {

    if (conversation.output) {

        //run context tasks first
        await context.runContextTasks(conversation)

        //then push context
        conversation.id = id
        conversation.date = new Date()
        await storage.pushContext(conversation)

        if (conversation.output.text && conversation.output.text[0]) {
            let messages = nlg.parse(conversation.output.text)
            conversation.output.text = concatenateMessage(messages)
            return  { conversation }
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

    conversation.id = id
    conversation.date = new Date()

    await storage.pushContext(conversation)

    let responseText = null
    let messages = nlg.parse(responseText)
    conversation.output.text = concatenateMessage(messages)
    return { conversation }
}

async function getContextAndReply(data, context){

    const {input, stored_log} = await context.getContext(data)

    await reply(input, stored_log, context)
}

async function PauseBot(data, context) {

    data.text = "shutdown"

    const {input, stored_log} = await context.getContext(data)


    const conversation = await reply(input, stored_log, context)
    conversation.id = data.sender;
    conversation.date = new Date();

    //store the fact that the bot is disabled
    await storage.pushContext(conversation)

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

async function messengerRequest(body, context) {
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
                    await getContextAndReply(data, context)
                }
                    break
                case 'CONTACT_REQUEST': {

                    await PauseBot(data)
                }
                    break

                //clear context button was pressed
                case 'CLEAR_CONTEXT': {

                    data.text= "let's try again"

                    await getContextAndReply(data, context)
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
                await getContextAndReply(data, context)
            }
        }
    }
}

async function webRequest(id, data) {
    //Send the input to the conversation service
    data = await watson.ask(data);
    return updateMessage(id, data)
}

function concatenateMessage(messages) {
    let messageArray = []

    if(messages){
        messages.forEach(item => {
            messageArray.push(item)
        })
    }
    return messageArray.join(" ")
}

async function getWorkspace(email) {
    //refactor use projection to return only this two fields
    let customer = await Customer.findOne(email)
    //this information could be stored in the json token
    return customer? { access_token: customer.config.facebook.access_token, workspace: customer.config.conversation.workspace}:null
}

module.exports = {

    async web(id, data) {
        return webRequest(id, data)
    },

    messengerRequest: messengerRequest,
    getWorkspace: getWorkspace,
    push: storage.pushContext,
    get: storage.getContextById,
    getConversationCount: storage.getConversationCount,
    getAvgStats: storage.getAvgStats,
    getConversationDataSet: storage.getConversationDataSet,
    getThreadList: storage.getThreadList,
    getThread: storage.getThread,
}