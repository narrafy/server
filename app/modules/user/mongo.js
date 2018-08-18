const client = require('../utils/db/mongo')

async function saveInquiry(data) {
    return client.connection.collection("contact").save(data)
}


async function saveSubscriber(data) {
    return client.connection.collection("subscribers")
        .replaceOne({ conversation_id: data.conversation_id }, data , { upsert: true })
        .then(() => data)
}

module.exports= {

    async contact(data) {
        await saveInquiry(data)
    },

    async subscribe(data) {
        await saveSubscriber(data)
    }
}