const db = require('../utils/db/posgres')
const conversation = require('../conversation/')

async function get(conversation_id){

    let query = {
        text: 'SELECT * FROM transcript WHERE conversation_id=$1 ;',
        values: [conversation_id]
    }
    return await db.singleResultQuery(query);
}

async function save(doc){

    let query = {
        text: 'INSERT INTO transcript(conversation_id, email, transcript, date) values ($1, $2, $3, $4)',
        values: [doc.conversation_id, doc.email, JSON.stringify(doc.transcript), doc.date]
    }
    return await db.singleResultQuery(query);
}

async function build(id)
{
    let logs = await conversation.log(id)
    if(!logs) return null

    const transcript = []
    logs.forEach(conversation => {
        if (conversation.input && conversation.input.text) {
                transcript.push({ senderId: "User" , text: [conversation.input.text] })
        }
        if (conversation.output && conversation.output.text) {
            transcript.push({ senderId: "Narrafy" , text: conversation.output.text })
        }
    })
    return transcript;
}

module.exports = {
    build: build,
    get: get,
    save: save
}