// app/routes.js
require('dotenv').config({silent: true});

const Mongo = require('./mongo');
const Facebook = require('./facebook');
const Conversation = require('./conversation');
const Nlu = require('./nlu');
const Sendgrid = require('./sendgrid');

const fb_verify_token = process.env.FACEBOOK_PAGE_VERIFY_TOKEN;
const greetingMessage = "Hi! I'm Narrafy, I turn problems into stories. Talk to me!";

module.exports =  (app) => {

    Facebook.Greet(greetingMessage);
    Facebook.RemovePersistentMenu();
    Facebook.AddPersistentMenu();

    app.get('/webhook', function (req, res) {
        Facebook.VerifyToken(req,res, fb_verify_token);
    });

    app.post('/webhook', function (req, res) {
        Conversation.Messenger(req.body);
        res.sendStatus(200);
    });

    app.post('/api/message', function (req, res) {
        Conversation.Web(req, res);
    });

    app.get('/api/parse', function(req, res){
        var sentence = req.query['sentence'];
        var roles = Nlu.GetSemanticRoles("I want to break free");
        res.send(roles);
    });

    app.post('/api/contact',  (req, res) => {
        var data = {
            email: req.body.email,
            message:req.body.message,
            source: "subscribe form",
            date: new Date()
        };
        Mongo.AddInquiry(data);
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

    app.get('/api/gettranscript', (req, res) => {
        var conversation_id = req.query['conversation_id'];
        if(conversation_id !== null){
            var cb = (transcript) => {
                return res.json(transcript);
            };
            Mongo.GetTranscript(conversation_id, cb);
        }else{
            res.sendStatus(500);
        }
    });

    app.get('/api/emailtranscript', (req, res) => {
        var conversation_id = req.query['conversation_id'];
        var email = req.query['email'];
        if(conversation_id !== null){
            var cb = (transcript)=>{
                Sendgrid.SendTranscript(email, transcript);
            };
            Mongo.GetTranscript(conversation_id, cb);
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    });

    app.get('/api/getsemanticparse', (req, res) => {
        var conversation_id = req.query['conversation_id'];
        if(conversation_id !== null) {
            var cb = (transcript, err) => {
                if(err)
                   return res.sendStatus(500);
                var callback = (response) => {
                    res.json(response);
                };
                Nlu.GetSemanticRoles(transcript, callback);
            };
            Mongo.GetReplies(conversation_id, cb);

        }else{
            res.sendStatus(500);
        }
    });

    //free ssl encryption
    app.get('/.well-known/acme-challenge/:content', (req, res) => {
        res.send(process.env.SSL_SECRET);
    });

    app.get('/', (req, res) => {
        res.render('index.ejs');
    });

    app.get('/timeline', (req,res) => {
        res.render('foundation/timeline.ejs');
    });

    app.get('/about', (req,res) => {
        res.render('foundation/about.ejs');
    });

    app.get('/careers', (req,res) => {
        res.render('foundation/careers.ejs');
    });

    app.get('/privacy-policy', (req,res) => {
        res.render('privacy.ejs');
    });

    app.get('/terms-of-use', (req, res) =>{
        res.render('terms.ejs');
    });
    app.get('/contact', (req,res)=>{
        res.render('foundation/contact.ejs');
    });
}
