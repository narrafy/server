const config = require('../../config')
const db = require('../../db')
const emojiReplacer = require('../../utils/emoji')
const log = require('../../log')
const natural = require('natural')
const tokenizer = new natural.WordTokenizer()
const nlp = require('compromise')

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
            if(sentence && data.template)
                if(data.interview_type === config.interviewTypes.internalization)
                    return data.template = getNormalizedStory(sentence, key, data.template)
                if(data.interview_type === config.interviewTypes.externalization)
                    return data.template = getNormalizedProblematicStory(sentence, key, data.template)
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

function getNormalizedProblematicStory(sentence, key, template){

    let doc = nlp(sentence.text).normalize().out('text').toLowerCase();
    let originalSentence = to3RdForm(doc);
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

function getObject(sentence)
{
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

        } else if(token ==="am" || token ==="m")
        {
          arr.push("are")
        } else {
            arr.push(token)
        }
    }
    let sentence = arr.join(" ")
    return capitalizeFirstLetter(sentence)
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function to3RdForm(text) {
    if(!text) return;
    let tokenizeSentence = tokenizer.tokenize(text)
    let arr = [];
    for(let k=0; k < tokenizeSentence.length; k++)
    {
        let token = tokenizeSentence[k];
        if(token === "I" || token === "i")
        {
            if(k==0){
                arr.push("He");
            }else{
                arr.push("he")
            }
        } else if(token === "my") {
            arr.push("his")
        } else if(token === "me") {
            arr.push("he")
        } else if(token ==="myself") {
            arr.push("himself")

        } else if(token ==="am" || token ==="m")
        {
            arr.push("is")
        } else {
            arr.push(token)
        }
    }
    let sentence = arr.join(" ")
    return capitalizeFirstLetter(sentence)

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
    let textArray = mineResponse(conversation.output.text)

    //declare local variables
    let currentContext = conversation.context

    //generate a user story
    if(currentContext && currentContext.recap_node)
    {
        if(textArray){
            for(let i = 0; i< textArray.length; i++){
                try{
                    let story = await generateStory({
                        conversation_id: currentContext.conversation_id,
                        interview_type: currentContext.interview_type,
                        template: textArray[i]
                    })
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
        }
    }

    return textArray
}

module.exports = {
    story: generateStory,
    message: message
}