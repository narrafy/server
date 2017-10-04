
const db = require('../db')
const emailService = require('../email')
const nlu = require('../natural-language/understanding')
const nlg = require('../natural-language/generation')

const config = require('../config')
const adminEmail = config.sendGrid.adminEmail


/* tasks to run after the context of a conversation is pushed to the database
 * it's usually to send an email or parse the context variable */
async function runContextTasks(conversation) {

    const conversation_id = conversation.context.conversation_id;
	if (isEmailNode(conversation)) {
		const email = conversation.input.text
		const transcript = await db.getTranscript(conversation_id)
		emailService.sendTranscript(email, transcript)
	}

	/*if (is3RdNode(conversation)) {
		emailService.notifyAdmin(
			{
				email: adminEmail,
				message: "Someone is talking to the bot. Remember to train on the input!"
			}
		)
	}*/

	await SemanticParse(conversation.context);
}


function isEmailNode(conversation) {
	return conversation.entities &&
		conversation.entities[0] &&
		conversation.entities[0].entity === "email"
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