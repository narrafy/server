require('dotenv').config({silent: true});

var md = require('mongodb').MongoClient;
var sg = require('./sendgrid');
var fb = require('./facebook');
const watson = require('watson-developer-cloud/conversation/v1');

// Create the service wrapper
const conversation = new watson({
    // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
    // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
    username: process.env.CONVERSATION_USERNAME,
    password: process.env.CONVERSATION_PASSWORD,
    url: process.env.CONVERSATION_URL,
    version_date: '2016-09-20',
    version: 'v1'
});

function Connect(callback){
    md.connect(process.env.MONGODB_URI, callback);
}

function popContext(input){
    if(input && input.text){
        Connect((err, database) =>
        {
            if (err) return console.log(err);
            database.collection('conversations').find({"id": input.id}).sort({"date": -1}).limit(1)
                .toArray((err, result) => {
                    if (err) {
                        return console.log("Error popConversation function: " + err);
                    }
                   //send a reply to facebook page
                    var fbCallback = (err, data) => {
                        if (err) {
                            console.log("Error in conversation.message function: " + err);
                            fb.SendMessage(body.id, err);
                        }
                        if (data && data.output) {
                            if (data.output.text && data.output.text) {
                                fb.StopTyping(input.id);
                                //watson have an answer
                                var text = '';
                                if( data.output.text.length > 0 && data.output.text[1]){
                                    text = data.output.text[0] + ' ' + data.output.text[1];
                                } else if(data.output.text[0]) {
                                    text = data.output.text[0];
                                }
                                 if(text) {
                                     //send a notification if a human is needed to take over
                                     if(data.context && data.context.human_request){
                                         fb.SendMessage(process.env.ADMIN_FB_ID, "You are needed to help with Dronic");
                                     } else {
                                         fb.SendMessage(input.id, text);
                                     }
                                     console.log("Watson replies with: " + text + " " + input.id);
                                     pushContext(input.id, data, "facebook page");
                                }
                            }
                        } else {
                            fb.SendMessage(input.id, 'I am probably training again.' +
                                'Please write me later!');
                        }
                    };

                    var body = {
                        text: input.text,
                        id: input.id
                    };

                    if (result[0] && result[0].response.context) {
                        body.context = result[0].response.context;
                    };

                    // Send the input to the conversation service
                    SendMessage(body, fbCallback);
                });
        });
    }

}

function pushContext(id, response, source){
    var toStore = {
        id: id,
        response: response,
        source: source,
        date: new Date()
    };
    Connect((err, database) => {
        database.collection('conversations').save(toStore, (err) => {
            if (err)
                return console.log(err);
        });
    });
    if(response.entities &&
        response.entities[0] &&
        response.entities[0].entity === "email"){
        var data = {
            email: response.input.text,
            message: 'an user from Dronic',
            source: source,
            date: new Date()
        };
        var callback = (data ,err) => {
            if(err)
                return console.log(err);
            sg.NotifyAdmin(data);
            sg.NotifyUser(data.email);
        };
        saveEmail(data, callback);
    }
}

function saveEmail(data, callback) {
    Connect((err, database) => {
        database.collection('emails').save(data, (err)=>{
            if(callback)
                callback(data, err);
        })
    });
}

function getPayload(data){
    var workspace = process.env.WORKSPACE_ID;
    if (!workspace) {
        return {
            'output': {
                'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' +
                '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' +
                'Once a workspace has been defined the intents may be imported from ' +
                '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
            }
        };
    }
    var payload = {
        workspace_id: workspace,
        context: {},
        input: {}
    };

    if (data.text) {
        payload.input.text = data.text;
    }
    if (data.context) {
        // The client must maintain context/state
        payload.context = data.context;
    }
    return payload;
}

function SendMessage(data, cb){
    var payload = getPayload(data);
    conversation.message(payload, cb);
}
function SendConversationStarter(sender){

    var cb = (err, data) => {
        if (err) {
            console.log("Error in conversation.message function: " + err);
        }
        if (data && data.output) {
            if (data.output.text && data.output.text) {
                fb.StopTyping(sender);
                //watson have an answer
                var text = '';
                if( data.output.text.length > 0 && data.output.text[1]){
                    text = data.output.text[0] + ' ' + data.output.text[1];
                } else if(data.output.text[0]) {
                    text = data.output.text[0];
                }
                if(text) {
                    fb.SendMessage(sender, text);
                    console.log("Watson replies with: " + text + " " + sender);
                    pushContext(sender, data, "facebook page");
                }
            }
        } else {
            fb.SendMessage(sender, 'I am busy. Probably training.' +
                'Please write me later!');
        }
    }
    SendMessage({text:"", context:""}, cb);
}

function webRequest(id, body, res) {
    var data = {};
    if(body){
        if(body.input){
            data.text = body.input.text;
        }
        if(body.context){
            data.context = body.context;
        }
    }
    // Send the input to the conversation service
    SendMessage(data, (err, data) => {
        if (err) {
            return res.status(err.code || 500).json(err);
        }
        return res.json(updateMessage(id, data));
    });
}

function facebookRequest(body) {
    var events = body.entry[0].messaging;
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var sender = event.sender.id;
        //we don't reply to our own process
        if (event.message && event.message.text &&
            event.sender.id!== process.env.DRONIC_CHATBOT_ID) {
            console.log("user: " + event.sender.id + " says  " + event.message.text);
            fb.StartTyping(sender);
            var data = {
                id: sender,
                text: event.message.text
            };
            popContext(data);
        }
        //user interacts with the page for the first time
        else if(event.optin ||
            (event.postback &&
            event.postback.payload === 'optin')){
            fb.StartTyping(sender);
            SendConversationStarter(sender);
        }
    }
}

function updateMessage(id, data) {
    var responseText = null;
    if (!data.output) {
        data.output = {};
    } else {
        pushContext(id, data, "dronic.io chat");
        if(data.output.text && data.output.text[0])
            return data;
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
            responseText = 'I didn t get that. Sometimes only a human can help. Wanna see one ?';
        }
    }
    data.output.text = responseText;
    pushContext(id, data, "dronic.io chat");
    return data;
}

module.exports = {

    AddEmail: (data) => {
        var callback = (data, err) => {
            if (err)
                return console.log(err);
            sg.NotifyAdmin(data);
            sg.NotifyUser(data.email);
        };
        saveEmail(data, callback);
    },

    WebRequest: (req, res) =>{
        webRequest(req.sessionID, req.body, res);
    },

    FacebookRequest: (req, res) => {
      facebookRequest(req.body);
    }
}
