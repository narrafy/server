
const db = require('../db')
const emailService = require('../email')
const nlu = require('../natural-language/understanding/nlu')
const nlg = require('../natural-language/generation/nlg')

const config = require('../config')
const adminEmail = config.sendGrid.adminEmail


/* tasks to run after the context of a conversation is pushed to the database
 * it's usually to send an email or parse the context variable */
async function runContextTasks(conversation) {

	if (isEmailNode(conversation)) {
		const email = conversation.input.text
		const conversation_id = conversation.context.conversation_id
		const transcript = await db.getTranscript(conversation_id)
		emailService.sendTranscript(email, transcript)
	}

	if (is3RdNode(conversation)) {
		emailService.notifyAdmin(
			{
				email: adminEmail,
				message: "Someone is talking to the bot. Remember to train on the input!"
			}
		)
	}

  /*  var context = conversation.context;
	if(isRecapNode(context)){
		var parsedContext = await nlu.semanticParse(context, config.interview.type.internalization.vars);
		var story = await nlg.story(parsedContext);
		conversation.output.text = story;
	} */
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

function isRecapNode(context) {
	return context &&
		(context.recap_node === config.interview.type.internalization.flagName
			|| context.recap_node === config.interview.type.externalization.flagName)
}

/*
*
* $user_name you say you are too $internal_problem. And this is what it does to your life.
* You are too $internal_problem about internal_problem_context. There is a trigger that launches it:
* internal_problem_prerequisite. This does affect your life, because it makes you do things you wouldn’t do otherwise.
* For ex: internal_problem_influence. It affects the people and relationships you care about -- influence_on_relationships_example.
* It makes your life difficult: internal_problems_difficulties.
* But, there is a hope. You see it: internal_problem_invitation_to_unique_outcome.
*
* */



module.exports = {
	runContextTasks: runContextTasks,
	pushContext: db.pushContext,
	getContext: db.getContext,
	clearContext: db.clearContext,
}