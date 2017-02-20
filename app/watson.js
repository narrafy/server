
require('dotenv').config({silent: true});

const watson = require('watson-developer-cloud/conversation/v1');
const fbRequest = require('request');
const MongoClient = require('mongodb').MongoClient;
const SendGrid = require('sendgrid')(process.env.SENDGRID_API_KEY);
const MailHelper = require('sendgrid').mail;

// Create the service wrapper
const conversation = new watson({
    // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
    // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
    username: process.env.CONVERSATION_USERNAME,
    password: process.env.CONVERSATION_PASSWORD,
    url: 'https://gateway.watsonplatform.net/conversation/api',
    version_date: '2016-09-20',
    version: 'v1'
});

const getWatsonPayload = (workspace) => {
    var payload = {
        workspace_id: workspace,
        context: {},
        input: {}
    };
    return payload;
};

function askWatson(req, res) {
    var sessionId = req.sessionID;
    var workspace = process.env.WORKSPACE_ID;
    if (!workspace) {
        return res.json(notConfigureAppResponse());
    }
    var payload = getWatsonPayload(workspace);
    if (req.body) {
        if (req.body.input) {
            payload.input = req.body.input;
        }
        if (req.body.context) {
            // The client must maintain context/state
            payload.context = req.body.context;
        }
    }
    // Send the input to the conversation service
    conversation.message(payload, (err, data) => {
        if (err) {
            return res.status(err.code || 500).json(err);
        }
        return res.json(updateMessage(sessionId, data));
    });
}

// Endpoint to be call from the client side
function askWatsonFb(recipientId, message) {
    var workspace = process.env.WORKSPACE_ID;
    if (!workspace) {
        return res.json(notConfigureAppResponse());
    }
    var payload = getWatsonPayload(workspace);
    if (message) {
        payload.input = {
            text: message
        };
    }
    MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
        if (err) return console.log(err);
        var loggedPayload = null;
        console.log(recipientId);
        database.collection('conversations').find({"id": recipientId}).sort({"date": -1}).limit(1)
            .toArray((err, result) => {
                if (err) {
                    console.log(err);
                }else if(result&& result.length>0){
                    loggedPayload = result[0];
                }
                if (loggedPayload && loggedPayload.response.context) {
                    payload.context = loggedPayload.response.context;
                    console.log(payload.context);
                } else {
                    payload.context = {};
                }
                // Send the input to the conversation service
                conversation.message(payload, (err, data) => {
                    if (err) {
                        sendMessage(recipientId, err);
                    }
                    if (data && data.output) {
                        if (data.output.text) {
                            logConversation(recipientId, data);
                            //watson have an answer
                            if(data.output.text[0]){
                                sendMessage(recipientId, data.output.text[0]);
                            }else if(data.output.text.length>=1)
                            {
                                sendMessage(recipientId, data.output.text[1]);
                            }
                        }
                    } else {
                        sendMessage(recipientId, 'Dronic probably is busy training. or drinking ' +
                            'or something. Joking. Seriously, please write me later!');
                    }
                });
            });
    });
}

function notConfigureAppResponse() {
    return {
        'output': {
            'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' +
            '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' +
            'Once a workspace has been defined the intents may be imported from ' +
            '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
        }
    };
}

/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Conversation service
 * @param  {Object} response The response from the Conversation service
 * @return {Object}          The response with the updated message
 */
function updateMessage(sessionId, response) {
    var responseText = null;
    if (!response.output) {
        response.output = {};
    } else if(MongoClient) {
        logConversation(sessionId, response);
        return response;
    }
    if (response.intents && response.intents[0]) {
        var intent = response.intents[0];
        // Depending on the confidence of the response the app can return different messages.
        // The confidence will vary depending on how well the system is trained. The service will always try to assign
        // a class/intent to the input. If the confidence is low, then it suggests the service is unsure of the
        // user's intent . In these cases it is usually best to return a disambiguation message
        // ('I did not understand your intent, please rephrase your question', etc..)
        if (intent.confidence >= 0.75) {
            responseText = 'I understood your intent was ' + intent.intent;
        } else if (intent.confidence >= 0.5) {
            responseText = 'Im not 100% sure, but I think your intent was ' + intent.intent;
        } else {
            responseText = 'I didn t get that. Perhaps I need more training. And sometimes only a human can help';
        }
    }
    response.output.text = responseText;
    if (MongoClient) {
        logConversation(sessionId,response);
    }
    return response;
}

function sendMessage(recipientId, message) {
    var messageData = {
        text: message
    };
    fbRequest({
        url: 'https://graph.facebook.com/v2.8/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: messageData
        }
    }, function (error, response) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

var logConversation = (sessionId, response) => {
    var toStore = {
        id: sessionId,
        response: response,
        date: new Date()
    };
    MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
        database.collection('conversations').save(toStore, (err) => {
            if (err)
                return console.log(err);
            console.log('saved to database');
        });
    });
};

function subscribe(email, message){
    var data = {email: email, message:message};
    MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
       database.collection('users').save(data, (err)=>{
           if(err)
               return console.log(err);
           notifyAdmin(email, message);
       })
    });
}

function notifyAdmin(email, message) {
    var fromEmail = new MailHelper.Email('noreply@dronic.io');
    var toEmail = new MailHelper.Email('contact@dronic.io');
    var subject = 'A new user subscribed';
    var content = new MailHelper.Content('text/plain', 'User: ' + email + '. Said: '+ message);
    var mail = new MailHelper.Mail(fromEmail, subject, toEmail, content);
    var request = SendGrid.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });
    SendGrid.API(request,(error, response) => {
        if(error)
            return console.log(error);
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });
}

function readPayload(req, res) {
    MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
        if (err) return console.log(err);
         database.collection('conversations')
             .find({id: req.headers.host})
             .toArray((err, result) => {
             if (err){
                 return console.log(err);
             }
             res.render('archive.ejs', {payloads: result});
         });
    });
}

module.exports = (app) => {
    app.post('/api/message', function (req, res) {
        askWatson(req, res);
    });

    app.post('/api/subscribe',  (req, res) => {
        var email =  req.body.email;
        var message = req.body.message;
        subscribe(email, message);
        res.sendStatus(200);
    });

    app.get('/webhook', function (req, res) {

        if (req.query['hub.verify_token'] === 'testbot_verify_token') {
            res.send(req.query['hub.challenge']);
        } else {
            res.send('Invalid verify token!');
        }
    });

    app.post('/webhook', (req, res) => {
        var events = req.body.entry[0].messaging;
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            var sender = event.sender.id;
            if (event.message && event.message.text) {
                askWatsonFb(sender, event.message.text);
            }
        }
        res.sendStatus(200);
    });

    app.get('/archive', (req, res) => {
        readPayload(req,res);
    });
}


