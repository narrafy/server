const { Pool, Client } = require('pg')

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
        connectionString: uri
    });
    return pool.connect();
}

async function getCustomerConfigurationFile(customer_id){

    try {
        let query = {
            text: 'SELECT * FROM '+ collection.customer + ' where customer_id = $1;',
            values: [customer_id]
        };
        let res = await pool.query(query);
        let configuration_file = res.rows[0];
        return configuration_file;
    }catch (e) {
        throw e;
    }
}

async function getCustomerConfigByToken(verifyToken){

    try{
        let query = {
            text: 'SELECT * FROM '+ collection.customer + ' WHERE facebook @> \'{"facebook.verify_token":$1}\';',
            values: [verifyToken]
        };
        let res = await pool.query(query);
        let configuration_file = res.row[0];
        return configuration_file;
    }catch (e) {
        throw e;
    }
}

async function pushContext(id, conversation) {

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
            text:'INSERT INTO ' + collection.conversation + '(id, conversation_id, intents, entities,"input","output",context,date) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            values: log
        }
        const { rows } = await pool.query(query)
        let row_id = rows[0];
        return row_id
    }catch (e) {
        console.log(e.stack);
    }
}

async function getContext(input) {

    try {
        const query = {
            text: 'SELECT * from ' + collection.conversation + ' ORDER BY date DESC LIMIT 1 WHERE id=$1 ;',
            values: [input.sender]
        };
        let res = await pool.query(query);
        let context = res.rows[0];
        return {input, context};

    }catch (e) {
        throw e;
    }
}

async function getTranscript(conversation_id){

    try{
        let query = {
            text: 'SELECT * FROM '+ collection.transcript+ ' WHERE conversation_id=$1 ;',
            values: [conversation_id]
        }
        let result = await pool.query(query);
        let transcript = result.rows[0];
        return transcript
    }catch (e) {
        throw e;
    }
}

async function saveTranscript( conversation_id, email, transcript){

    try{
        let query = {
            text: 'INSERT INTO ' + collection.transcript + '(conversation_id, email, transcript) values ($1, $2, $3, $4)',
            values: [conversation_id, email, transcript, new Date()]
        }
        let res = await pool.query(query);
        let count = res.rows[0];
        return count;
    }catch (e) {
        throw e;
    }
}

async function getConversationLog(conversation_id){

    try {

        let query = {
            text: 'SELECT * FROM '+ collection.conversation +' ORDER BY date DESC LIMIT 1 WHERE id=$1 ;',
            values: [conversation_id]
        }

        let res = await pool.query(query);
        return res.rows;
    }catch (e) {
        throw e;
    }
}

async function getContextByConversationId(id, limit){

    try{

        let query = {
            text: 'SELECT * FROM ' + collection.conversation + ' ORDER by date DESC LIMIT $1 WHERE conversation_id=$2',
            values: [limit, id]
        }
        let res = await pool.query(query);
        return res.rows;
    }catch(e){
        throw e;
    }
}

async function getStoryTemplates (){

    try{

        let query = {
            text: 'SELECT * FROM ' + collection.story_template,
            values: []
        }
        let res = await pool.query(query);
        return res.rows;
    }catch(e){
        throw e;
    }
}

async function saveStory(story){

    try{

        let query = {
            text: 'INSERT INTO ' + collection.story + '(conversation_id, internalization, externalization) values ($1, $2, $3)',
            values: [story.conversation_id, story.internalization, story.externalization]
        }
        let res = await pool.query(query);
        return res.rows[0];
    }catch(e){
        throw e;
    }
}

async function getStory(conversation_id){
    try{

        let query = {
            text: 'SELECT * FROM ' + collection.story + 'ORDER by date DESC LIMIT 1 WHERE conversation_id=$1',
            values: [conversation_id]
        }
        let res = await pool.query(query);
        return res.rows;
    }catch(e){
        throw e;
    }
}

async function saveInquiry(data){

    try{

        let query = {
            text: 'INSERT INTO ' + collection.contact + '(email, message, name, date) values ($1, $2, $3, $4)',
            values: [data.email, data.message, data.name, new Date()]
        }
        let res = await pool.query(query);
        return res.rows[0];
    }catch(e){
        throw e;
    }
}

async function saveSubscriber(data)
{
    try{

        let query = {
            text: 'INSERT INTO ' + collection.subscriber + '(email, date) values ($1, $2)',
            values: [data.email, new Date()]
        }
        let res = await pool.query(query);
        return res.rows[0];
    }catch(e){
        throw e;
    }
}

async function getConversationDataSet()
{
    try{

        let query = {
            text: 'SELECT * FROM ',
            values: []
        }
        let res = await pool.query(query);
        return res.rows;
    }catch(e){
        throw e;
    }
}

async function getTotalCount() {
    try{

        let query = {
            text: 'SELECT * FROM ',
            values: []
        }
        let res = await pool.query(query);
        return res.rows;
    }catch(e){
        throw e;
    }
}

async function getAvgStats(){
    try{

        let query = {
            text: 'SELECT * FROM ',
            values: []
        }
        let res = await pool.query(query);
        return res.rows;
    }catch(e){
        throw e;
    }
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