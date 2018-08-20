const db = require('../../service/db/posgres')
const Storage = require('../conversation/storage')
const nlp = require('../../service/nlp/generation')
const EmailService = require('../../service/email')

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

async function build(id) {
    let logs = await Storage.getConversationLog(id)
    if(!logs) return null

    const transcript = []
    logs.forEach(conversation => {
        if (conversation.input && conversation.input.text) {
                transcript.push({ senderId: "You" , text: conversation.input.text })
        }
        if (conversation.output && conversation.output.text) {
            transcript.push({ senderId: "Narrafy" , text: conversation.output.text.join(' ') })
        }
    })
    return transcript;
}

function toHtml(transcript) {

    let k = transcript.length;
    let transcriptHtml = "";
    for(let i = 0; i < k; i ++){
        if(i%2){
            transcriptHtml += "<li> <strong>" + transcript[i].senderId +":</strong> " + nlp.parse([transcript[i].text]) + "</li>"
        }else {
            transcriptHtml += "<li><strong>"+ transcript[i].senderId +":</strong> " + nlp.parse([transcript[i].text]) + "</li>"
        }
    }
    return transcriptHtml
}

function send(email, transcript){
    let html = toHtml(transcript)
    EmailService.transcript(email, html)
}

module.exports = {
    build: build,
    get: get,
    save: save,
    send: send
}