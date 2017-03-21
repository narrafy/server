const Mongo = require('./mongo');
const Facebook = require('./facebook');

function processRequest(body) {
    var events = body.entry[0].messaging;
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var data = {
            sender: event.sender.id
        };

        //user interacts with the page for the first time
        if(event.optin || event.postback)
        {
            switch (event.postback.payload) {
                //user interacts with the page for the first time.
                case 'optin':
                    data.text = "";
                    Mongo.ProcessMessage(data, Facebook.SendQuickReplyMessage);
                    break;
                //investor button was pressed
                case 'investor':
                    Facebook.InvestorConversationStarter(data.sender);
                    break;
                default:
                    break;
            }
        }

        //a conversation starts
        if(event.message){

            //user picks from quick replies
            if(event.message.text) {

                data.text = event.message.text;
                //show typing icon to the user
                Facebook.StartTyping(data.sender);
                Mongo.ProcessMessage(data, Facebook.SendMessage);
            }
        }
    }
}

module.exports = {

    ProcessRequest: (body) => {
        processRequest(body)
    }

};