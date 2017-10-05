const config = require('../../config')
const db = require('../../db')
const emojiReplacer = require('../../utils/emoji')
const log = require('../../log')
const natural = require('natural')
const tokenizer = new natural.WordTokenizer()
const nlp = require('compromise')

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
                text: contextArray[i].item.text,
                semantic_data: contextArray[i].semantic_data
            };
        }

        const nodes =  config.interviewNodes[data.interview_type]
        nodes.forEach(key => {
            var sentence = mapArray[key];
            if(sentence)
                return data.template = getNormalizedStory(sentence, key, data.template);
        });
        return data.template
    }
}

function getNormalizedStory(sentence, key, template){

    let doc = nlp(sentence.text).normalize().out('text').toLowerCase();
    let originalSentence = to2PRPForm(doc);
    let subject = getSubject(sentence);
    let action = getAction(sentence);
    let object = getObject(sentence);

    let subjectKey = '_'.concat(key).concat('.subject');
    let actionKey = '_'.concat(key).concat('.action');
    let objectKey = '_'.concat(key).concat('.object');
    let sentenceKey = '_'.concat(key).concat('.sentence');

    let normalizedSentence = template.replace(new RegExp(subjectKey, 'g'), subject)
        .replace(new RegExp(actionKey,'g'), action)
        .replace(new RegExp(objectKey, 'g'), object)
        .replace(sentenceKey, originalSentence);

    return normalizedSentence;
}

function getAction(sentence){
    let semanticRole = getSemanticRole(sentence)
    if(semanticRole && semanticRole.action){
        let action = semanticRole.action;
        if(action.verb){
            let verb = action.verb;
            if(verb.negated)
            {
                return "cannot " + verb.text;
            }
            if(verb.text)
                return verb.text;
            return semanticRole.action.text;
        }
    }
    return ""
}

function getObject(sentence){
    let semanticRole = getSemanticRole(sentence)
    if(semanticRole && semanticRole.object && semanticRole.object.text)
            return to2PRPForm(semanticRole.object.text);
    return null
}

function to2PRPForm(text){
    if(!text) return;
    let tokenizeSentence = tokenizer.tokenize(text)
    let arr = [];
    for(let k=0; k< tokenizeSentence.length; k++)
    {
        let token = tokenizeSentence[k];
        if(token === "I" || token === "i")
        {
            if(k==0){
                arr.push("You");
            }else{
                arr.push("you")
            }
        } else if(token === "my") {
            arr.push("your")
        } else if(token === "me") {
            arr.push("you")
        } else if(token ==="myself") {
            arr.push("yourself")
        } else {
            arr.push(token)
        }
    }
    return arr.join(" ");
}

function getSubject(sentence){
   let semanticRole = getSemanticRole(sentence);
   if(semanticRole && semanticRole.subject)
        return to2PRPForm(semanticRole.subject.text)
    return "You";
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

    //generate a user story
    if(currentContext && currentContext.recap_node)
    {
        try{
            let story = await generateStory({
                conversation_id: currentContext.conversation_id,
                interview_type: currentContext.interview_type,
                template: conversation.output.text
            })
            if(story!==null)
                text = story

        }catch (e){
            log.error(e)
        }

    }
    return mineResponse(text)
}

module.exports = {
    story: generateStory,
    message: message
}