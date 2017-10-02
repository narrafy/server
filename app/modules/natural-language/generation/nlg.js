const config = require('../config')
const db = require('../db')
const nlu = require('../natural-language/understanding/nlu')


async function generateStory(parsedArray) {

    var template = await db.getStoryTemplate(config.interview.internalization.flagName);
    config.interview.type.internalization.vars.forEach(key => {
        var sentence = parsedArray[key];
        if(sentence){
            const normalizedSentence = getNormalizedSentence({
                subject: getSubject(sentence),
                action: getAction(sentence),
                object: getObject(sentence)
            });
            template = template.replace(key, normalizedSentence );
        }
    });
    return template;
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


module.exports = {

    story: generateStory
}