const emailService = require('../../service/email')
const config = require('../../service/config')
const nlu = require('../../service/nlp/understanding')
const transcript = require('../transcript')
const storage = require('./storage')
const utils = require('../../service/email')

/* tasks to run after the context of a conversation is pushed to the database
 * it's usually to send an email or parse the context variable */
async function runContextTasks(conversation) {

    let context = conversation.context
    const conversation_id = context.conversation_id
    if (hasEmail(conversation)) {
            let email = getEmailFromContext(conversation)
            if(email)
            {
                let data = {
                    email: email,
                    conversation_id: conversation_id,
                    url: config.app.url + "/story?conversation_id="+ conversation_id,
                    date: new Date(),
                };
                let conversations = await storage.getConversationLog(conversation_id)
                const transcript = transcript.build(conversations)
                let doc = {
                    email: email,
                    conversation_id: conversation_id,
                    transcript: transcript
                }
                if(transcript){
                    emailService.transcript(email, doc.transcript)
                    emailService.adminBot(data)
                }
                db.addSubscriber(data)
            }
    }

    if(isPersonDescriptionNode(conversation)){
        let problem = nlu.parseProblemNode(context.problem.text)
        context.problem = {
            text: problem,
            parsed: true
        }
    }

    if(shouldEnableBot(conversation))
        context.bot_active = true

    if(shouldPauseBot(conversation))
        context.bot_active = false
        
    if (is3RdNode(conversation))
       emailService.admin("Someone is talking to the bot. Remember to train on the input!")

    if(conversation.context.help_request || conversation.context.email_admin){
        emailService.admin("Help is needed! Check the facebook page ASAP!")
        conversation.context.email_admin = false
    }

    if(conversation.context.email_admin && conversation.context.email_admin === true ){
        emailService.admin("Narrafy is struggling! Check the facebook page ASAP!")
        conversation.context.email_admin = false
    }
}


function getEmailFromContext(conversation){
    let email = conversation.input.text;
    if(utils.validate(email))
        return email
    return null
}

function hasEmail(conversation) {
	return conversation.entities &&
		conversation.entities[0] &&
        conversation.entities[0].entity === "email"
}

function isPersonDescriptionNode(conversation){
    return conversation.context &&
        conversation.context.problem &&
        conversation.context.problem.text &&
        conversation.context.problem.parsed === false
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
    if(conversation.context && conversation.context.localhost) return false
	return conversation.context &&
		conversation.context.system &&
		conversation.context.system.dialog_request_counter === 3
}

module.exports = {
	runContextTasks: runContextTasks,
}