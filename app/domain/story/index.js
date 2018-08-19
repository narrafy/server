const db = require('../../service/db/posgres')
const processing = require('../../service/nlp/generation/processing')
const conversation = require('../conversation')
const transcript = require('../transcript')
const emailService = require('../../service/email')

async function saveStory(doc){
    let query = {
        text: 'INSERT INTO ' + collection.story + '(conversation_id, email, story, date) values ($1, $2, $3, CURRENT_TIMESTAMP)',
        values: [doc.conversation_id, doc.email, doc.story]
    }

    return await db.singleResultQuery(query);
}

async function getStory(conversation_id){

    let query = {
        text: 'SELECT * FROM ' + collection.story + 'ORDER by date DESC LIMIT 1 WHERE conversation_id=$1',
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

async function getStub(conversation_id){

    const conversation = await conversation.get(conversation_id, 1)
    let story_templates = await getTemplate()
    let email = ""
    let user_name = ""
    let cc = ""

    if(conversation && conversation.length > 0){
        let ctx = conversation[0].context
        if(ctx["user_email"])
            email = ctx["user_email"]
        if(ctx["user_name"])
            user_name = ctx["user_name"].text
        let stories = {}
        for(let j=0;j<story_templates.length; j++){
            let cursor = story_templates[j]
            let story_key = cursor.interview_type
            let template_nodes = cursor.nodes
            let story_template = cursor.templates
            let story = getStory(ctx, template_nodes, story_template)
            stories[story_key] = story
        }
        return {
            name: user_name,
            email: email,
            story: stories,
            cc: cc
        }
    }
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
    let story = await story.get(conversation_id)
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