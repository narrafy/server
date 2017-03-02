require('dotenv').config({silent: true});

var Request = require('request');
var Mongo = require('./mongo');
var Watson = require('./watson');

function sendMessage(id, message) {
    var messageData = {
        text: message
    };
    Request({
        url: process.env.FB_GRAPH_MSG_URL,
        qs: {access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: id},
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

function StartTyping(id){
    Request({
        url: process.env.FB_GRAPH_MSG_URL,
        qs: {access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: id},
            sender_action: "typing_on"
        }
    }, function (error, response) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

function StopTyping(id){
    Request({
        url: process.env.FB_GRAPH_MSG_URL,
        qs: {access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: id},
            sender_action: "typing_on"
        }
    }, function (error, response) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}



module.exports = {

    VerifyToken: (req,res) => {
        if (req.query['hub.verify_token'] === process.env.FACEBOOK_PAGE_VERIFY_TOKEN) {
            res.send(req.query['hub.challenge']);
        } else {
            res.send('Invalid verify token!');
        }
    },

    WatsonReply: (body) => {
        var events = body.entry[0].messaging;
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            var sender = event.sender.id;
            if (event.message && event.message.text) {
                var facebook = {
                    data: {
                        id: sender,
                        text: event.message.text
                    },
                    message: sendMessage,
                    mongo: Mongo.PushConversation,
                    start_typing: StartTyping(sender),
                    stop_typing: StopTyping(sender)
                };
                Mongo.PopConversation(facebook, Watson.FacebookRequest);
            }
            else if(event.optin ||
                (event.postback &&
                event.postback.payload === 'optin')){
                sendMessage(sender, 'Nice, nice. Dronic is happy you are' +
                    'visiting him! Mrrrr....');
            }
        }
    }
};