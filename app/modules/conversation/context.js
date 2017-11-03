const db = require('../db')
const emailService = require('../email')
const config = require('../config')

/* tasks to run after the context of a conversation is pushed to the database
 * it's usually to send an email or parse the context variable */
async function runContextTasks(conversation) {

    let context = conversation.context
    const conversation_id = context.conversation_id

    if (isEmailNode(conversation)) {
            let email = getEmailFromContext(conversation)
            if(email)
            {
                let data = {
                    email: email,
                    date: new Date(),
                };
                db.addSubscriber(data)
                emailService.admin("Check conversation id: " + conversation_id)
            }
        }

    if(shouldEnableBot(conversation))
        context.bot_active = true

    if(shouldPauseBot(conversation))
        context.bot_active = false
        
    if (is3RdNode(conversation))
       emailService.admin("Someone is talking to the bot. Remember to train on the input!")

    if(conversation.context.help_request)
        emailService.admin("Help is needed! Check the facebook page ASAP!")
}

function getEmailFromContext(conversation){
    let email = conversation.input.text;
    if(validateEmail(email))
        return email
    return null
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


function isEmailNode(conversation) {
	return conversation.entities &&
		conversation.entities[0] &&
		conversation.entities[0].entity === "email"
}

function shouldPauseBot(conversation) {
    return conversation.intents &&
        conversation.intents[0] &&
        conversation.intents[0].intent === "pause_watson"
}

function shouldEnableBot(conversation) {
    return conversation.intents &&
        conversation.intents[0] &&
        conversation.intents[0].intent === "enable_watson"
}

function is3RdNode(conversation) {
	return conversation.context &&
		conversation.context.system &&
		conversation.context.system.dialog_request_counter === 3
}

module.exports = {
	runContextTasks: runContextTasks,
	pushContext: db.pushContext,
	getContext: db.getContext,
}