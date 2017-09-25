"use strict";
require('dotenv').config({silent: true});

var md = require('mongodb').MongoClient;
var sg = require('./sendgrid');


const chatbot_id = process.env.CHATBOT_ID;
const log_table = "conversations";
const transcript_table = "transcripts";
const contact_table = "contact";
const context_semantics= "context_semantics";
const internal_problem_table = "internal_problems";
const externarl_stories_table = "external_stories";

function Connect(callback) {
    md.connect(process.env.MONGODB_URI, callback);
}

function getContext(input, cb) {

    if (input.sender === chatbot_id) {
        //if it's an echo from the facebook page
        // we catch the message when a counsellor takes over
        console.log("page echo: " + input.sender + " says  " + input.text);
    } else {
        //it's a text from a user
        console.log("user: " + input.sender + " says  " + input.text);
        Connect((err, database) => {
            if (err) return console.log(err);

            database.collection(log_table).find({"id": input.sender}).sort({"date": -1}).limit(1)
                .toArray((err, stored_log) => {
                    if (err) {
                        return console.log("Error processMessage function: " + err);
                    }
                   if(cb){
                        cb(input, stored_log);
                   }
                });
        });
    }
}

function pushContext(id, conversation) {
    var dbConversation = {
        id: id,
        conversation_id: conversation.context.conversation_id,
        intents: conversation.intents,
        entities: conversation.entities,
        input: conversation.input,
        output: conversation.output,
        context: conversation.context,
        date: new Date()
    };
    Connect((err, db) => {
        db.collection(log_table).save(dbConversation, (err) => {
            if (err)
                return console.log(err);
        });
    });
}

function clearContext(data, cb){
    Connect((err, db) => {
        db.collection(log_table).deleteMany({"id": data.sender }, (err) => {
            if (err)
                return console.log(err);
            else{
                getContext(data, cb);
            }
        });
    });
}

function saveInquiry(data, callback) {
    Connect((err, database) => {
        database.collection(contact_table).save(data, (err) => {
            if (callback)
                callback(data, err);
        })
    });
}

function getTranscript(conversation_id, cb) {
    Connect((err, database) => {
        database.collection(log_table).find({"conversation_id": conversation_id}).sort({$natural:1}).toArray((err, result) => {
            var transcript = new Array();
            for(let j = 0; j < result.length; j++){
                var conversation = result[j];
                if(conversation.input && conversation.input.text){
                    transcript.push(conversation.input.text);
                }
                if(conversation.output && conversation.output.text){
                    transcript.push(conversation.output.text);
                }
            }
            //save transcript
            if(transcript.length>0) {
                var data = {
                    conversation_id: conversation_id,
                    transcript: transcript,
                    date: new Date()
                };
                database.collection(transcript_table).save(data, (err) => {
                    if(err)
                        console.log(err);
                });
            }
            //process further the conversation transcript, if needed
            if(cb)
                cb(transcript);
        });
    });
 }

function getReplies(conversation_id, cb){
     Connect((err, database) => {
         database.collection(log_table).find({"conversation_id": conversation_id}).sort({$natural:1}).toArray((err, result) => {
             var transcript = "";
             for(let j = 0; j < result.length; j++){
                 var conversation = result[j];
                 if(conversation.input && conversation.input.text){
                     transcript += ". " + conversation.input.text;
                 }
             }
             console.log(transcript);
             if(cb)
                 cb(transcript);
         });
     });
 }

function saveSubscriber(data, cb){
    Connect((err, database)=>{
        database.collection('subscribers').save(data, (err)=>{
            if(err)
                return;
            if(cb)
                cb(data, err);
        })
    });
}

function saveSemantics(data, cb)
{
    Connect((err, db)=> {
        db.collection(context_semantics).save(data,(err) => {
           if(err)
               return console.log(err);
           if(cb)
               cb;
        });
    });
}

module.exports = {

    AddInquiry: (data) => {
        var callback = (data, err) => {
            if (err)
                return console.log(err);
            sg.NotifyAdmin(data);
            sg.NotifyUser(data.email);
        };
        saveInquiry(data, callback);
    },

    AddSubscriber: (data) => {
        var cb = (data, err)=>{
            if(err)
                return console.log(err);
            data.message = "Congrats, another user just subscribed!"
            sg.NotifyAdmin(data);
            sg.NotifySubscriber(data.email);
        }
      saveSubscriber(data,cb);
    },

    GetTranscript: (conversation_id, cb) => {
        getTranscript(conversation_id, cb);
    },

    GetReplies: (conversation_id, cb) =>{
      getReplies(conversation_id, cb)
    },

    GetContext: (input, cb) => {
        getContext(input, cb);
    },

    ClearContext: (id, cb) => {
        clearContext(id, cb)
    },

    PushContext: (id, conversation) =>{
        pushContext(id, conversation)
    },
    SaveSemantics: (data, cb) =>
    {
        saveSemantics(data, cb)
    }
}
