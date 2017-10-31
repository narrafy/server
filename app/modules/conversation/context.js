const db = require('../db')
const emailService = require('../email')
const nlu = require('../natural-language/understanding')
const config = require('../config')
const logger = require('pino')()

/* tasks to run after the context of a conversation is pushed to the database
 * it's usually to send an email or parse the context variable */
async function runContextTasks(conversation) {

        const conversation_id = conversation.context.conversation_id
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
        
        if (is3RdNode(conversation)) {
            emailService.admin("Someone is talking to the bot. Remember to train on the input!")
        }
        if(conversation.context.help_request){
            emailService.admin("Help is needed! Check the facebook page ASAP!")
        }
        await SemanticParse(conversation);
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

async function SemanticParse(conversation) {
    let context = conversation.context
    var nodes_array = config.interviewNodes
    for (let i = 0; i < nodes_array.length; i++) {
        var context_var_name = nodes_array[i]
        if (context && context.hasOwnProperty(context_var_name)) {
            //found the context variable to send to semantic parser
            var context_var = context[context_var_name]
            if (context_var && context_var.parsed === false) {
                try {

                    let params = {
                        item: context_var,
                        label: context_var_name,
                        interview_type: context.interview_type,
                        conversation_id: context.conversation_id
                    };

                    await nlu.semanticParse(params);

                } catch(e){
                    logger.error(e.stacktrace)
                }
                context_var.parsed = true

            }
        }
    }
}

module.exports = {
	runContextTasks: runContextTasks,
	pushContext: db.pushContext,
	getContext: db.getContext,
	clearContext: db.clearContext,
}