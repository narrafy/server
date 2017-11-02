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

async function parseReply(data){

    const contextArray = await db.getSemanticParse(data.conversation_id)
    let  template = await db.getStoryTemplates(data.interview_type)

    if(contextArray){
        let mapArray = {}
        for(let i = 0; i < contextArray.length; i++) {
            let node = contextArray[i].node_name
            let text = contextArray[i].text
            let semantics = contextArray[i].semantics
            mapArray[node] = {
                text: text,
                semantics: semantics
            }
        }
        let template  = processing.parsedStory(mapArray, template)
        return template
    }
}

async function message(conversation){

    return mineResponse(conversation.output.text)
}

module.exports = {
    parseReply: parseReply,
    message: message
}