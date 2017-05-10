// app/routes.js
require('dotenv').config({silent: true});

const Mongo = require('./mongo');
const Facebook = require('./facebook');
const Conversation = require('./conversation');
const FbPageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const FbVerifyToken = process.env.FACEBOOK_PAGE_VERIFY_TOKEN;
const greetingMessage = "Finally! Someone wants to talk to me!";
const appName = process.env.APP_NAME;

module.exports =  (app) => {


    if(appName==='DRONIC'){
        Facebook.Greet(greetingMessage, FbPageAccessToken);
        Facebook.RemovePersistentMenu(FbPageAccessToken);
        Facebook.AddPersistentMenu(FbPageAccessToken);
    }

    app.get('/webhook', function (req, res) {
        Facebook.VerifyToken(req,res, FbVerifyToken);
    });

    app.post('/webhook', function (req, res) {
        Conversation.ProcessRequest(req.body);
        res.sendStatus(200);
    });

    app.post('/api/message', function (req, res) {
        Mongo.WebRequest(req, res);
    });

    app.post('/api/contact',  (req, res) => {
        var data = {
            email: req.body.email,
            message:req.body.message,
            source: "subscribe form",
            date: new Date()
        };
        Mongo.AddEmail(data);
        res.sendStatus(200);
    });

    app.post('/api/subscribe', (req, res)=>{

        var data = {
          email: req.body.email,
            date: new Date(),
        };
        Mongo.AddSubscriber(data);
        res.sendStatus(200);
    });

    //free ssl encryption
    app.get('/.well-known/acme-challenge/:content', (req, res) => {
        res.send(process.env.SSL_SECRET);
    });

    app.get('/', (req, res) => {
        if(appName ==='DRONIC'){
            res.render('index.ejs');
        }
    });

    app.get('/privacy-policy', (req,res) => {
        res.render('privacy.ejs');
    });

    app.get('/terms-of-use', (req, res) =>{
        res.render('terms.ejs');
    });
    app.get('/contact', (req,res)=>{
        res.render('contact.ejs');
    });
}
