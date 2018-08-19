const db = require('../../../service/db/posgres')
const uuidV1 = require('uuid/v1');


// get the dataset pair <minutes_spent, number_of_questions>
// main kpi: how many minutes a person spends with a the robot and how many questions he is answering
async function getConversationDataSet(minQuestions, minMinutes, cb)
{
    let query = {
        text: "select conversation_id,\n" +
        "EXTRACT(MINUTES FROM date_last_entry::timestamp - date_first_entry::timestamp) as minutes,\n" +
        "EXTRACT(Seconds FROM date_last_entry::timestamp - date_first_entry::timestamp) as seconds,\n" +
        "counter from\n" +
        "       (select\n" +
        "                conversation_id,\n" +
        "                (array_agg(date order by date asc))[1] as date_first_entry,\n" +
        "                (array_agg(date order by date asc))[count(conversation_id)] as date_last_entry,\n" +
        "                count(conversation_id) as counter\n" +
        "                from conversation group by conversation_id having count(conversation_id)>$1) as x\n" +
        "group by conversation_id, date_last_entry, date_first_entry, counter having EXTRACT(Minutes FROM date_last_entry::timestamp - date_first_entry::timestamp)>=$2",
        values: [minQuestions, minMinutes]
    }
    return await db.multipleRowsQuery(query)
}

// number of total conversations , with more than 3 request counters ( a person interacted with the bot )
// and less than 2 hours between first interaction and the last one
// ( a person could leave the pc, come back later, loosing attention span )
async function getTotalCount(minQuestions, minCounter) {

    let query = {
        text: "select count(*) from (select conversation_id, " +
        "date_first_entry, " +
        "EXTRACT(MINUTES FROM date_last_entry::timestamp - date_first_entry::timestamp) as minutes, " +
        "EXTRACT(Seconds FROM date_last_entry::timestamp - date_first_entry::timestamp) as seconds, " +
        "date_last_entry," +
        "counter from " +
        "       (select " +
        "                conversation_id," +
        "                (array_agg(date order by date asc))[1] as date_first_entry, " +
        "                (array_agg(date order by date asc))[count(conversation_id)] as date_last_entry, " +
        "                count(conversation_id) as counter" +
        "                from conversation group by conversation_id having count(conversation_id)>$1) as x " +
        "group by conversation_id, date_last_entry, date_first_entry, counter having EXTRACT(Minutes FROM date_last_entry::timestamp - date_first_entry::timestamp)>=$2 as hh",
        values: [minQuestions, minCounter]
    }

    return await db.multipleRowsQuery(query);
}

async function getAvgStats(minQuestions, minMinutes){

    let query = {
        text: "select avg(total_seconds)/60 as minutes, CAST (avg(counter) AS DOUBLE PRECISION) as counter from " +
        "        (select conversation_id," +
        "        EXTRACT(MINUTES FROM date_last_entry::timestamp - date_first_entry::timestamp) * 60 + " +
        "        EXTRACT(Seconds FROM date_last_entry::timestamp - date_first_entry::timestamp) as total_seconds, " +
        "        counter from " +
        "        (select conversation_id, " +
        "        (array_agg(date order by date asc))[1] as date_first_entry, " +
        "        (array_agg(date order by date asc))[count(conversation_id)] as date_last_entry, " +
        "        count(conversation_id) as counter from conversation group by conversation_id " +
        "        having count(conversation_id)>$1) as x " +
        "        group by conversation_id, date_last_entry, date_first_entry, counter " +
        "        having EXTRACT(MINUTES FROM date_last_entry::timestamp - date_first_entry::timestamp)>=$2) as kj",
        values: [minQuestions, minMinutes]
    }

    return await db.singleResultQuery(query);
}

async function getContext(input) {

    let query = {
        text: 'SELECT * from conversation ORDER BY date DESC LIMIT 1 WHERE id=$1 ;',
        values: [input.sender]
    };

    let context = await db.singleResultQuery(query);

    return {input, context};
}

async function pushContext(doc) {
    let uuid = uuidV1();

    const log = [
        uuid,
        doc.context.conversation_id,
        JSON.stringify(doc.intents),
        JSON.stringify(doc.entities),
        doc.input,
        doc.output,
        doc.context,
        doc.date];

    let query = {
        text:'INSERT INTO conversation(id, conversation_id, intents, entities, "input", "output", context, date) ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        values: log
    }

    return await db.singleResultQuery(query);
}

async function getContextByConversationId(id, limit){

    let query = {
        text: 'SELECT * FROM conversation ORDER by date DESC LIMIT $1 WHERE conversation_id=$2',
        values: [limit, id]
    }

    return await db.multipleRowsQuery(query);
}

async function getConversationLog(conversation_id){

    let sql = "SELECT * FROM conversation WHERE conversation_id='" + conversation_id + "' ORDER BY date ASC"

    return await db.multipleRowsQuery(sql);
}

module.exports = {

    getContext: getContext,
    pushContext: pushContext,
    getContextById: getContextByConversationId,
    getConversationLog: getConversationLog,
    getConversationCount (){
        return getTotalCount(3, 1)
    },
    getAvgStats(){
        return getAvgStats(3,1)
    },
    getConversationDataSet(){
        return getConversationDataSet(3, 1);
    },
}