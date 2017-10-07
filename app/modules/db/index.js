const log = require('../log')
const mailService = require('../email')
const config = require('../config')
const mongoClient = require('mongodb')

require('dotenv').config({silent: true})

const collection = {
	log: "conversations",
	transcript: "transcripts",
	contact: "contact",
	context_semantics: "context_semantics",
	story_template: "story_template",
	subscribers: "subscribers",
	stories: "stories"
}

let dbConnection = null

async function connect(uri) {
	return mongoClient
		.connect(uri)
		.then((db) => dbConnection = db)
}

async function getContext(input) {
	if (input.sender === config.chatBotId) {
		//if it's an echo from the facebook page
		// we catch the message when a counsellor takes over
		log.info("page echo: " + input.sender + " says  " + input.text)
		return null
	} else {
		//it's a text from a user
		log.info("user: " + input.sender + " says  " + input.text)
		return dbConnection
			.collection(collection.log)
			.find({id: input.sender})
			.sort({date: -1})
			.limit(1)
			.toArray()
			.then((stored_log) => ({input, stored_log}))
	}
}

async function getContextVars(conversation_id){
	return dbConnection.collection(collection.log)
		.find({conversation_id: conversation_id})
		.sort({date: -1})
		.limit(1)
		.toArray()
		.then(stored_log => stored_log[0])
		.catch((err)=>{console.log(err)});
}

async function pushContext(id, conversation) {

	const dbConversation = {
		id: id,
		conversation_id: conversation.context.conversation_id,
		intents: conversation.intents,
		entities: conversation.entities,
		input: conversation.input,
		output: conversation.output,
		context: conversation.context,
		date: new Date()
	}

	return dbConnection
		.collection(collection.log)
		.insertOne(dbConversation)
}

async function getParsedContext(conversation_id, interview_type){
	return dbConnection.collection(collection.context_semantics)
        .find({conversation_id: conversation_id, interview_type: interview_type})
        .sort({$natural: 1}).toArray()
}

async function clearContext(data) {

	await dbConnection
		.collection(collection.log)
		.deleteMany({id: data.sender})

	return getContext(data)
}

async function saveInquiry(data) {
	return dbConnection
		.collection(collection.contact)
		.save(data)
}

async function getTranscript(conversation_id) {

	const conversations = await dbConnection
		.collection(collection.log)
		.find({conversation_id: conversation_id})
		.sort({$natural: 1})
		.toArray()

	const transcript = []

	conversations.forEach(conversation => {
		if (conversation.input && conversation.input.text) {
			transcript.push(conversation.input.text)
		}
		if (conversation.output && conversation.output.text) {
			transcript.push(conversation.output.text)
		}
	})

	if (transcript.length > 0) {
		const data = {
			conversation_id: conversation_id,
			transcript: transcript,
			date: new Date()
		}
		await dbConnection.collection(collection.transcript).save(data)
	}
}

async function getReplies(conversation_id) {
	const conversations = await dbConnection
		.collection(collection.log)
		.find({conversation_id: conversation_id})
		.sort({$natural: 1}).toArray()

	return conversations.reduce((outputText, conversation) => {
		if (conversation.input && conversation.input.text) {
			outputText += `. ${conversation.input.text}`
		}
		return outputText
	}, '')

}

async function saveSubscriber(data) {
	return dbConnection
		.collection(collection.subscribers)
		.save(data)
}

async function saveSemantics(data) {
	return dbConnection
		.collection(collection.context_semantics)
		.save(data)
		.then(() => data)
}

async function saveStory(data) {
	return dbConnection.collection(collection.stories)
		.insertOne(data)
		.then(() => data)
}

async function getStory(story) {
	return dbConnection.collection(collection.stories)
		.findOne({conversation_id: story.conversation_id, interview_type: story.interview_type})
		.then((story) => ({story}))
}

module.exports = exports = {
	connect: connect,
	saveSemantics: saveSemantics,
	getTranscript: getTranscript,
	getReplies: getReplies,
	getContext: getContext,
	getContextVars: getContextVars,
	clearContext: clearContext,
	pushContext: pushContext,
	getSemanticParse: getParsedContext,
	saveStory: saveStory,
	getStory: getStory,

	async addInquiry(data) {
		await saveInquiry(data)

		mailService.notifyAdmin(data.message)
		mailService.notifyUser(data.email)
	},

	async addSubscriber(data) {
		await saveSubscriber(data)

		mailService.notifyAdmin("Congrats, another user just subscribed!")
		mailService.notifySubscriber(data.email)
	},
}
