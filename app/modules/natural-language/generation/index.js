const db = require('../../db')
const emojiReplacer = require('../../utils/emoji')
const log = require('../../log')
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
        let template  = processing.parsedStory(mapArray, data.template)
        return template
    }
}

async function message(conversation){

    let textArray = mineResponse(conversation.output.text)

    //declare local variables
    let currentContext = conversation.context

    //generate a user story
    if(currentContext)
    {
        if(textArray){

            for(let i = 0; i< textArray.length; i++){

                if(currentContext.recap_node)
                {
                    try{
                        let params = {
                            conversation_id: currentContext.conversation_id,
                            interview_type: currentContext.interview_type,
                            template: textArray[i]
                        };
                        let story = await parseReply(params)

                        if(story){
                            textArray[i] = story
                            //disable the flag
                            currentContext.recap_node = false

                            await db.saveStory({
                                conversation_id: currentContext.conversation_id,
                                interview_type: currentContext.interview_type,
                                story: story})
                        }
                    }catch (e){
                        log.error(e)
                    }
                }

                if(currentContext.parse_node)
                {
                    try{
                        let params = {
                            conversation_id: currentContext.conversation_id,
                            template: textArray[i]
                        }
                        let story = await parseReply(params)

                        if(story){
                            textArray[i] = story
                            //disable the flag
                            currentContext.parse_node = false
                        }
                    }catch (e){
                        log.error(e)
                    }
                }
            }
        }
    }
    return textArray
}

module.exports = {
    story: parseReply,
    message: message
}