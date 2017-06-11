require('dotenv').config({silent: true});

const Request = require('request');

function sendMessage(id, message, pageToken) {
    //first we stop showing typing icon
    typingOff(id, pageToken);
    if(id && id !== process.env.DRONIC_CHATBOT_ID){
        Request({
            url: process.env.FB_GRAPH_MSG_URL,
            qs: {access_token: pageToken},
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

function startTyping(id, pageToken){
    if(id && id !== process.env.DRONIC_CHATBOT_ID){
        Request({
            url: process.env.FB_GRAPH_MSG_URL,
            qs: {access_token: pageToken},
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

function typingOff(id, pageToken){
    if(id && id !== process.env.DRONIC_CHATBOT_ID){
        Request({
            url: process.env.FB_GRAPH_MSG_URL,
            qs: {access_token: pageToken},
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

function greet(text, pageToken){

    Request({
        url: 'https://graph.facebook.com/v2.8/me/thread_settings',
        qs: {access_token: pageToken },
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

function addPersistentMenu(pageToken){
    Request({
        url: 'https://graph.facebook.com/v2.8/me/thread_settings',
        qs: { access_token: pageToken },
        method: 'POST',
        json:{
            setting_type : "call_to_actions",
            thread_state : "existing_thread",
            call_to_actions:[
                {
                    "title":"Start Over",
                    "type": "postback",
                    "payload":"CLEAR_CONTEXT"
                },
                {
                    type:"web_url",
                    title:"my website 🌐",
                    url:"https://www.narrafy.co"
                },
                {
                    type:"web_url",
                    title:"my blog 📖",
                    url:"https://blog.narrafy.co"
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

function removePersistentMenu(pageToken){
    Request({
        url: 'https://graph.facebook.com/v2.8/me/thread_settings',
        qs: {access_token: pageToken },
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

module.exports = {

    VerifyToken: (req,res, token) => {
        if (req.query['hub.verify_token'] === token) {
            res.send(req.query['hub.challenge']);
        } else {
            res.send('Invalid verify token!');
        }
    },

    SendMessage: (id, message, pageToken) => {
        sendMessage(id, message, pageToken);
    },

    StartTyping: (id, pageToken) => {
      startTyping(id, pageToken)
    },

    RemovePersistentMenu: (pageToken) =>  removePersistentMenu(pageToken),

    AddPersistentMenu: (pageToken) => addPersistentMenu(pageToken),

    Greet: (text, pageToken) => greet(text, pageToken)
};