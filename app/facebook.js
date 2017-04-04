require('dotenv').config({silent: true});

var em = require('./emoji');

const Request = require('request');


function sendMessage(id, message) {
    //first we stop showing typing icon
    typingOff(id);
    if(id && id !== process.env.DRONIC_CHATBOT_ID){
        Request({
            url: process.env.FB_GRAPH_MSG_URL,
            qs: {access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN},
            method: 'POST',
            json: {
                recipient: {id: id},
                message: message
            }
        }, function (error, response) {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error in sending message with user id: '+ id + 'while this message ' + message
                    + " was sent.");
                console.log("======================================");
                console.log(response.body.error);
            }
        });
    }
}

function sendQuickReplyMessage(id, message) {
    if(id && id !== process.env.DRONIC_CHATBOT_ID){
        var messageData = {
            text: em.ReplaceEmojiKey(message.text + ' emoji_hugging_face'),
            /*quick_replies:[
                {
                    "content_type" : "text",
                    "title" :  em.ReplaceEmojiKey("My heart was emoji_broken_heart"),
                    "payload" : "heart_event"
                },
                {
                    "content_type": "text",
                    "title": em.ReplaceEmojiKey("I'm curious emoji_curious"),
                    "payload": "test"
                }
            ]*/
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
                console.log('Error in sending message with user id: '+ id + 'while this message ' + message.text
                    + " was sent.");
                console.log("======================================");
                console.log(response.body.error);
            }
        });
    }

}

function startTyping(id){
    if(id && id !== process.env.DRONIC_CHATBOT_ID){
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
}

function typingOff(id){
    if(id && id !== process.env.DRONIC_CHATBOT_ID){
        Request({
            url: process.env.FB_GRAPH_MSG_URL,
            qs: {access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN},
            method: 'POST',
            json: {
                recipient: {id: id},
                sender_action: "typing_off"
            }
        }, function (error, response) {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }
}

function greet(text){
    Request({
        url: 'https://graph.facebook.com/v2.8/me/thread_settings',
        qs: {access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN },
        method: 'POST',
        json:{
            setting_type : "greeting",
            greeting: {
                text: text
            },
            thread_state : "existing_thread"
        }

    }, function(error, response, body) {
        console.log(response)
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function addPersistentMenu(){
    Request({
        url: 'https://graph.facebook.com/v2.8/me/thread_settings',
        qs: { access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN },
        method: 'POST',
        json:{
            setting_type : "call_to_actions",
            thread_state : "existing_thread",
            call_to_actions:[
                {
                    type:"postback",
                    title:"I want to train you ",
                    payload:"training_mode"
                },
                {
                    type:"web_url",
                    title:"my website 🌐",
                    url:"https://www.dronic.io"
                },
            ]
        }
    }, function(error, response, body) {
        console.log(response)
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

}

function removePersistentMenu(){
    Request({
        url: 'https://graph.facebook.com/v2.8/me/thread_settings',
        qs: {access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN },
        method: 'POST',
        json:{
            setting_type : "call_to_actions",
            thread_state : "existing_thread",
            call_to_actions:[ ]
        }

    }, function(error, response, body) {
        console.log(response)
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function investorConversationStarter(sender){
    sendMessage(sender, {text:"Great! I need training to become smarter! :)"});
}

module.exports = {

    VerifyToken: (req,res, token) => {
        if (req.query['hub.verify_token'] === token) {
            res.send(req.query['hub.challenge']);
        } else {
            res.send('Invalid verify token!');
        }
    },

    SendMessage: (id, message) => {
        sendMessage(id, message);
    },
    SendQuickReplyMessage: (id, msg) =>
    {
        sendQuickReplyMessage(id, msg)
    },

    StartTyping: (id) => {
      startTyping(id)
    },

    ProcessRequest: (req, cb) => {
        processRequest(req.body, cb);
    },

    RemovePersistentMenu: removePersistentMenu(),

    AddPeristentMenu: addPersistentMenu(),

    Greet: (text) => greet(text)
};