var natural = require('natural');
const admin_email = process.env.ADMIN_EMAIL;
var mongo = require('./mongo');
var sg = require('./sendgrid');
var nlu = require('./nlu');
var nlg = require('./nlg');

var tokenizer = new natural.WordTokenizer();

var ProblemNodeName = "internal_problem";
var InternalContextNodes = [
    "internal_problem_context",
    "internal_problem_prerequisite",
    "internal_problem_influence",
    "influence_on_relationships",
    "influence_on_relationships_example",
    "internal_problems_difficulties",
    "internal_problem_invitation_to_unique_outcome"];

var ExternalContextNodes = ["external_problem",
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

function isInternalProblemNode(node_name) {
    return InternalContextNodes.hasOwnProperty(node_name);
}

function isExternalProblemNode() {
    return ExternalContextNodes.hasOwnProperty(node_name);
}

/* tasks to run after the context of a conversation is pushed to the database
 * it's usually to send an email or parse the context variable */
function runContextTasks(conversation, callback) {

    var conversation_id = conversation.context.conversation_id;

    var context_var_name = SemanticContextNode(conversation);

    if (isEmailNode(conversation)) {
        var email = conversation.input.text;

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
    //check if it's a recap node
    if(isInternalRecapNode(conversation)){
        // if a recap node, check semantic roles of the context and generate a story
        //message.text = nlg.GetInternalProblemStory(conversation_id);
        //facebook_callback(request.id, message);
    }

    if(context_var_name!=null)
    {
        var cb = (semantic_data)=>{

            var context_var_semantics= {
                conversation_id: conversation_id,
                context_var: context_var_name,
                semantics: semantic_data
            };
            var callback_update_context = () =>
            {
                conversation.context[context_var_name] = undefined;
                //push new context to the database only after deleting semantic variable from the context
                if(callback)
                    return callback(conversation);
            }
            mongo.SaveSemantics(context_var_semantics, callback_update_context)
        };

        //found the context variable to send to semantic parser
        var context_var = conversation.context[context_var_name];
        //send for parsing only there is a sentence to be parsed
        if(isSentence(context_var))
            nlu.GetSemanticRoles(context_var,cb);
        else
            callback(conversation);
    } else {
        // if there is no parsable variable in the context just push the context to the database
        callback(conversation);
    }
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

function isInternalRecapNode(conversation){
    return getCurrentNodeName(conversation) === nlg.Story.INTERNAL_PROBLEM;
}

function getCurrentNodeName(conversation){
    if(conversation.context &&
        conversation.context.system &&
        conversation.context.system.dialog_stack &&
        conversation.context.system.dialog_stack.length > 0)
        return conversation.context.system.dialog_stack[0].dialog_node;
    return null;
}

function SemanticContextNode(conversation){
    for(let i=0; i < InternalContextNodes.length; i++){
        if(conversation.context && conversation.context.hasOwnProperty(InternalContextNodes[i]))
            return InternalContextNodes[i];
    }
    return null;
}

function isExternalRecapNode(conversation){
    return conversation.context &&
        conversation.context.system &&
        conversation.context.system.dialog_stack &&
        conversation.context.system.dialog_stack.length > 0 &&
        conversation.context.system.dialog_stack[0] === nlg.Story.EXTERNAL_PROBLEM;
}

module.exports = {

    Tasks: (conversation, cb) => {
        runContextTasks(conversation, cb)
    },
    Push: (id, context) => {
        mongo.PushContext(id, context);
    },
    Get: (data, cb) => {
        mongo.GetContext(data, cb);
    },
    Clear: (data,cb) => {
        mongo.ClearContext(data, cb);
    },
}