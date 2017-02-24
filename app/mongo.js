require('dotenv').config({silent: true});

const MongoClient = require('mongodb').MongoClient;
var Sendgrid = require('./sendgrid');

function conversationLookup(facebook, watson){

    MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
        if (err) return console.log(err);

        console.log(facebook.data.id);
        database.collection('conversations').find({"id": facebook.data.id}).sort({"date": -1}).limit(1)
            .toArray((err, result) => {
                watson(facebook, err, result);
            });
    });
}

//user sign up
function addUser(data) {
    MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
        database.collection('users').save(data, (err)=>{
            if(err)
                return console.log(err);
            Sendgrid.NotifyAdmin(data);
            console.log("An user: " + data.email + ' from : ' + data.source + ' was added');
        })
    });
}

function readConversation(req, res) {
    MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
        if (err) return console.log(err);
        database.collection('conversations')
            .find({id: req.headers.host})
            .toArray((err, result) => {
                if (err){
                    return console.log(err);
                }
                res.render('archive.ejs', {payloads: result});
            });
    });
}

function logConversation(sessionId, response, source){
    var toStore = {
        id: sessionId,
        response: response,
        source: source,
        date: new Date()
    };
    MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
        database.collection('conversations').save(toStore, (err) => {
            if (err)
                return console.log(err);
            console.log('saved to database');
        });
    });
    if(response.intents && response.intents[0]){
        var intent = response.intents[0];
        if(intent.intent === "email" )
        {
            logUserEmail(response.input.text, sessionId, intent.intent, source);
        }
    }else if(response.entities && response.entities[0])
    {
        var entity = response.entities[0];
        if(entity.entity === "email"){
            logUserEmail(response.input.text, sessionId, entity.entity, source);
        }
    }
}

function logUserEmail(email, source){
    var data = {
        email: email,
        message: 'an user from Dronic',
        source: source,
        date: new Date()
    };
    addUser(data);
}

module.exports = {

    AddUser: (data) => {
        addUser(data);
    },

    Log: (sessionId, response, source) => {
        logConversation(sessionId, response, source);
    },

    ReadConversation: (req,res) =>{
        readConversation(req,res);
    },

    ConversationLookup: (facebook, watson) => {
        conversationLookup(facebook, watson);
    }
}
