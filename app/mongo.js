"use strict";
require('dotenv').config({silent: true});

var md = require('mongodb').MongoClient;
var sg = require('./sendgrid');
var em = require('./emoji');
var fb = require('./facebook');
const watson = require('watson-developer-cloud/conversation/v1');

// Create the service wrapper
const conversation = new watson({
    // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checkedx
    // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
    username: process.env.CONVERSATION_USERNAME,
    password: process.env.CONVERSATION_PASSWORD,
    url: process.env.CONVERSATION_URL,
    version_date: '2017-02-03',
    version: 'v1'
});

function Connect(callback) {
    md.connect(process.env.MONGODB_URI, callback);
}

function processMessage(input, settings) {
    var logTable = "conversations";
    var watsonWorkspace = settings.WatsonWorkspace;
    var pageToken = settings.FbPageToken;
    if (input.sender === process.env.DRONIC_CHATBOT_ID) {
        //if it's an echo from the facebook page
        // we catch the message when a counsellor takes over
        console.log("page echo: " + input.sender + " says  " + input.text);
    } else {
        //it's a text from a user
        console.log("user: " + input.sender + " says  " + input.text);
        Connect((err, database) => {
            if (err) return console.log(err);
            database.collection(logTable).find({"id": input.sender}).sort({"date": -1}).limit(1)
                .toArray((err, result) => {
                    if (err) {
                        return console.log("Error processMessage function: " + err);
                    }
                    var request = {
                        id: input.sender,
                        text: input.text
                    };
                    if (result[0] && result[0].context) {
                        request.context =  result[0].context;
                    }
                    //send a reply to facebook page
                    var fbCallback = (err, data) => {
                        if (err) {
                            console.log("error in the facebook callback function " + err);
                            fb.SendMessage(request.id, {text: err}, pageToken);
                        }
                        if (data && data.output) {
                            //watson have an answer
                            var currentContext = data.context;
                            var message = {};
                            message.text = mineWatsonResponse(data.output.text);
                            if (currentContext && currentContext.quick_replies) {
                                message.quick_replies = currentContext.quick_replies;
                            }
                            fb.SendMessage(request.id, message, pageToken);
                            console.log("Watson replies with: " + message.text + " " + request.id);
                            pushContext(request.id, data, logTable);
                        } else {
                            fb.SendMessage(request.id, {
                                text: 'I am probably training again.' +
                                'Please write me later!'
                            }, pageToken);
                        }
                    };
                    // Send the input to the conversation service
                    askWatson(request, watsonWorkspace, fbCallback);
                });
        });
    }
}

function pushContext(id, conversation, logTable) {
    var dbConversation = {
        id: id,
        conversation_id: conversation.context.conversation_id,
        intents: conversation.intents,
        entities: conversation.entities,
        input: conversation.input,
        output: conversation.output,
        context: conversation.context,
        date: new Date()
    };
    Connect((err, db) => {
        db.collection(logTable).save(dbConversation, (err) => {
            if (err)
                return console.log(err);
        });
    });
    if (conversation.entities &&
        conversation.entities[0] &&
        conversation.entities[0].entity === "email") {
        var email = conversation.input.text;
        var conversation_id = dbConversation.conversation_id;
        getTranscript(email, conversation_id);
    }
}

function clearContext(id){
    Connect((err, db) => {
        db.collection('conversations').remove({"id":id}, (err) => {
            if (err)
                return console.log(err);
        });
    });
}

function saveEmail(data, callback) {
    Connect((err, database) => {
        database.collection('emails').save(data, (err) => {
            if (callback)
                callback(data, err);
        })
    });
}
 function getTranscript(email, conversation_id) {

    Connect((err, database) => {
        database.collection('conversations').find({"conversation_id": conversation_id}).sort({$natural:1}).toArray((err, result) => {
            var transcript = new Array();
            for(let j = 0; j < result.length; j++){
                var conversation = result[j];
                if(conversation.input && conversation.input.text){
                    transcript.push(conversation.input.text);
                }
                if(conversation.output && conversation.output.text){
                    transcript.push(conversation.output.text);
                }
            }
            if(transcript.length>0){
                sg.SendTranscript(email, transcript);
                var data = {
                    email: email,
                    transcript: transcript,
                    date: new Date()
                };
                saveTranscript(data);
            }
        });
    });
 }

function saveTranscript(data){
    Connect((err, database) => {
        database.collection('transcripts').save(data, (err) => {
            if(err)
                console.log(err);
        });
    });
}

function saveSubscriber(data, cb){
    Connect((err, database)=>{
        database.collection('subscribers').save(data, (err)=>{
            if(err)
                return;
            if(cb)
                cb(data, err);
        })
    });
}

function getPayload(data, workspace) {
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

    if (data && data.text) {
        payload.input.text = data.text;
    }
    if (data && data.context) {
        // The client must maintain context/state
        payload.context = data.context;
    }
    return payload;
}

function askWatson(data, workspace, cb) {
    var payload = getPayload(data, workspace);
    conversation.message(payload, cb);
}

function webRequest(id, body, res, logTable) {
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
        return res.json(updateMessage(id, data, logTable));
    };
    // Send the input to the conversation service
    askWatson(data, process.env.WORKSPACE_ID, cb);
}

function updateMessage(id, data, logTable) {
    var responseText = null;
    if (!data.output) {
        data.output = {};
    } else {
        pushContext(id, data, logTable);
        if (data.output.text && data.output.text[0]){
            data.output.text = mineWatsonResponse(data.output.text);
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
    data.output.text = mineWatsonResponse(responseText);
    pushContext(id, data, logTable);
    return data;
}

function mineWatsonResponse(data) {
    var text = '';
    if (data.length > 0 && data[1]) {
        text = data[0] + ' ' + data[1];
    } else if (data[0]) {
        text = data[0];
    }
    return em.ReplaceEmojiKey(text);
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

    AddSubscriber: (data) =>
    {
        var cb = (data, err)=>{
            if(err)
                return console.log(err);
            data.message = "Congrats, another user just subscribed!"
            sg.NotifyAdmin(data);
            sg.NotifySubscriber(data.email);
        }
      saveSubscriber(data,cb);
    },

    WebRequest: (req, res) => {
        webRequest(req.sessionID, req.body, res, 'conversations');
    },

    GetTranscript: (email, conversation_id) => {
        getTranscript(email, conversation_id);
    },

    ProcessMessage: (input, settings) => {
        //show typing icon to the user
        fb.StartTyping(input.sender, settings.FbPageToken);
        processMessage(input, settings);
    },
    ClearContext: (id) => {
        clearContext(id)
    }
}
