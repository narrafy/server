const db = require('../../service/db/posgres')

async function saveContactInquiry(data){

    let query = {
        text: 'INSERT INTO contact(email, message, name, date) values ($1, $2, $3, CURRENT_TIMESTAMP)',
        values: [data.email, data.message, data.name]
    }

    return await db.singleResultQuery(query);
}

async function saveSubscriber(email, conversation_id = '')
{
    let query = {
        text: 'INSERT INTO subscriber(email, conversation_id, date) values ($1, $2, CURRENT_TIMESTAMP)',
        values: [email, conversation_id]
    }

    return await db.singleResultQuery(query);
}

module.exports= {
    contact: saveContactInquiry,
    subscribe: saveSubscriber
}