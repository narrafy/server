require('dotenv').config({silent: true});



var Request = require('request');


function sendMessage(recipientId, message) {
    var messageData = {
        text: message
    };
    Request({
        url: process.env.FB_GRAPH_MSG_URL,
        qs: {access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN},
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

function subscribePageEvents(controller){
    // subscribe to page events
    Request.post('https://graph.facebook.com/me/subscribed_apps?access_token=' + process.env.PAGE_ACCESS_TOKEN,
        function (err, res, body) {
            if (err) {
                controller.log('Could not subscribe to page messages')
            }
            else {
                controller.log('Successfully subscribed to Facebook events:', body)
                console.log('Botkit can now receive messages')

                // start ticking to send conversation messages
                controller.startTicking()
            }
        })

    var url = 'https://graph.facebook.com/v2.8/me/thread_settings?access_token=' + process.env.PAGE_ACCESS_TOKEN

    // set up CTA for FB page
    var form1 = {
        'setting_type': 'call_to_actions',
        'thread_state': 'new_thread',
        'call_to_actions': [
            {
                'payload': 'optin'
            }
        ]
    }

    Request.post(url, {form: form1}, function (err, response, body) {
        if (err) {
            console.log(err)
        }
        else {
            console.log('CTA added', body)
        }
    })
}

function setUpPersistentMenu(controller){
    // set up persistent menu
    var form2 = {
        'setting_type': 'call_to_actions',
        'thread_state': 'existing_thread',
        'call_to_actions': [
            {
                'type': 'postback',
                'title': 'Item 1',
                'payload': 'Item 1'
            },
            {
                'type': 'postback',
                'title': 'Item 2',
                'payload': 'Item 2'
            }
        ]
    }

    Request.post(url, {form: form2}, function (err, response, body) {
        if (err) {
            console.log(err)
        }
        else {
            console.log('permanent menu added', body)
        }
    })
}

function setUpGreeting(controller){
    // set up greetings
    var form3 = {
        'setting_type': 'greeting',
        'greeting': {
            'text': 'Your greetings message'
        }
    }

    Request.post(url, {form: form3}, function (err, response, body) {
        if (err) {
            console.log(err)
        }
        else {
            console.log('greetings added', body)
        }
    })
}


module.exports = {
    SendMessage: (id, message) => {
        sendMessage(id, message);
    },

    SubscribePageEvents: (controller) => {
        subscribePageEvents(controller)
    },

    SetupPersistentMenu: (controller) => {
        setUpPersistentMenu(controller)
    },

    SetupGreeting: (controller) => {
        setUpGreeting(controller)
    }
};