const db = require('../db')
const emailService = require('../email')
const nlu = require('../natural-language/understanding')
const config = require('../config')

/* tasks to run after the context of a conversation is pushed to the database
 * it's usually to send an email or parse the context variable */
async function runContextTasks(conversation) {

    const conversation_id = conversation.context.conversation_id;
	if (isEmailNode(conversation)) {
		let email = getEmailFromContext(conversation);
		let interview_type = conversation.context.interview_type;
        if(email && isSendStoryNode(conversation))
        {
            let userStory = await db.getStory({
                    conversation_id: conversation_id,
                    interview_type: interview_type })
            if(userStory)
                emailService.sendStory(email, userStory.story)


        }

		let transcript = await db.getTranscript(conversation_id)
        if(transcript)
		    emailService.send(email, transcript)
	}

	if (is3RdNode(conversation)) {
		emailService.notifyAdmin("Someone is talking to the bot. Remember to train on the input!")
	}

	await SemanticParse(conversation.context);
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

function isSendStoryNode(conversation) {
    return conversation.context && conversation.context.send_story;

}

function is3RdNode(conversation) {
	return conversation.context &&
		conversation.context.system &&
		conversation.context.system.dialog_request_counter === 3
}

async function SemanticParse(context) {

    if (context.interview_type) {

        var nodes_array = config.interviewNodes[context.interview_type]
        for (let i = 0; i < nodes_array.length; i++) {
            var context_var_name = nodes_array[i]
            if (context && context.hasOwnProperty(context_var_name)) {
                //found the context variable to send to semantic parser
                var context_var = context[context_var_name]
                if (context_var && context_var.parsed === false) {

                        await nlu.semanticParse({
                            item: context_var,
                            label: context_var_name,
                            interview_type: context.interview_type,
                            conversation_id: context.conversation_id
                        });
                	context_var.parsed = true;
                }
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