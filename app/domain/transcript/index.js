const db = require('../../service/db/posgres')
const Storage = require('../conversation/storage')
const nlp = require('../../service/nlp/generation')
const Email = require('../../service/email')
const Config = require('../../service/config')
const Ejs = require('ejs')
const Path = require('path')

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
    let logs = await Storage.getThread(id)
    if(!logs) return null

    const transcript = []
    logs.forEach(conversation => {
        if (conversation.input && conversation.input.text) {
            let text = nlp.parse([conversation.input.text]);
            transcript.push({ senderId: "You" , text })
        }
        if (conversation.output && conversation.output.text) {
            let text = nlp.parse([conversation.output.text.join(' ')]);
            transcript.push({ senderId: "Narrafy" , text })
        }
    })
    return transcript;
}

function transcriptToText(transcript){
    let string = ""
    if(!transcript) return string

    let n = transcript.length;
    for(let i = 0; i < n; i++){
        string+= transcript[i].senderId = "\r"
        string+= transcript[i].text + "\r"
    }
    return string
}

function email(email, transcript){

    let filePath = Path.join(__dirname, '..', 'transcript', 'template', 'index.html')
    let data = {
        title: "Your conversation transcript",
        header: "Thank you for training our robot!",
        type_of_action:"conversation transcript",
        websiteUrl: Config.website.url,
        unsubscribeUrl: Config.website.unsubscribe + "?email=" + email,
        blogUrl: Config.website.blog,
        transcript: transcript
    }
    let options= {}

    Ejs.renderFile(filePath, data, options, function(err, str){
        if(err){
            console.log(err)
            return
        }

        const msg = {
            to: email,
            from: Config.sendGrid.contactEmail,
            fromname: Config.app.name,
            subject: "Conversation Transcript",
            text: data.title + " : " + transcriptToText(transcript),
            html: str,
        }
        Email.sendMessage(msg)
    })
}

module.exports = {
    build: build,
    get: get,
    save: save,
    send: email
}