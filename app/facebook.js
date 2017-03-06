require('dotenv').config({silent: true});

const Request = require('request');

function sendMessage(id, message) {
    if(id && id!=='378327679207724'){
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
                console.log('Error in sendind message with user id: '+ id + 'while this message ' + message
                    + " was sent.");
                console.log("======================================");
                console.log(response.body.error);
            }
        });
    }
}

function StartTyping(id){
    if(id && id!=='378327679207724'){
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

function StopTyping(id){
    if(id && id!=='378327679207724'){
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

function Greet(){
    Request({
        url: 'https://graph.facebook.com/v2.8/me/thread_settings',
        qs: {access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN },
        method: 'POST',
        json:{
            setting_type : "greeting",
            greeting:{
                text: "hi! I'm Dronic, your narrative assistant! How are you?"
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
                    title:"i'm an investor",
                    payload:"investor"
                },
                {
                    type:"web_url",
                    title:"our website",
                    url:"https://www.dronic.io"
                },
                {
                    type:"web_url",
                    title:"our blog",
                    url:"https://tech.dronic.io"
                }
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

module.exports = {

    VerifyToken: (req,res) => {
        if (req.query['hub.verify_token'] === process.env.FACEBOOK_PAGE_VERIFY_TOKEN) {
            res.send(req.query['hub.challenge']);
        } else {
            res.send('Invalid verify token!');
        }
    },

    SendMessage: (id, message) => {
        sendMessage(id, message);
    },

    StartTyping: (id) => {
        StartTyping(id);
    },
    StopTyping: (id) => {
        StopTyping(id)
    },
    RemovePersistentMenu: removePersistentMenu(),
    AddPeristentMenu: addPersistentMenu(),
    Greet: Greet()
};