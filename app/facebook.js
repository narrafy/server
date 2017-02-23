require('dotenv').config({silent: true});

var FacebookRequest = require('request');

function sendMessage(recipientId, message) {
    var messageData = {
        text: message
    };
    FacebookRequest({
        url: process.env.FB_GRAPH_MSG_URL,
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

module.exports = {
    SendMessage: (id, message) => {
        sendMessage(id, message);
    }
};