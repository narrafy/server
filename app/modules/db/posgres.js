const { Pool } = require('pg');
const uuidV1 = require('uuid/v1');

let pool = null;

require('dotenv').config({silent: true})

const collection = {
    conversation: "conversation",
    transcript: "transcript",
    contact: "contact",
    context_semantics: "context_semantics",
    story_template: "story_template",
    subscriber: "subscriber",
    story: "story",
    customer: "customer",
}

function connect(uri){

    pool = new Pool({
        connectionString: uri, ssl: true
    });
    return pool.connect();
}

async function singleResultQuery(query)
{
    try {
        let res = await pool.query(query);
        let result = res.rows[0];
        return result;
    }catch (e) {
        console.log(e.stack);
    }
}

async function multipleRowsQuery(query)
{
    try {
        let res = await pool.query(query);
        let result = res.rows;
        return result;
    }catch (e) {
        console.log(e.stack);
    }
}

async function getCustomerConfigurationFile(customer_id)
{
    let query = {
        text: 'SELECT * FROM '+ collection.customer + ' where customer_id = $1;',
        values: [customer_id]
    };

    return await singleResultQuery(query);
}

async function getCustomerConfigByToken(verifyToken)
{
    let query = {
        text: 'SELECT * FROM '+ collection.customer + ' WHERE facebook @> \'{"facebook.verify_token":$1}\';',
        values: [verifyToken]
    };

    return await singleResultQuery(query);
}

async function saveCustomer(doc){

    let query = {
        text: 'INSERT INTO ' + collection.customer + '(customer_id, name, email, facebook, conversation) values ($1, $2, $3, $4, $5)',
        values: [doc.customer_id, doc.name, doc.email, JSON.stringify(doc.facebook), JSON.stringify(doc.conversation)]
    }

    return await singleResultQuery(query);
}


async function pushContext(doc) {
    let uuid = uuidV1();

    const log = [
        uuid,
        doc.id,
        doc.context.conversation_id,
        JSON.stringify(doc.intents),
        JSON.stringify(doc.entities),
        doc.input,
        doc.output,
        doc.context,
        doc.date];

    let query = {
        text:'INSERT INTO ' + collection.conversation + '(_id, id, conversation_id, intents, entities, "input", "output", context, date) ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
        values: log
    }

    return await singleResultQuery(query);
}

async function getContext(input) {

    let query = {
        text: 'SELECT * from ' + collection.conversation + ' ORDER BY date DESC LIMIT 1 WHERE id=$1 ;',
        values: [input.sender]
    };

    let context = await singleResultQuery(query);

    return {input, context};
}

async function getTranscript(conversation_id){

    let query = {
        text: 'SELECT * FROM '+ collection.transcript+ ' WHERE conversation_id=$1 ;',
        values: [conversation_id]
    }

    return await singleResultQuery(query);
}

async function saveTranscript(doc){

    let query = {
        text: 'INSERT INTO ' + collection.transcript + '(conversation_id, email, transcript, date) values ($1, $2, $3, $4)',
        values: [doc.conversation_id, doc.email, JSON.stringify(doc.transcript), doc.date]
    }

    return await singleResultQuery(query);
}

async function getConversationLog(conversation_id){

    let query = {
        text: 'SELECT * FROM '+ collection.conversation +' ORDER BY date DESC LIMIT 1 WHERE id=$1 ;',
        values: [conversation_id]
    }

    return await multipleRowsQuery(query);
}

async function getContextByConversationId(id, limit){

    let query = {
        text: 'SELECT * FROM ' + collection.conversation + ' ORDER by date DESC LIMIT $1 WHERE conversation_id=$2',
        values: [limit, id]
    }

    return await multipleRowsQuery(query);
}

async function getStoryTemplates (){

    let query = {
        text: 'SELECT * FROM ' + collection.story_template,
        values: []
    }

    return await multipleRowsQuery(query);
}

async function insertStoryTemplates (doc){

    let query = {
        text: 'INSERT INTO ' + collection.story_template + '(interview_type, nodes, stub) values ($1, $2, $3)',
        values: [ doc.interview_type, JSON.stringify(doc.nodes), JSON.stringify(doc.templates) ]
    }

    return await multipleRowsQuery(query);
}


async function saveStory(doc){

    let query = {
        text: 'INSERT INTO ' + collection.story + '(conversation_id, email, story, date) values ($1, $2, $3, CURRENT_TIMESTAMP)',
        values: [doc.conversation_id, doc.email, doc.story]
    }

    return await singleResultQuery(query);
}

