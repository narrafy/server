const db = require('../db')
const emailService = require('../email')
const nlu = require('../natural-language/understanding')
const nlg = require('../natural-language/generation')
const config = require('../config')
const logger = require('pino')()

/* tasks to run after the context of a conversation is pushed to the database
 * it's usually to send an email or parse the context variable */
async function runContextTasks(conversation) {

    const conversation_id = conversation.context.conversation_id
    let context = conversation.context

    if(context.parse_node && context.parse_node === true ){
        let text = conversation.input.text
        let semantics = nlu.pos(text)

        let data = {
            text: text ,
            node_name: context.input_node_name,
            conversation_id: context.conversation_id,
            semantics : semantics
        }

        if(semantics)
        {
            if(context.hasOwnProperty(context.input_node_name))
            {
                let context_var = context[context.input_node_name]
                if(context_var) {

                    if(semantics.object)
                        context_var.object = semantics.object[0]

                    if(semantics.subject)
                        context_var.subject = semantics.subject[0]

                    if(semantics.action)
                        context_var.action = semantics.action[0]
                }
            }

            await db.saveSemantics(data)
        }

    }

    if (isEmailNode(conversation)) {
            let email = getEmailFromContext(conversation)
            if(email && isSendStoryNode(conversation))
            {
                let stories = await db.getStories({
                    conversation_id: conversation_id })
                if(stories.length > 0){
                    emailService.story(email, stories)
                    let data = {
                        email: email,
                        date: new Date(),
                    };
                    db.addSubscriber(data)
                }
            }
        }

    if(shouldEnableBot(conversation))
        conversation.bot_active = true

    if(shouldPauseBot(conversation))
        conversation.bot_active = false
        
  //  if (is3RdNode(conversation))
    //   emailService.admin("Someone is talking to the bot. Remember to train on the input!")

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


function isSendStoryNode(conversation) {
    return (conversation.context && conversation.context.send_story) ||
        (conversation.context && conversation.context.user_email);

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
	clearContext: db.clearContext,
}