var fb = require('./facebook');
var watson = require('./watson');
var context = require ('./context');

//callback after the message was received by the backend
var callback_received_message = (input, stored_log) => {

    //populate the request object to send to watson
    var request = watson.LoadRequest(input, stored_log);

    //send a reply to facebook page
    var cb = (err, data) => {
        fb.StartTyping(input.sender);

        if (err) {
            console.log("error in the facebook callback function " + err);
            fb.SendMessage(request.id, {text: err});
        }
        if (data && data.output) {
            //watson have an answer
            //declare local variables
            var currentContext = data.context;
            var message = {};
            //mine watson response
            message.text = watson.Mine(data.output.text);
            //add quick replies to facebook message
            if (currentContext && currentContext.quick_replies) {
                message.quick_replies = currentContext.quick_replies;
            }
            context.Tasks(data ,(updated_context) => {
                context.Push(request.id, updated_context);
            });

            setTimeout(function(){
                fb.SendMessage(request.id, message);
            }, 1500);
            console.log("Watson replies with: " + message.text + " " + request.id);

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

function updateMessage(id, data) {
    var responseText = null;
    if (!data.output) {
        data.output = {};
    } else {
        context.Tasks(data, (updated_context) => {
            context.Push(id, updated_context);
        });

        if (data.output.text && data.output.text[0]){
            data.output.text = watson.Mine(data.output.text);
            return data;
        }
    }
    if (data.intents && data.intents[0]) {
        var intent = data.intents[0];
        // Depending on the confidence of the response the app can return different messages.
        // The confidence will vary depending on how well the system is trained. The service will always try to assign
        // a class/intent to the input. If the confidence is low, then it suggests the service is unsure of the
        // user's intent . In these cases it is usually best to return a disambiguation message
        // ('I did not understand your intent, please rephrase your question', etc..)
        if (intent.confidence >= 0.75) {
            responseText = "I understood you but I don't have an answer yet. Could you rephrase your question? ";
        } else {
            responseText = "I didn't get that. Sometimes only a human can help. Do you want to talk to one?";
        }
    }
    data.output.text = watson.Mine(responseText);
    context.Tasks(data, (updated_context) => {
        context.Push(id, updated_context);
    });

    return data;
}

module.exports = {

    Messenger: (body) => {
        messengerRequest(body);
    },

    Web: (req, res) => {
        webRequest(req.sessionID, req.body, res);
    },
};