require('dotenv').config({silent: true});

const Request = require('request');
const page_token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const chatbot_id = process.env.CHATBOT_ID;
const fb_graph_url = process.env.FB_GRAPH_MSG_URL;

function sendMessage(id, message) {
    //first we stop showing typing icon
    typingOff(id, page_token);
    if(id && id !== chatbot_id){
        Request({
            url: fb_graph_url ,
            qs: { access_token: page_token },
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

function startTyping(id){
    if(id && id !== chatbot_id){
        Request({
            url: fb_graph_url,
            qs: {access_token: page_token},
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
    if(id && id !== chatbot_id){
        Request({
            url: fb_graph_url,
            qs: {access_token: page_token},
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
        qs: {access_token: page_token },
        method: 'POST',
        json:{
            setting_type : "greeting",
            greeting: {
                text: text
            },
            thread_state : "existing_thread"
        }

    }, function(error, response) {
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
        qs: { access_token: page_token },
        method: 'POST',
        json:{
            setting_type : "call_to_actions",
            thread_state : "existing_thread",
            call_to_actions:[
                {
                    type:"web_url",
                    title:"some thoughts  📖",
                    url:"https://blog.isegoria.com"
                },
                {
                    "title":"Let's try again",
                    "type": "postback",
                    "payload":"CLEAR_CONTEXT"
                },
                {
                    "title":"I want to talk to a person",
                    "type": "postback",
                    "payload": "CONTACT_REQUEST"
                }
            ]
        }
    }, function(error, response) {
        console.log(response)
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

}
/* it will remove the persistent menu that appears on facebook */
function removePersistentMenu(){
    Request({
        url: 'https://graph.facebook.com/v2.8/me/thread_settings',
        qs: {access_token: page_token },
        method: 'POST',
        json:{
            setting_type : "call_to_actions",
            thread_state : "existing_thread",
            call_to_actions:[ ]
        }

    }, function(error, response) {
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

    SendMessage: (id, message) => {
        startTyping(id);
        sendMessage(id, message);
    },

    StartTyping: (id) => {
      startTyping(id)
    },

    RemovePersistentMenu: () =>  removePersistentMenu(),

    AddPersistentMenu: () => addPersistentMenu(),

    Greet: (text) => greet(text)
};