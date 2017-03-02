require('dotenv').config({silent: true});

var MongoClient = require('mongodb').MongoClient;
var Sendgrid = require('./sendgrid');
var mongoUri = process.env.MONGODB_URI;

function popConversation(facebook, watson){
    MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
        if (err) return console.log(err);
        database.collection('conversations').find({"id": facebook.data.id}).sort({"date": -1}).limit(1)
            .toArray((err, result) => {
                watson(facebook, err, result);
            });
    });
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
        var data = {
            email: response.input.text,
            message: 'an user from Dronic',
            source: source,
            date: new Date()
        };
        var callback = (data ,err) => {
            if(err)
                return console.log(err);
            Sendgrid.NotifyAdmin(data);
        };
        saveEmail(data, callback);
    }
}

//user sign up
function saveEmail(data, callback) {
    MongoClient.connect(mongoUri, (err, database) => {
        database.collection('emails').save(data, (err)=>{
            if(callback)
                callback(data, err);
        })
    });
}

function getUser(userid) {
    MongoClient.connect(mongoUri, (err, db) =>{
        if (err) return null;
        db.collection('users').findOne({"id": userid});
    });
}

function saveUser(data) {
    if(getUser(data.id)) return console.log(data.id + ' user already in db');
    MongoClient.connect(mongoUri, (err, db) => {
       if(err) return console.log(err);
        db.collection('users').save(data, (err) => {
            if (err)
                return console.log(err);
        });
    });
}

module.exports = {

    AddEmail: (data) => {
        var callback = (data ,err) => {
            if(err)
                return console.log(err);
            Sendgrid.NotifyAdmin(data);
        };
        saveEmail(data, callback);
    },

    SaveUser: (data) => {
        saveUser(data);
    },

    PushConversation: (sessionId, response, source) => {
        pushConversation(sessionId, response, source);
    },

    PopConversation: (facebook, watson) => {
        popConversation(facebook, watson);
    }
}
