const db = require('../utils/db/posgres')

async function saveContactInquiry(data){

    let query = {
        text: 'INSERT INTO contact(email, message, name, date) values ($1, $2, $3, CURRENT_TIMESTAMP)',
        values: [data.email, data.message, data.name]
    }

    return await db.singleResultQuery(query);
}

async function saveSubscriber(doc)
{
    let query = {
        text: 'INSERT INTO subscriber(conversation_id, email, date) values ($1, $2, $3)',
        values: [doc.conversation_id, doc.email, doc.date]
    }

    return await db.singleResultQuery(query);
}

module.exports= {

    async contact(data) {
        await saveContactInquiry(data)
    },

    async subscribe(data) {
        await saveSubscriber(data)
    }
}