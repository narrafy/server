const db = require('../../service/db/posgres')
const processing = require('../../service/nlp/generation/processing')
const transcript = require('../transcript')
const emailService = require('../../service/email')

async function saveStory(doc){
    let query = {
        text: 'INSERT INTO story(conversation_id, email, story, date) values ($1, $2, $3, CURRENT_TIMESTAMP)',
        values: [doc.conversation_id, doc.email, doc.story]
    }

    return await db.singleResultQuery(query);
}

async function getStory(conversation_id){
    let query = {
        text: 'SELECT * FROM story WHERE conversation_id=$1 ORDER by date DESC LIMIT 1',
        values: [conversation_id]
    }

    return await db.multipleRowsQuery(query);
}

async function getTemplate (){

    let query = {
        text: 'SELECT * FROM story_template',
        values: []
    }

    return await db.multipleRowsQuery(query);
}

async function saveTemplate (doc){

    let query = {
        text: 'INSERT INTO story_template(interview_type, nodes, stub) values ($1, $2, $3)',
        values: [ doc.interview_type, JSON.stringify(doc.nodes), JSON.stringify(doc.templates) ]
    }

    return await db.multipleRowsQuery(query);
}


function getStory(ctx, template_nodes, story_template) {
    let array = {}
    for(let prop in ctx) {
        for(let i = 0; i < template_nodes.length; i++ ){
            if(template_nodes[i] === prop) {
                let textKey = '_'.concat(prop).concat('.text')
                let value = ctx[prop].text

                if(value) {
                    array[textKey] = value
                }
            }
        }
    }
    let story = processing.parseTemplate(story_template, array)
    return story
}

async function getStoryModel(conversation_id) {
    let story = getStory(conversation_id)
    if(story.length > 0){
        let model = {
            conversation_id: story[0].conversation_id,
            email: story[0].email,
            transcript: story[0].story,
        }
        return model
    }

    let entry =  await transcript.get(conversation_id)
    if(entry) {
        let st = "";
        entry.transcript.forEach(item =>
        {
            let text = item + '\r\n';
            st += text;
        });

        let model = {
            conversation_id: entry.conversation_id,
            email: entry.email,
            transcript: st,
        }
        return model
    } else {
        return null
    }
}

function send(){
    emailService.bot(data)
}

module.exports = {
    save: saveStory,
    get: getStory,
    send: send,
    getModel: getStoryModel
}