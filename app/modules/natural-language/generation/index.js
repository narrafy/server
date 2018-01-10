const db = require('../../db')
const emojiReplacer = require('../../utils/emoji')
const processing = require('./processing')

function mineResponse(data) {

    let messageArray = []
    if (data) {
        for(let j=0; j< data.length; j++)
        {
            messageArray[j] = emojiReplacer.replaceEmojiKey(data[j])
        }
    }
    return messageArray
}

async function getStoryStub(conversation_id){

    const conversation = await db.getContextById(conversation_id, 1)
    let story_templates = await db.getStoryTemplates()
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

function getStory(ctx, template_nodes, story_template)
{
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

async function message(conversation){

    return mineResponse(conversation.output.text)
}

module.exports = {
    message: message,
    getStoryStub: getStoryStub
}