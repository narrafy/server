// app/routes.js
require('dotenv').config({silent: true});

const M = require('./mongo');
const Watson = require('./watson');
const Facebook = require('./facebook');


module.exports =  (app) => {

    app.get('/webhook', function (req, res) {
        Facebook.VerifyToken(req,res);
    });

    app.post('/webhook', function (req, res) {

        var events = req.body.entry[0].messaging;
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            var sender = event.sender.id;
            if (event.message && event.message.text) {
                var data = {
                    id: sender,
                    text: event.message.text
                };
                Facebook.StartTyping(sender);
                M.PopContext(data);
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

        Watson.DronicRequest(req, res);
    });

    app.post('/api/subscribe',  (req, res) => {
        var data = {
            email: req.body.email,
            message:req.body.message,
            source: "subscribe form",
            date: new Date()
        };
        M.AddEmail(data);
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
}
