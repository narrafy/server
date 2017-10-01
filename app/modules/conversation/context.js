const natural = require('natural')
const db = require('../db')
const emailService = require('../email')
const nlu = require('../natural-language/understanding/nlu')
const nlg = require('../natural-language/generation/nlg')
const tokenizer = new natural.WordTokenizer()
const config = require('../config')
const adminEmail = config.sendGrid.adminEmail

const Story = {
	INTERNAL_PROBLEM: "recap_internal_problem",
	EXTERNAL_PROBLEM: "recap_external_problem"
}

const ProblemNodeName = "internal_problem"

const InternalContextNodes = [
	"internal_problem_context",
	"internal_problem_prerequisite",
	"internal_problem_influence",
	"influence_on_relationships",
	"influence_on_relationships_example",
	"internal_problems_difficulties",
	"internal_problem_invitation_to_unique_outcome"
]

const ExternalContextNodes = [
	"external_problem",
	"vulnerable_to_external_problem",
	"external_problem_context",
	"external_problem_takeover",
	"external_problem_jeopardize_judgement",
	"external_problem_effect_on_relationships",
	"external_problem_cause_difficulties",
	"external_problem_blind_resources",
	"external_problem_unique_outcome",
	"external_problem_invite_action"
]

/* tasks to run after the context of a conversation is pushed to the database
 * it's usually to send an email or parse the context variable */
async function runContextTasks(conversation) {

	if (isEmailNode(conversation)) {
		const email = conversation.input.text
		const conversation_id = conversation.context.conversation_id
		const transcript = await db.getTranscript(conversation_id)
		await emailService.sendTranscript(email, transcript)
	}

	if (is3RdNode(conversation)) {
		await emailService.notifyAdmin(
			{
				email: adminEmail,
				message: "Someone is talking to the bot. Remember to train on the input!"
			}
		)
	}

}

async function semanticParse(context, array) {

	var conversation_id = context.conversation_id
	var parsedArray = []
	for (let i = 0; i < array.length; i++) {
		var context_var_name = array[i]
		if (context && context.hasOwnProperty(context_var_name)) {
			//found the context variable to send to semantic parser
			var context_var = context[context_var_name]
			if (context_var) {
				const item = await parseItem(context_var, context_var_name, conversation_id)
				parsedArray[context_var_name] = item
			}
		}
	}
	return parsedArray
}

async function parseItem(context_var, context_var_name, conversation_id) {
	if (isSentence(context_var)) {
		const semantic_data = await nlu.getSemanticRoles(context_var)
		await db.saveSemantics({
			conversation_id: conversation_id,
			context_var: context_var_name,
			semantics: semantic_data
		})
		return semantic_data
	}
}

function isSentence(context_variable) {
	var tokenized_sentence = tokenizer.tokenize(context_variable)
	return tokenized_sentence.length > 1
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
	return context && (context.recap_node === Story.INTERNAL_PROBLEM || context.recap_node === Story.EXTERNAL_PROBLEM)
}

async function getRecapStory(conversation) {
	var template = conversation.output.text
	switch (conversation.context.recap_node) {
		case Story.INTERNAL_PROBLEM:
			var array = await semanticParse(conversation.context, InternalContextNodes)
			return getSentence(array, template)
		case Story.EXTERNAL_PROBLEM:
			var array = await semanticParse(conversation.context, ExternalContextNodes)
			return getExternalProblemStory(array, template)
		default:
			return null
	}
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

function getSentence(template, array) {
	if (array["internal_problem_context"])
		template = template.replace("internal_problem_context", array["internal_problem_context"].semantic_roles.object.text)
	if (array["internal_problem_prerequisite"])
		template = template.replace("internal_problem_prerequisite", array["internal_problem_prerequisite"].semantic_roles.object.text)
	if (array["internal_problem_influence"])
		template = template.replace("internal_problem_influence", "You " + array["internal_problem_influence"].semantic_roles.action.normalized + array["internal_problem_influence"].semantic_roles.object.text)
	if (array["influence_on_relationships_example"])
		template = template.replace("influence_on_relationships_example", "You " + array["influence_on_relationships_example"].semantic_roles.action.normalized + array["influence_on_relationships_example"].semantic_roles.object.text)
	if (array["internal_problems_difficulties"])
		template = template.replace("internal_problems_difficulties", "You " + array["internal_problems_difficulties"].semantic_roles.action.normalized + array["internal_problems_difficulties"].semantic_roles.object.text)
	if (array["internal_problem_invitation_to_unique_outcome"])
		template = template.replace("internal_problem_invitation_to_unique_outcome", array["internal_problem_invitation_to_unique_outcome"].semantic_roles.object.text)
	return template
}

function getInternalProblemStory(array, template) {
	var text = template
	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < InternalContextNodes.length; j++) {
			var context_var_node = InternalContextNodes[j]

			if (array[i].context_var === context_node) {
				console.log(array[i])
			}
		}
	}
	return text
}

function getExternalProblemStory(array, template) {

}

module.exports = {
	runContextTasks: runContextTasks,
	pushContext: db.pushContext,
	getContext: db.getContext,
	clearContext: db.clearContext,
}