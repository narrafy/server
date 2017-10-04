const config = require('../../config')
const db = require('../../db')
const emojiReplacer = require('../../utils/emoji')

function mineResponse(data) {
    var text = ''
    if (data) {
        if (data.length > 0 && data[1]) {
            text = data[0] + ' ' + data[1]
        } else if (data[0]) {
            text = data[0]
        }
    }
    return emojiReplacer.replaceEmojiKey(text)
}

async function generateStory(data) {

    const contextArray = await db.getSemanticParse(data.conversation_id, data.interview_type);

    if(contextArray){

        let mapArray = {};
        for(let i = 0; i < contextArray.length; i++){
            mapArray[contextArray[i].label] = {
                "text": contextArray[i].item.text,
                semantic_data: contextArray[i].semantic_data
            };
        }

        const nodes =  config.interviewNodes[data.interview_type]
        nodes.forEach(key => {
            var sentence = mapArray[key];
            if(sentence){
                let normalizedSentence = getNormalizedSentence({
                    subject: getSubject(sentence),
                    action: getAction(sentence),
                    object: getObject(sentence),
                    original: sentence.text
                });
                let watsonKey = "$" + key + ".text";
                data.template = data.template.replace(watsonKey, normalizedSentence)
            }
        });
        return data.template
    }
    return null
}

function getNormalizedSentence(sentence){
    //if there is no verb detected, return original user input.
    if(sentence.action === null)
        return sentence.original.replace("I", "You").replace("me", "You").replace("my", "your");
    return sentence.subject + " " + sentence.action + " " + sentence.object;
}

function getAction(sentence){
    let semanticRole = getSemanticRole(sentence)
    if(semanticRole && semanticRole.action){
            return semanticRole.action.normalized;
    }
    return null
}

function getObject(sentence){
    let semanticRole = getSemanticRole(sentence)
    if(semanticRole && semanticRole.object)
            return semanticRole.object.text
    return null
}

function getSubject(sentence){
   // let semanticRole = getSemanticRole(sentence);
   // if(semanticRole && semanticRole.subject)
   //     return semanticRole.subject.text
    return "You"
}

function getSemanticRole(sentence) {
    if(sentence.semantic_data){
        let partSpeech = sentence.semantic_data;
        if(partSpeech && partSpeech.semantic_roles.length > 0){
            return partSpeech.semantic_roles[0];
        }
    }
    return null
}


async function message(conversation){
    let text = conversation.output.text
    //declare local variables
    let currentContext = conversation.context

    //process facebook message
    if(currentContext && currentContext.recap_node)
    {
        let story = await generateStory({
            conversation_id: currentContext.conversation_id,
            interview_type: currentContext.recap_node,
            template: conversation.output.text
        })
        if(story!==null)
            text = story
    }
    return mineResponse(text)
}

module.exports = {
    story: generateStory,
    message: message
}