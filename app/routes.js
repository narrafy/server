// app/routes.js
require('dotenv').config({silent: true});

var Mongo = require('./mongo');
var Watson = require('./watson');
var Facebook = require('./facebook');
var facebook_handler = require('./botkit').handler


module.exports =  (app) => {

    app.get('/webhook', function (req, res) {

        if (req.query['hub.verify_token'] === process.env.FACEBOOK_VERIFY_TOKEN) {
            res.send(req.query['hub.challenge']);
        } else {
            res.send('Invalid verify token!');
        }
    });

    app.post('/webhook', function (req, res) {
        facebook_handler(req.body)

        res.send('ok')
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
