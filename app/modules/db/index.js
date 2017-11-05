const log = require('../log')
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
	stories: "stories",
	customer: "customer",
	template_stories: "template_stories"
}

let dbConnection = null

async function connect(uri) {
	return mongoClient
		.connect(uri)
		.then((db) => dbConnection = db)
}

async function getContext(input) {
		return dbConnection
			.collection(collection.log)
			.find({id: input.sender})
			.sort({date: -1})
			.limit(1)
			.toArray()
			.then((stored_log) => ({input, stored_log}))
}

async function getContextByConversationId(id) {
    return dbConnection
        .collection(collection.log)
        .find({conversation_id: id})
        .sort({date: -1})
		.limit(1)
		.toArray()
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

async function getParsedContext(conversation_id){
	return dbConnection.collection(collection.context_semantics)
        .find({conversation_id: conversation_id})
        .sort({$natural: 1}).toArray()
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

async function saveSubscriber(data) {
	return dbConnection
		.collection(collection.subscribers)
		.save(data)
}

async function saveStory(data) {
	return dbConnection.collection(collection.stories)
		.insertOne(data)
		.then(() => data)
}

async function getStory(story) {
	return dbConnection.collection(collection.stories)
		.find({conversation_id: story.conversation_id})
        .sort({$natural: 1})
        .toArray()
}

async function getStoryTemplates(interview_type) {
    return dbConnection.collection(collection.template_stories)
        .find({interview_type: interview_type})
        .sort({$natural: 1})
        .toArray()
}



async function getCustomerConfig(customer_id){
    return dbConnection.collection(collection.customer)
        .findOne({customer_id : customer_id})
}

async function getCustomerConfigByToken(verifyToken){
    return dbConnection.collection(collection.customer)
        .findOne({ "facebook.verify_token" : verifyToken})
}


module.exports = exports = {

	connect: connect,
	getTranscript: getTranscript,
	getContext: getContext,
	getContextById: getContextByConversationId,
	pushContext: pushContext,
	getSemanticParse: getParsedContext,
    getStoryTemplates: getStoryTemplates,
	saveStory: saveStory,
	getStories: getStory,
	getConfig: getCustomerConfig,
    getCustomerByToken: getCustomerConfigByToken,

	async addInquiry(data) {
		await saveInquiry(data)
	},

	async addSubscriber(data) {
		await saveSubscriber(data)
	},
}
