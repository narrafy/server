const natural = require('natural')
const tokenizer = new natural.WordTokenizer()
const nlp = require('compromise')
const understanding = require('../understanding')
const config = require('../../config')

function getAction(sentence){
    let semanticRole = getSemanticRole(sentence)
    if(semanticRole && semanticRole.action && semanticRole.action.length > 0){
        let action = semanticRole.action[0];
        return action
    }
    return ""
}

function getObject(sentence) {
    let semanticRole = getSemanticRole(sentence)
    if(semanticRole && semanticRole.object && semanticRole.object.length > 0)
        return to2PRPForm(semanticRole.object[0]);
    return "";
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
    return sentence
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
    if(semanticRole && semanticRole.subject && semanticRole.subject.length > 0)
        return to2PRPForm(semanticRole.subject[0])
    return "You";
}

function getSemanticRole(sentence) {
    if(sentence.semantics){
        return sentence.semantics;
    }
    return null
}

function parsedStory(mapArray, template)
{
    let story = ""
    const nodes =  template.nodes
    nodes.forEach(key => {
        var sentence = mapArray[key];
        if(sentence) {
            story = getNormalizedStory(sentence, key, template)
        }
    })
    return story
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
        .replace(sentenceKey, originalSentence)

    return normalizedSentence;
}

module.exports = {
    parsedStory: parsedStory
}