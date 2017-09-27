"use strict";
const admin_email = process.env.ADMIN_EMAIL;

var natural = require('natural');
var mongo = require('./mongo');
var sg = require('./sendgrid');
var nlu = require('./nlu');
var nlg = require('./nlg');
var tokenizer = new natural.WordTokenizer();

var Story = {
    INTERNAL_PROBLEM: "recap_internal_problem",
    EXTERNAL_PROBLEM: "recap_external_problem"
};

var ProblemNodeName = "internal_problem";

var InternalContextNodes = [
    "internal_problem_context",
    "internal_problem_prerequisite",
    "internal_problem_influence",
    "influence_on_relationships",
    "influence_on_relationships_example",
    "internal_problems_difficulties",
    "internal_problem_invitation_to_unique_outcome"
];

var ExternalContextNodes = [
    "external_problem",
    "vulnerable_to_external_problem",
    "external_problem_context",
    "external_problem_takeover",
    "external_problem_jeopardize_judgement",
    "external_problem_effect_on_relationships",
    "external_problem_cause_difficulties",
    "external_problem_blind_resources",
    "external_problem_unique_outcome",
    "external_problem_invite_action"
];

/* tasks to run after the context of a conversation is pushed to the database
 * it's usually to send an email or parse the context variable */
function runContextTasks(conversation) {

    if (isEmailNode(conversation)) {
        var email = conversation.input.text;
        var conversation_id = conversation.context.conversation_id;

        var cb = (trans) =>
        {
            sg.SendTranscript(email, trans );
        };
        mongo.GetTranscript(conversation_id, cb);
    }

    if (is3RdNode(conversation)) {
        sg.NotifyAdmin(
            {
                email: admin_email,
                message: "Someone is talking to the bot. Remember to train on the input!"
            }
        );
    }

}

function semanticParse(context, array){

    var conversation_id = context.conversation_id;
    var parsedArray = [];
    for(let i=0; i < array.length; i++){
        var context_var_name = array[i];
        if(context && context.hasOwnProperty(context_var_name))
        {
            //found the context variable to send to semantic parser
            var context_var = context[context_var_name];
           if(context_var){
               parseItem(context_var,context_var_name, conversation_id, (item) =>
               {
                   parsedArray[context_var_name] = item;
               });
           }
        }
    }
    return parsedArray;
}

function parseItem(context_var, context_var_name, conversation_id, callback){
    var cb = (semantic_data) => {
        var context_var_semantics = {
            conversation_id: conversation_id,
            context_var: context_var_name,
            semantics: semantic_data
        };
        mongo.SaveSemantics(context_var_semantics);
        callback(semantic_data);
    };
    //send for parsing only there is a sentence to be parsed
    if(isSentence(context_var))
        nlu.GetSemanticRoles(context_var, cb);
}

function isSentence(context_variable) {
    var tokenized_sentence = tokenizer.tokenize(context_variable);
    return tokenized_sentence.length > 1;
}

function isEmailNode(conversation){
    return conversation.entities &&
        conversation.entities[0] &&
        conversation.entities[0].entity === "email"
}

function is3RdNode(conversation){
    return conversation.context &&
        conversation.context.system &&
        conversation.context.system.dialog_request_counter===3;
}

function isRecapNode(context){
    return context && (context.recap_node === Story.INTERNAL_PROBLEM || context.recap_node === Story.EXTERNAL_PROBLEM);
}

function getRecapStory(conversation){
    var template = conversation.output.text;
    switch(conversation.context.recap_node) {
        case Story.INTERNAL_PROBLEM:
            var array = semanticParse(conversation.context, InternalContextNodes);
            return getSentence(array, template);
        case Story.EXTERNAL_PROBLEM:
            var array = semanticParse(conversation.context, ExternalContextNodes);
            return getExternalProblemStory(array, template);
        default:
            return null;
    }
}

/*
*
* $user_name you say you are too $internal_problem. And this is what it does to your life.
* You are too $internal_problem about internal_problem_context. There is a trigger that launches it:
* internal_problem_prerequisite. This does affect your life, because it makes you do things you wouldn’t do otherwise.
* For ex: internal_problem_influence. It affects the people and relationships you care about -- influence_on_relationships_example.
* It makes your life difficult: internal_problems_difficulties.
* But, there is a hope. You see it: internal_problem_invitation_to_unique_outcome.
*
* */

function getSentence(template, array)
{
    if(array["internal_problem_context"])
        template = template.replace("internal_problem_context", array["internal_problem_context"].semantic_roles.object.text);
    if(array["internal_problem_prerequisite"])
        template = template.replace("internal_problem_prerequisite", array["internal_problem_prerequisite"].semantic_roles.object.text);
    if(array["internal_problem_influence"])
        template = template.replace("internal_problem_influence", "You " + array["internal_problem_influence"].semantic_roles.action.normalized + array["internal_problem_influence"].semantic_roles.object.text);
    if(array["influence_on_relationships_example"])
        template = template.replace("influence_on_relationships_example", "You " + array["influence_on_relationships_example"].semantic_roles.action.normalized + array["influence_on_relationships_example"].semantic_roles.object.text);
    if(array["internal_problems_difficulties"])
        template = template.replace("internal_problems_difficulties", "You " + array["internal_problems_difficulties"].semantic_roles.action.normalized + array["internal_problems_difficulties"].semantic_roles.object.text);
    if(array["internal_problem_invitation_to_unique_outcome"])
        template = template.replace("internal_problem_invitation_to_unique_outcome", array["internal_problem_invitation_to_unique_outcome"].semantic_roles.object.text);
    return template;
}

function getInternalProblemStory(array, template){
    var text = template;
    for(let i = 0; i < array.length; i++){
        for(let j=0; j < InternalContextNodes.length; j++)
        {
            var context_var_node = InternalContextNodes[j];

            if(array[i].context_var === context_node){
                console.log(array[i]);
            }
        }
    }
    return text;
}

function getExternalProblemStory(array, template){

}

module.exports = {

    IsRecapNode: (context) => {
      return isRecapNode(context);
    },

    GetRecapStory: (conversation) => {
        return getRecapStory(conversation)
    },

    Tasks: (conversation) => {
        runContextTasks(conversation)
    },
    Push: (id, context, cb) => {
        mongo.PushContext(id, context, cb);
    },
    Get: (data, cb) => {
        mongo.GetContext(data, cb);
    },
    Clear: (data,cb) => {
        mongo.ClearContext(data, cb);
    },
}