async function getStory(conversation_id){

    let query = {
        text: 'SELECT * FROM ' + collection.story + 'ORDER by date DESC LIMIT 1 WHERE conversation_id=$1',
        values: [conversation_id]
    }

    return await multipleRowsQuery(query);
}

async function saveInquiry(data){

    let query = {
        text: 'INSERT INTO ' + collection.contact + '(email, message, name, date) values ($1, $2, $3, CURRENT_TIMESTAMP)',
        values: [data.email, data.message, data.name]
    }

    return await singleResultQuery(query);
}

async function saveSubscriber(doc)
{
    let query = {
        text: 'INSERT INTO ' + collection.subscriber + '(conversation_id, email, date) values ($1, $2, $3)',
        values: [doc.conversation_id, doc.email, doc.date]
    }

    return await singleResultQuery(query);
}

// get the dataset pair <minutes_spent, number_of_questions>
// main kpi: how many minutes a person spends with a the robot and how many questions he is answering
async function getConversationDataSet()
{
    let query = {
        text: "select conversation_id,\n" +
        "        EXTRACT(MINUTES FROM date_last_entry::timestamp - date_first_entry::timestamp) as minutes, \n" +
        "        EXTRACT(Seconds FROM date_last_entry::timestamp - date_first_entry::timestamp) as seconds, \n" +
        "        counter from \n" +
        "        (select \n" +
        "        conversation_id,\n" +
        "         (array_agg(date)),\n" +
        "        (array_agg(date))[1] as date_first_entry, \n" +
        "        (array_agg(date))[count(conversation_id)] as date_last_entry, \n" +
        "        count(conversation_id) as counter \n" +
        "        from conversation group by conversation_id having count(conversation_id)>1) as x\n" +
        "        group by conversation_id, date_last_entry, date_first_entry, counter\n" +
        "        having EXTRACT(MINUTES FROM date_last_entry::timestamp - date_first_entry::timestamp)>0",
        values: []
    }

    return await multipleRowsQuery(query)
}

// number of total conversations , with more than 2 request counters ( a person interacted with the bot )
// and less than 2 hours between first interaction and the last one
// ( a person could leave the pc, come back later, loosing attention span )
async function getTotalCount() {

    let query = {
        text: "select count(*) as total_doc from \n" +
        "(select conversation_id,\n" +
        "        EXTRACT(MINUTES FROM date_last_entry::timestamp - date_first_entry::timestamp) as minutes, \n" +
        "        EXTRACT(Seconds FROM date_last_entry::timestamp - date_first_entry::timestamp) as seconds, \n" +
        "        counter from \n" +
        "        (select \n" +
        "        conversation_id,\n" +
        "         (array_agg(date)),\n" +
        "        (array_agg(date))[1] as date_first_entry, \n" +
        "        (array_agg(date))[count(conversation_id)] as date_last_entry, \n" +
        "        count(conversation_id) as counter \n" +
        "        from conversation group by conversation_id having count(conversation_id)>1) as x\n" +
        "        group by conversation_id, date_last_entry, date_first_entry, counter\n" +
        "        having EXTRACT(MINUTES FROM date_last_entry::timestamp - date_first_entry::timestamp)>0) x",
        values: []
    }

    return await multipleRowsQuery(query);
}

async function getAvgStats(){

    let query = {
        text: "select avg(seconds)/60 as minutes, CAST (avg(counter) AS DOUBLE PRECISION) as counter " +
        "from " +
        "(select conversation_id," +
        "EXTRACT(MINUTES FROM date_last_entry::timestamp - date_first_entry::timestamp) * 60 + " +
        "EXTRACT(Seconds FROM date_last_entry::timestamp - date_first_entry::timestamp) as seconds, " +
        "counter from" +
        "(select " +
        "conversation_id, " +
        "(array_agg(date)), " +
        "(array_agg(date))[1] as date_first_entry, " +
        "(array_agg(date))[count(conversation_id)] as date_last_entry, " +
        "count(conversation_id) as counter from conversation group by conversation_id having count(conversation_id)>1) as x group by conversation_id, date_last_entry, date_first_entry, counter having EXTRACT(MINUTES FROM date_last_entry::timestamp - date_first_entry::timestamp)>0) as kj",
        values: []
    }

    return await singleResultQuery(query);
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
    saveStoryTemplate: insertStoryTemplates,

    saveStory: saveStory,
    getStory: getStory,

    getConfig: getCustomerConfigurationFile,
    getCustomerByToken: getCustomerConfigByToken,
    saveCustomer: saveCustomer,

    async addInquiry(data) {
        await saveInquiry(data)
    },

    async addSubscriber(data) {
        await saveSubscriber(data)
    },
}