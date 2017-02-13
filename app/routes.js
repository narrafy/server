// app/routes.js

require('dotenv').config({silent: true});
var r = require('request');
var Watson = require('watson-developer-cloud/conversation/v1');


module.exports = function (app) {

    var logs = null;

    app.get('/', function (req, res) {
        res.render('index.ejs');
    });
    app.get('/chat', function (req, res) {
        res.render('chat.ejs');
    })

    //free ssl encryption
    app.get('/.well-known/acme-challenge/:content', function (req, res) {
        res.send('oQBLMccwx4brlIoFUDwSGCl0N3hg5nr19JdMT1SFjI4.DqH5Yu5qS7LsaYrDHVTo6hbZgjtbea5MxucBs24Mxno');
    });

    app.post('/subscribe', function (req, res) {
        var results = [];

        //grab data from http request
        var data = {email: req.body.email};
        var connectionString = 'postgres://ifmdaskjdzmyci:aR5F-iCwhIlH4FVXf1XBQkJTdW@ec2-54-228-219-2.eu-west-1.compute.amazonaws.com:5432/d5md0il57415vo';
        var pq = require('pg');
        pg.defaults.ssl = true;
        pg.connect(connectionString,
            function (err, client, done) {
                if (err) {
                    done();
                    console.log(err);
                    return res.status(500).json({success: false, data: err});
                }
                var insertQuery = client.query("INSERT INTO dronic_users(email) values($1)", [data.email]);
                insertQuery.on('end', function () {
                    done();
                    return res.redirect('/');
                });
            });
    });

    app.get('/webhook', function (req, res) {

        if (req.query['hub.verify_token'] === 'testbot_verify_token') {
            res.send(req.query['hub.challenge']);
        } else {
            res.send('Invalid verify token!');
        }
    });

    app.post('/webhook', function (req, res) {
        var events = req.body.entry[0].messaging;
        for (i = 0; i < events.length; i++) {
            var event = events[i];
            if (event.message && event.message.text) {
                if (event.message && event.message.text) {
                   // sendMessage(event.sender.id, {text: event.message.text});
                    r("https://www.dronic.io/api/message",
                        function (request, response) {
                            sendMessage(event.sender.id, "echo: "+ request);
                    });
                }
            }
        }
        res.sendStatus(200);
    });

    app.post('/api/message', function (req, res) {
        askWatson(req, res);
    });

    // Endpoint to be call from the client side
    function askWatson(req, res) {
        var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
        if (!workspace || workspace === '<workspace-id>') {
            return res.json({
                'output': {
                    'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' +
                    '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' +
                    'Once a workspace has been defined the intents may be imported from ' +
                    '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
                }
            });
        }
        var payload = {
            workspace_id: workspace,
            context: {},
            input: {}
        };
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
        conversation.message(payload, function (err, data) {
            if (err) {
                return res.status(err.code || 500).json(err);
            }
            return res.json(updateMessage(payload, data));
        });
    };

    /**
     * Updates the response text using the intent confidence
     * @param  {Object} input The request to the Conversation service
     * @param  {Object} response The response from the Conversation service
     * @return {Object}          The response with the updated message
     */
    function updateMessage(input, response) {
        var responseText = null;
        var id = null;
        if (!response.output) {
            response.output = {};
        } else {
            if (logs) {
                // If the logs db is set, then we want to record all input and responses
                id = uuid.v4();
                logs.insert({'_id': id, 'request': input, 'response': response, 'time': new Date()});
            }
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
                responseText = 'I think your intent was ' + intent.intent;
            } else {
                responseText = 'I did not understand your intent';
            }
        }
        response.output.text = responseText;
        if (logs) {
            // If the logs db is set, then we want to record all input and responses
            id = uuid.v4();
            logs.insert({'_id': id, 'request': input, 'response': response, 'time': new Date()});
        }
        return response;
    }

    function sendMessage(recipientId, message) {
        var messageData = {
          text: message
        };
        r({
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

    // Create the service wrapper
    var conversation = new Watson({
        // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
        // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
        username: process.env.CONVERSATION_USERNAME,
        password: process.env.CONVERSATION_PASSWORD,
        url: 'https://gateway.watsonplatform.net/conversation/api',
        version_date: '2016-09-20',
        version: 'v1'
    });
}
