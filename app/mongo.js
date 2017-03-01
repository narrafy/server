require('dotenv').config({silent: true});

const MongoClient = require('mongodb').MongoClient;
var Sendgrid = require('./sendgrid');

function pullLastConversation(facebook, watson){

    MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
        if (err) return console.log(err);
        database.collection('conversations').find({"id": facebook.data.id}).sort({"date": -1}).limit(1)
            .toArray((err, result) => {
                watson(facebook, err, result);
            });
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

function getUser(userid) {

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

function pushConversation(sessionId, response, source){
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
        });
    });
    if(response.entities && response.entities[0] && response.entities[0].entity ==="email"){
        logUserEmail(response.input.text, source);
    }
}

module.exports = {

    AddUser: (data) => {
        addUser(data);
    },

    PushConversation: (sessionId, response, source) => {
        pushConversation(sessionId, response, source);
    },

    ReadConversation: (req,res) =>{
        readConversation(req,res);
    },

    PullLastConversation: (facebook, watson) => {
        pullLastConversation(facebook, watson);
    }
}
