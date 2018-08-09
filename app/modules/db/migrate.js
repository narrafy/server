const mongo = require('mongodb')
const posgres = require('../db/posgres')
const config = require('../config')

const mg = mongo.MongoClient;


function migrateConversation()
{
    posgres.connect('postgres://yonhkrszxqpofu:e0aa31425f469ce6656d431f7da6b4c251c987f01847cdda3cee68c7fbf6801d@ec2-54-235-94-36.compute-1.amazonaws.com:5432/df6fdubf28jc21');

    (async () => {

        const client = await mg.connect(config.db_settings.mongo);
        const db = client.db('heroku_jwt3p6rq');
        let i = 0;
        try {

            let cursor = await db.collection("conversations").find();
            while(await cursor.hasNext())
            {
                i++;
                let document = await cursor.next();
                await posgres.pushContext(document)
                console.log(document._id);
            }
        }
        finally {
            client.close();
            console.log("job done!");
            console.log(i + " documents inserted");
        }})()
        .catch(err => console.error(err));
}


function migrateStory()
{

    posgres.connect('postgres://yonhkrszxqpofu:e0aa31425f469ce6656d431f7da6b4c251c987f01847cdda3cee68c7fbf6801d@ec2-54-235-94-36.compute-1.amazonaws.com:5432/df6fdubf28jc21');

    (async () => {

        const client = await mg.connect(config.db_settings.mongo);
        const db = client.db('heroku_jwt3p6rq');
        let i = 0;
        try {

            let cursor = await db.collection("stories").find();
            while(await cursor.hasNext())
            {
                i++;
                let document = await cursor.next();
                await posgres.saveStory(document)
                console.log(document._id);
            }
        }
        finally {
            client.close();
            console.log("job done!");
            console.log(i + " documents inserted");
        }})()
        .catch(err => console.error(err));
}

function migrateStoryTemplate()
{
    posgres.connect('postgres://yonhkrszxqpofu:e0aa31425f469ce6656d431f7da6b4c251c987f01847cdda3cee68c7fbf6801d@ec2-54-235-94-36.compute-1.amazonaws.com:5432/df6fdubf28jc21');

    (async () => {

        const client = await mg.connect(config.db_settings.mongo);
        const db = client.db('heroku_jwt3p6rq');
        let i = 0;
        try {

            let cursor = await db.collection("template_stories").find();
            while(await cursor.hasNext())
            {
                i++;
                let document = await cursor.next();
                await posgres.saveStoryTemplate(document)
                console.log(document._id);
            }
        }
        finally {
            client.close();
            console.log("job done!");
            console.log(i + " documents inserted");
        }})()
        .catch(err => console.error(err));
}

function migrateTranscript()
{
    posgres.connect('postgres://yonhkrszxqpofu:e0aa31425f469ce6656d431f7da6b4c251c987f01847cdda3cee68c7fbf6801d@ec2-54-235-94-36.compute-1.amazonaws.com:5432/df6fdubf28jc21');

    (async () => {

        const client = await mg.connect(config.db_settings.mongo);
        const db = client.db('heroku_jwt3p6rq');
        let i = 0;
        try {

            let cursor = await db.collection("transcripts").find();
            while(await cursor.hasNext())
            {
                i++;
                let document = await cursor.next();
                await posgres.saveTranscript(document)
                console.log(document._id);
            }
        }
        finally {
            client.close();
            console.log("job done!");
            console.log(i + " documents inserted");
        }})()
        .catch(err => console.error(err));
}

function migrateSubscriber()
{
    posgres.connect('postgres://yonhkrszxqpofu:e0aa31425f469ce6656d431f7da6b4c251c987f01847cdda3cee68c7fbf6801d@ec2-54-235-94-36.compute-1.amazonaws.com:5432/df6fdubf28jc21');

    (async () => {

        const client = await mg.connect(config.db_settings.mongo);
        const db = client.db('heroku_jwt3p6rq');
        let i = 0;
        try {

            let cursor = await db.collection("subscribers").find();
            while(await cursor.hasNext())
            {
                i++;
                let document = await cursor.next();
                await posgres.addSubscriber(document)
                console.log(document._id);
            }
        }
        finally {
            client.close();
            console.log("job done!");
            console.log(i + " documents inserted");
        }})()
        .catch(err => console.error(err));

}

function migrateCustomer()
{
    posgres.connect('postgres://yonhkrszxqpofu:e0aa31425f469ce6656d431f7da6b4c251c987f01847cdda3cee68c7fbf6801d@ec2-54-235-94-36.compute-1.amazonaws.com:5432/df6fdubf28jc21');

    (async () => {

        const client = await mg.connect(config.db_settings.mongo);
        const db = client.db('heroku_jwt3p6rq');
        let i = 0;
        try {

            let cursor = await db.collection("customer").find();
            while(await cursor.hasNext())
            {
                i++;
                let document = await cursor.next();
                await posgres.saveCustomer(document);
                console.log(document._id);
            }
        }
        finally {
            client.close();
            console.log("job done!");
            console.log(i + " documents inserted");
        }})()
        .catch(err => console.error(err));
}

module.exports = {

    migrateCustomer()
    {
        migrateCustomer();
    },

    migrateConversation(){
        migrateConversation();
    },

    migrateStory (){
        migrateStory();
    },

    migrateStoryTemplate()
    {
        migrateStoryTemplate();
    },

    migrateTranscript(){
        migrateTranscript();
    },

    migrateSubscriber(){
        migrateSubscriber();

    }
}