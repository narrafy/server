
require('dotenv').config({silent: true});

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

    if (input) {
        payload.input = data.input;
    }
    if (context) {
        // The client must maintain context/state
        payload.context = data.context;
    }
    return payload;
}

function dronicRequest(sessionid, body, res, log) {

    var payload = getPayload(body.input, body.context);
    // Send the input to the conversation service
    conversation.message(payload, (err, data) => {
        if (err) {
            return res.status(err.code || 500).json(err);
        }
        return res.json(updateMessage(sessionid, data, log));
    });
}

function facebookRequest(facebook, err, result){
    if (err) {
        return console.log("Facebook Request Error: " + err);
    }
    var body = {};
    if(facebook.data)
        body.text = facebook.data.text;
    if (result[0] && result[0].response.context) {
        body.context = result[0].response.context;
    }
    var payload = getPayload({input: body.text,context: body.context});
    payload.context.facebook = true;

    // Send the input to the conversation service
    conversation.message(payload, (err, data) => {
        if (err && facebook) {
            facebook.message(facebook.data.id, err);
        }
        if (data && data.output) {
            if (data.output.text) {
                facebook.mongo(facebook.data.id, data, "facebook page");
                //watson have an answer
                if( data.output.text.length > 0 && data.output.text[1]){
                    if(facebook){
                        facebook.message(facebook.data.id, data.output.text[0] +' '+ data.output.text[1]);
                    } else {
                        facebook.message(facebook.data.id, data.output.text[0]);
                    }
                }else if(data.output.text[0])
                {
                    if(facebook){
                        facebook.message(facebook.data.id, data.output.text[0]);
                    }
                }
            }
        } else {
            if(facebook){
                facebook.message(facebook.data.id, 'I am busy. Probably training.' +
                    'Please write me later!');
            }
        }
    });
}

/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Conversation service
 * @param  {Object} response The response from the Conversation service
 * @return {Object}          The response with the updated message
 */
function updateMessage(sessionId, data, log) {
    var responseText = null;
    if (!data.output) {
        data.output = {};
    } else if(log) {
        log(sessionId, data, "dronic.io chat");
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
            responseText = 'I understood your intent was ' + intent.intent;
        } else if (intent.confidence >= 0.5) {
            responseText = 'Im not 100% sure, but I think your intent was ' + intent.intent;
        } else {
            responseText = 'I didn t get that. Perhaps I need more training. And sometimes only a human can help';
        }
    }
    data.output.text = responseText;
    if(log)
        log(sessionId,data, "dronic.io chat");
    return data;
}

module.exports = {

    DronicRequest: (req, res, log) =>
    {
        dronicRequest(req.sessionID,req.body, res, log);
    },

    FacebookRequest: (facebook, err, result) =>
    {
        facebookRequest(facebook, err, result);
    }
}


