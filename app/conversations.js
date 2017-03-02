
var Watson = require('./watson');
var Mongo = require('./mongo');

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

    if (data.input) {
        payload.input = data.input;
    }
    if (data.context) {
        // The client must maintain context/state
        payload.context = data.context;
    }
    return payload;
}

module.exports = function (controller) {
    // this is triggered when a user clicks the send-to-messenger plugin
    controller.on('facebook_optin', function (bot, message) {
        bot.reply(message, 'Welcome, friend')
    })

    // user said hello
    controller.hears(['hello'], 'message_received', function (bot, message) {
        console.log(message);
        bot.reply(message, 'Hey there.')
    })

    // user says anything else
    controller.hears('(.*)', 'message_received', function (bot, message) {
        Mongo.Connect((err, db) => {
            if (err) return console.log(err);
            db.collection('conversations').find({"id": message.user}).sort({"date": -1}).limit(1)
                .toArray((err, result) => {
                    if (err) {
                        return console.log("Facebook Request Error: " + err);
                    }
                    var body = {};
                    if(message.text)
                        body.input = message.text;
                    if (result[0] && result[0].response.context) {
                        body.context = result[0].response.context;
                    }
                    var payload = getPayload({input: body.input, context: body.context});
                    payload.context.facebook = true;

                    // Send the input to the conversation service
                    Watson.Message(payload, (err, data) => {
                        if (err) {
                            bot.reply(message, err);
                        }
                        console.log(data);
                        if (data && data.output) {
                            if (data.output.text) {
                                Mongo.PushConversation(message.user, data, "facebook page");
                                //watson have an answer
                                if( data.output.text.length > 0 && data.output.text[1]){
                                    bot.reply(message, data.output.text[0] +' '+ data.output.text[1]);
                                } else if(data.output.text[0]) {
                                    bot.reply(message, data.output.text[0]);
                                }
                            }
                        } else {
                            bot.reply(message, 'I am busy. Probably training. ' +
                                    'Please write me later!');
                        }
                    });
                });
        });
    })
}