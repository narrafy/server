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

    const parsedArray = await db.getSemanticParsedContext(data.conversation_id, data.interview_type);
    const nodes =  config.interviewNodes[data.interview_type];
    nodes.forEach(key => {
        var sentence = parsedArray[key];
        if(sentence){
            const normalizedSentence = getNormalizedSentence({
                subject: getSubject(sentence),
                action: getAction(sentence),
                object: getObject(sentence)
            });
            data.template = data.template.replace(key, normalizedSentence);
        }
    });
    return data.template;
}

function getNormalizedSentence(data){
    return data.subject + " " + data.action + " " + data.object;
}

function getAction(sentence){
    return sentence.semantic_roles.action.normalized;
}

function getObject(sentence){
    return sentence.semantic_roles.object.text;
}

function getSubject(sentence){
    return sentence.semantic_roles.subject.text;
}

async function message(conversation){
    let text = conversation.output.text
    //declare local variables
    let currentContext = conversation.context

    //process facebook message
    if(currentContext && currentContext.recap_node)
    {
        text = await generateStory({
            conversation_id: currentContext.conversation_id,
            interview_type: currentContext.recap_node,
            template: conversation.output.text
        });
    }
    return mineResponse(text)
}

module.exports = {
    story: generateStory,
    message: message
}