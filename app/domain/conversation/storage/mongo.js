const mongo  = require('mongodb')


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

async function pushContext(doc) {
    return dbConnection
        .collection(collection.log)
        .insertOne(doc)
}

async function getConversationLog(conversation_id) {
    const conversations = await dbConnection
        .collection(collection.log)
        .find({conversation_id: conversation_id})
        .sort({$natural: 1})
        .toArray()
    return conversations;
}

//Get stats on average spent minutes talking with the robot
//and average questions answered
async function getAvgStats() {

    await dbConnection.collection(collection.log).aggregate([
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
                "$match": { "counter": {$gt: 2} , "minutes": {$lt: 120} }
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
        .then(stats => {
            return {minutes: stats.minutes, counter: stats.counter}
        })
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

                    "conversation_id": "$_id",
                    "minutes": {"$divide": [{ "$subtract": [ "$lastItem.date", "$firstItem.date" ] }, 1000*60]},
                    "seconds": {"$divide": [{ "$subtract": [ "$lastItem.date", "$firstItem.date" ] }, 1000]},
                    "counter": "$lastItem.context.system.dialog_request_counter"
                },

            },
            {
                "$match": { "counter": {$gt: 3 } , "minutes": {$lt: 60} }
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
function getThreadList(){

}

function getThread(){

}


module.exports = {

    getContext: getContext,
    pushContext: pushContext,
    getContextById: getContextByConversationId,

    getThreadList: getThreadList,
    getThread: getThread,

    getConversationCount: function(){
        return getTotalCount(3, 1)
    },

    getAvgStats: function(){
        return getAvgStats(3,1)
    },
    
    getConversationDataSet: function(){
        return getConversationDataSet(3, 1)
    }
}