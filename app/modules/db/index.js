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
	customer: "customer"
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
    const ids = await dbConnection
        .collection(collection.log)
        .find({id: data.sender})
        .sort({date: -1})
        .limit(data.limit)
        .toArray()
		//.map(function(doc) { return doc._id })

	let idArray = []
	if(ids && ids.length > 0)
	{
		ids.forEach(item => {
			idArray.push(item._id)
		})

	}
	 await dbConnection
         .collection(collection.log)
         .remove({_id: {$in: idArray}})
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
		.find({conversation_id: story.conversation_id})
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
	saveSemantics: saveSemantics,
	getTranscript: getTranscript,
	getReplies: getReplies,
	getContext: getContext,
	getContextVars: getContextVars,
	clearContext: clearContext,
	pushContext: pushContext,
	getSemanticParse: getParsedContext,
	saveStory: saveStory,
	getStories: getStory,
	getConfig: getCustomerConfig,
    getCustomerConfigByToken: getCustomerConfigByToken,

	async addInquiry(data) {
		await saveInquiry(data)
	},

	async addSubscriber(data) {
		await saveSubscriber(data)
	},
}
