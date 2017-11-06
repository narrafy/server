const natural = require('natural')
const tokenizer = new natural.WordTokenizer()
const nlp = require('compromise')
const understanding = require('../understanding')
const config = require('../../config')

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

function parseTemplate(templates, array){

    let stories = []

    for(let i = 0; i< templates.length; i++)
    {
        let currentTemplate = templates[i]
        for (let key in array)
        {
            let value = array[key]
            let doc = nlp(value).normalize().out('text').toLowerCase()
            let originalSentence = to2PRPForm(doc)
            currentTemplate = currentTemplate.replace(new RegExp(key, 'g'), originalSentence)
        }
        stories.push(currentTemplate)
    }

    return stories.join(" ")
}

module.exports = {
    parseTemplate: parseTemplate
}