const Mongo = require('./mongo');

function processRequest(body, settings) {
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
                    Mongo.ProcessMessage(data, settings);
                    break;
                //investor button was pressed
                case 'CLEAR_CONTEXT':
                    var cb = (id) => {
                        var dt = {
                            sender: id,
                            text: ""
                        };
                        Mongo.ProcessMessage(dt, settings);
                    };
                    Mongo.ClearContext(data.sender, cb);
                    break;
                case 'reset':
                default:
                    break;
            }
        }
        //a conversation starts
        if(event.message){
            //user picks from quick replies
            if(event.message.text) {
                data.text = event.message.text;
                Mongo.ProcessMessage(data, settings);
            }
        }
    }
}

module.exports = {
    ProcessRequest: (body) => {
        var settings = {
            WatsonWorkspace: process.env.WORKSPACE_ID,
            FbPageToken:  process.env.FACEBOOK_PAGE_ACCESS_TOKEN
        };
        processRequest(body, settings);
    }
};