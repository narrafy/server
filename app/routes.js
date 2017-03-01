// app/routes.js
require('dotenv').config({silent: true});

var Mongo = require('./mongo');
var Watson = require('./watson');
var Facebook = require('./facebook');

module.exports =  (app) => {

    app.get('/webhook', function (req, res) {

        if (req.query['hub.verify_token'] === 'testbot_verify_token') {
            res.send(req.query['hub.challenge']);
        } else {
            res.send('Invalid verify token!');
        }
    });

    app.post('/webhook', (req, res) => {

        var events = req.body.entry[0].messaging;
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            var sender = event.sender.id;
            if (event.message && event.message.text) {
                var facebook = {
                    data: {
                        id: sender,
                        text: event.message.text
                    },
                    message: Facebook.SendMessage,
                    mongo: Mongo.PushConversation
                };
                Mongo.PullLastConversation(facebook, Watson.FacebookRequest);
            }
            else if(event.optin ||
                (event.postback &&
                event.postback.payload === 'optin')){
                Facebook.SendMessage(sender, 'Nice, nice. Dronic is happy you are' +
                    'visiting him! Mrrrr....');
            }

        }
        res.sendStatus(200);
    });

    app.post('/api/message', function (req, res) {

        Watson.DronicRequest(req, res, Mongo.PushConversation);
    });

    app.post('/api/subscribe',  (req, res) => {
        var data = {
            email: req.body.email,
            message:req.body.message,
            source: "subscribe form",
            date: new Date()
        };
        Mongo.AddUser(data);
        res.sendStatus(200);
    });

    //free ssl encryption
    app.get('/.well-known/acme-challenge/:content', (req, res) => {
        res.send(process.env.SSL_SECRET);
    });

    app.get('/', (req, res) => {
        res.render('index.ejs');
    });

    app.get('/privacy-policy', (req,res) => {
        res.render('privacy.ejs');
    });

    app.get('/terms-of-use', (req, res) =>{
        res.render('terms.ejs');
    });

    app.get('/archive', (req, res) => {
        Mongo.ReadConversation(req,res);
    });
}
