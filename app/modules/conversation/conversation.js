var fb = require('../bots/facebook');
var watson = require('./watson');
var context = require ('./context');

//callback after the message was received by the backend
var callback_received_message = (input, stored_log) => {

    //populate the request object to send to watson
    var request = watson.LoadRequest(input, stored_log);

    //send a reply to facebook page
    var cb = (err, conversation) => {
        if (err) {
            console.log("error in the facebook callback function " + err);
            fb.SendMessage(request.id, {text: err});
        }
        if (conversation && conversation.output) {

            var context_callback = (context_data) =>
            {
                //watson have an answer
                //declare local variables
                var currentContext = context_data.context;

                var message = {};
                //mine watson response
                message.text = watson.Mine(context_data.output.text);
                //add quick replies to facebook message
                if (currentContext && currentContext.quick_replies) {
                    message.quick_replies = currentContext.quick_replies;
                }
                //if its a recap node, send the story to the user
                //if(context.IsRecapNode(data.context))
                //{
                //   message.text = context.GetRecapStory(data);
                //   fb.SendMessage(request.id, message);
                // } else {
                fb.SendMessage(request.id, message);
                console.log("Watson replies with: " + message.text + " " + request.id);
                // }
            };
            context.Push(request.id, conversation, context_callback);
            context.Tasks(conversation);

        } else {
            fb.SendMessage(request.id, {
                text: 'I am probably training again.' +
                'Please write me later!'
            });
        }
    };
    //Send the input to the conversation service
    watson.Ask(request, cb);
};

function messengerRequest(body) {
    var events = body.entry[0].messaging;
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var data = {
            sender: event.sender.id,
            text: ""
        };

        //user interacts with the page for the first time
        if(event.optin || event.postback)
        {
            switch (event.postback.payload) {
                //user interacts with the page for the first time.
                case 'optin':
                    context.Get(data, callback_received_message);
                    break;
                case 'CONTACT_REQUEST':
                    fb.SendMessage(data.sender, "Human on the way. We will contact you as soon as possible!");
                    fb.SendMessage(process.env.ADMIN_FB_ID, "Check the facebook page!");
                    break;
                //clear context button was pressed
                case 'CLEAR_CONTEXT':
                    context.Clear(data, callback_received_message);
                    break;
                default:
                    break;
            }
        }

        //a conversation starts
        if(event.message){
            //user picks from quick replies
            if(event.message.text) {
                if(event.message.text==="Let's try again"){
                    context.Clear(data, callback_received_message);
                }else{
                    data.text = event.message.text;
                    context.Get(data, callback_received_message);
                }
            }
        }
    }
}

function webRequest(id, body, res) {
    var data = {};
    if (body) {
        if (body.input) {
            data.text = body.input.text;
        }
        if (body.context) {
            data.context = body.context;
        }
    }
    var cb = (err, data) => {
        if (err) {
            return res.status(err.code || 500).json(err);
        }
        var response = updateMessage(id, data);
        return res.json(response);
    };

    //Send the input to the conversation service
    watson.Ask(data, cb);
}

function updateMessage(id, conversation) {
    var responseText = null;
    if (conversation.output){

        context.Push(id, conversation);
        context.Tasks(conversation);

        if (conversation.output.text && conversation.output.text[0]){
            //if(context.IsRecapNode(data.context)){
            //    data.output.text = context.GetRecapStory(data);
            //} else {
            conversation.output.text = watson.Mine(conversation.output.text);
            //}
            return conversation;
        }
    } else {
        conversation.output = {};
    }

    if (conversation.intents && conversation.intents[0]) {
        var intent = conversation.intents[0];
        if (intent.confidence >= 0.75) {
            responseText = "I understood you but I don't have an answer yet. Could you rephrase your question? ";
        } else {
            responseText = "I didn't get that. Sometimes only a human can help. Do you want to talk to one?";
        }
    }

    context.Push(id, conversation);
    context.Tasks(conversation);

    //if(context.IsRecapNode(data.context)){
    //  data.output.text = context.GetRecapStory(data);
    //} else {
    conversation.output.text = watson.Mine(responseText);
    //}
    return conversation;
}

module.exports = {

    Messenger: (body) => {
        messengerRequest(body);
    },

    Web: (req, res) => {
        webRequest(req.sessionID, req.body, res);
    },
};