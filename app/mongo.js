require('dotenv').config({silent: true});

var MongoDb = require('mongodb').MongoClient;
var Sendgrid = require('./sendgrid');
const watson = require('watson-developer-cloud/conversation/v1');
var Facebook = require('./facebook');

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

function Connect(callback){
    MongoDb.connect(process.env.MONGODB_URI, callback);
}

function popContext(input){
    Connect((err, database) =>
    {
        if (err) return console.log(err);
        database.collection('conversations').find({"id": input.id}).sort({"date": -1}).limit(1)
            .toArray((err, result) => {
                if (err) {
                    return console.log("Error popConversation function: " + err);
                }
                var body = {};
                if(input)
                    body.text = input.text;
                if (result[0] && result[0].response.context) {
                    body.context = result[0].response.context;
                }
                var payload = getPayload({text: body.text, context: body.context});

                // Send the input to the conversation service
                conversation.message(payload, (err, data) => {
                    if (err) {
                        console.log("Error in conversation.message function: " + err);
                        Facebook.SendMessage(input.id, err);
                    }
                    if (data && data.output) {
                        if (data.output.text && data.output.text) {
                            //watson have an answer
                            if( data.output.text.length > 0 && data.output.text[1]){
                                pushContext(input.id, data, "facebook page");
                                console.log("Watson replies with: " + data.output.text);
                                Facebook.SendMessage(input.id, data.output.text[0] + ' ' + data.output.text[1]);
                            } else if(data.output.text[0]) {
                                console.log("Watson replies with: " + data.output.text);
                                pushContext(input.id, data, "facebook page");
                                Facebook.SendMessage(input.id, data.output.text[0]);
                            }
                        }
                    } else {
                        Facebook.SendMessage(input.id, 'I am busy. Probably training.' +
                            'Please write me later!');
                    }
                });
            });
    });
}

function pushContext(sessionId, response, source){
    var toStore = {
        id: sessionId,
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
    if(response.entities && response.entities[0] && response.entities[0].entity ==="email"){
        var data = {
            email: response.input.text,
            message: 'an user from Dronic',
            source: source,
            date: new Date()
        };
        var callback = (data ,err) => {
            if(err)
                return console.log(err);
            Sendgrid.NotifyAdmin(data);
            Sendgrid.NotifyUser(data.email);
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

function getUser(userid) {
    Connect((err, db) =>{
        if (err) return null;
        db.collection('users').findOne({"id": userid});
    });
}

function saveUser(data) {
    if(getUser(data.id)) return console.log(data.id + ' user already in db');
    Connect((err, db) => {
       if(err) return console.log(err);
        db.collection('users').save(data, (err) => {
            if (err)
                return console.log(err);
        });
    });
}

module.exports = {

    AddEmail: (data) => {
        var callback = (data ,err) => {
            if(err)
                return console.log(err);
            Sendgrid.NotifyAdmin(data);
            Sendgrid.NotifyUser(data.email);
        };
        saveEmail(data, callback);
    },

    PushContext: (sessionId, response, source) => {
        pushContext(sessionId, response, source);
    },

    PopContext: (data) => {
        popContext(data);
    },
}
