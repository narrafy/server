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

async function getContextByConversationId(id, limit) {
    return dbConnection
        .collection(collection.log)
        .find({conversation_id: id},{ context: 1 })
        .sort({date: -1})
		.limit(limit)
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

async function saveInquiry(data) {
	return dbConnection
		.collection(collection.contact)
		.save(data)
}

async function getConversationLog(conversation_id) {
    const conversations = await dbConnection
        .collection(collection.log)
        .find({conversation_id: conversation_id})
        .sort({$natural: 1})
        .toArray()
    return conversations;
}

async function getTranscript(conversation_id) {

    return dbConnection.collection(collection.transcript)
        .findOne({conversation_id : conversation_id})
}

async function saveTranscript (conversation_id, email, transcript){
    const data = {
        conversation_id: conversation_id,
        email: email,
        transcript: transcript,
        date: new Date()
    }
    await dbConnection
        .collection(collection.transcript)
        .replaceOne({ conversation_id: data.conversation_id }, data , { upsert: true })
        .then(() => data)
}

async function saveSubscriber(data) {
	return dbConnection
		.collection(collection.subscribers)
        .replaceOne({ conversation_id: data.conversation_id }, data , { upsert: true })
		.then(() => data)
}

async function saveStory(data) {
	return dbConnection
		.collection(collection.stories)
		.replaceOne({ conversation_id: data.conversation_id }, data , { upsert: true })
		.then(() => data)
}

async function getStory(conversation_id) {
	return dbConnection.collection(collection.stories)
		.find({conversation_id: conversation_id})
        .sort({date: -1}) //.sort({"date":-1})
        .limit(1)
        .toArray()
}

async function getStoryTemplates() {
    return dbConnection.collection(collection.template_stories)
        .find()
        .sort({$natural: 1})
        .toArray()
}

async function getCustomerConfigurationFile(customer_id){
    return dbConnection.collection(collection.customer)
        .findOne({customer_id : customer_id})
}

async function getCustomerConfigByToken(verifyToken){
    return dbConnection.collection(collection.customer)
        .findOne({ "facebook.verify_token" : verifyToken})
}

//Get stats on average spent minutes talking with the robot
//and average questions answered
async function getAvgStats() {

    return dbConnection.collection(collection.log).aggregate([
        {
            $group :
                {
                    _id : "$conversation_id",
                    conversations: { $push: "$$ROOT" }
                }
        },
        {$unwind: "$conversations"},
        {$group: {
            _id: "$_id",
            firstItem: { $first: "$conversations"},
            lastItem: { $last: "$conversations"},
            countItem: { "$sum": 1 }
        }},

        { "$project": {

            "minutes": {
                "$divide": [{ "$subtract": [ "$lastItem.date", "$firstItem.date" ] }, 1000*60]
            },
            "counter": "$lastItem.context.system.dialog_request_counter"
        },

        },
        {
            "$match": { "counter": {$gt: 2 } , "minutes": {$lt: 120} }
        },
        // then group as normal for the averaging
        {$group: {
            _id: 0,
            minutes: {$avg: "$minutes"},
            counter: {$avg: "$counter"},
        }}
    ],
        {
            cursor: {
                batchSize: 10000
            },
            allowDiskUse: true,
            explain: false
        }, null
    ).toArray()
        .then((stats) => stats)
}

// get the dataset pair <minutes_spent, number_of_questions>
// main kpi: how many minutes a person spends with a the robot and how many questions he is answering
async function getConversationDataSet(){

    let cursor = dbConnection.collection(collection.log).aggregate(
        [
            {
                $group :
                    {
                        _id : "$conversation_id",
                        conversations: { $push: "$$ROOT" }
                    }
            },
            {$unwind: "$conversations"},
            {$group: {
                _id: "$_id",
                firstItem: { $first: "$conversations"},
                lastItem: { $last: "$conversations"},
                countItem: { "$sum": 1 }
            }},

            { "$project": {

                "minutes": {"$divide": [{ "$subtract": [ "$lastItem.date", "$firstItem.date" ] }, 1000*60]  },
                "counter": "$lastItem.context.system.dialog_request_counter"
            },

            },
            {
                "$match": { "counter": {$gt: 2 } , "minutes": {$lt: 40} }
            }
        ],
        {
            cursor: {
                batchSize: 10000
            },
            allowDiskUse: true,
            explain: false
        }, null).toArray()
        .then((dataset) => dataset)
	return cursor;
}

// number of total conversations , with more than 2 request counters ( a person interacted with the bot )
// and less than 2 hours between first interaction and the last one  ( a person could leave the pc, come back later, loosing attention span )
async function getTotalCount(){

	return dbConnection.collection(collection.log).aggregate(
        [
            {
                $group :
                    {
                        _id : "$conversation_id",
                        conversations: { $push: "$$ROOT" }
                    }
            },
            {$unwind: "$conversations"},
            {$group: {
                _id: "$_id",
                firstItem: { $first: "$conversations"},
                lastItem: { $last: "$conversations"},
                countItem: { "$sum": 1 }
            }},

            { "$project": {

                "minutes": {
                    "$divide": [{ "$subtract": [ "$lastItem.date", "$firstItem.date" ] }, 1000*60]
                },
                "counter": "$lastItem.context.system.dialog_request_counter"
            },
            },
            {
                "$match": { "counter": {$gt: 1 } }
            },
            {
                $count: "total_doc"
            }
        ],
        {
            cursor: {
                batchSize: 10000
            },
            allowDiskUse: true,
            explain: false
        }, null)
        .toArray()
        .then((total_doc) => total_doc)
}

module.exports = exports = {

	connect: connect,

	getConversationCount: getTotalCount,
	getAvgStats: getAvgStats,
    getConversationDataSet: getConversationDataSet,

	getTranscript: getTranscript,
    getConversationLog: getConversationLog,
	saveTranscript: saveTranscript,

	getContext: getContext,
    pushContext: pushContext,
	getContextById: getContextByConversationId,

    getStoryTemplates: getStoryTemplates,
	saveStory: saveStory,
	getStory: getStory,

	getConfig: getCustomerConfigurationFile,
    getCustomerByToken: getCustomerConfigByToken,

	async addInquiry(data) {
		await saveInquiry(data)
	},

	async addSubscriber(data) {
		await saveSubscriber(data)
	},
}
