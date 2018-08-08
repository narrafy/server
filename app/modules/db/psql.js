const log = require('../log')

const { Pool, Client } = require('pg')

let pool = null;

require('dotenv').config({silent: true})

function getTotalCount() {

}

function getAvgStats(){

}

function getConversationDataSet(){

}

function getTranscript(){

}

function extractTranscript(){

}

function saveTranscript(){

}

async function pushContext(id, conversation) {
    let row_id;
    try{
        const log = [
             id,
            conversation.context.conversation_id,
            JSON.stringify(conversation.intents),
            JSON.stringify(conversation.entities),
            conversation.input,
            conversation.output,
            conversation.context,
            new Date()];

        let query = {
            text:'INSERT INTO conversations(id,conversation_id, intents, entities,"input","output",context,date) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            values: log
        }
        const { rows } = await pool.query(query)
        row_id = rows[0].id;
        return row_id
    }catch (e) {
        throw e;
    }

}

async function getContext(input) {

    try {
        const query = {
            text: 'SELECT * from conversations ORDER BY date DESC LIMIT 1 WHERE id=$1 ;',
            values: [input.sender]
        };
         let res = await pool.query(query);
         let context = res.rows[0];
        return {input, context};

    }catch (e) {
        throw e;
    }
}

function getContextByConversationId(){

}

function getStoryTemplates (){

}

function saveStory(){

}

function getStory(){

}

async function getCustomerConfigurationFile(customer_id){

    try {
        const query = {
            text: 'SELECT * FROM customer where customer_id = $1;',
            values: [customer_id]
        };
        let res = await pool.query(query);
        let configuration_file = res.rows[0];
        return configuration_file;
    }catch (e) {
        throw e;
    }
}

function getCustomerConfigByToken(){

}

function saveInquiry(){

}

function saveSubscriber()
{

}

function connect(uri){

    pool = new Pool({
        connectionString: uri
    });
    return pool.connect();
}

module.exports = exports = {

    connect: connect,

    getConversationCount: getTotalCount,
    getAvgStats: getAvgStats,
    getConversationDataSet: getConversationDataSet,

    getTranscript: getTranscript,
    extractTranscript: extractTranscript,
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