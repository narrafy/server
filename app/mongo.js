require('dotenv').config({silent: true});

var MongoClient = require('mongodb').MongoClient;
var Sendgrid = require('./sendgrid');

function Connect(callback){
    MongoClient.connect(process.env.MONGODB_URI, callback);
}

function popConversation(facebook, watson){
    Connect((err, database) =>
    {
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
        context: response,
        source: source,
        date: new Date()
    };
    Connect((err, database) => {
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
            Sendgrid.NotifyUser(data.email);
        };
        saveEmail(data, callback);
    }
}

function saveEmail(data, callback) {
    Connect((err, database) => {
        database.collection('emails').save(data, (err)=>{
            if(callback)
                callback(data, err);
        })
    });
}

function getUser(userid) {
    Connect((err, db) =>{
        if (err) return null;
        db.collection('users').findOne({"id": userid});
    });
}

function saveUser(data) {
    if(getUser(data.id)) return console.log(data.id + ' user already in db');
    Connect((err, db) => {
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
            Sendgrid.NotifyUser(data.email);
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
    },
    Connect: (callback) =>
    {
        Connect(callback);
    }
}
