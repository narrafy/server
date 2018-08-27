const db = require('../../service/db/posgres')
const Email = require('../../service/email')
const Config = require('../../service/config')
const Ejs = require('ejs')
const Path = require('path')

function notifyOnSubscribe(email) {

    let filePath = Path.join(__dirname, '..', 'user', 'template', 'welcome.html')

    let data = {
        title: "You successfully joined our newsletter.",
        websiteUrl: Config.website.url,
        unsubscribeUrl: Config.website.unsubscribe + "?email=" + email,
        blogUrl: Config.website.blog,
    }
    let options= {}

    Ejs.renderFile(filePath, data, options, function(err, str){
        if(err){
            console.log(err)
            return
        }

        const msg = {
            to: email,
            from: Config.sendGrid.contactEmail,
            subject: data.title,
            html: str,
        }
        Email.sendMessage(msg)
    })
}

function notifyOnContact(email, name) {

    let filePath = Path.join(__dirname, '..', 'user', 'template', 'contact.html')

    let data = {
        title: "Dear " + name + ", we received your message.",
        name: name,
        websiteUrl: Config.website.url,
        unsubscribeUrl: Config.website.unsubscribe + "?email=" + email,
        blogUrl: Config.website.blog,
    }
    let options= {}

    Ejs.renderFile(filePath, data, options, function(err, str){
        if(err){
            console.log(err)
            return
        }

        const msg = {
            to: email,
            from: Config.sendGrid.contactEmail,
            subject: data.title,
            html: str,
        }
        Email.sendMessage(msg)
    })
}

async function saveContactInquiry(data){

    let query = {
        text: 'INSERT INTO contact(email, message, name, date) values ($1, $2, $3, CURRENT_TIMESTAMP)',
        values: [data.email, data.message, data.name]
    }

    return await db.singleResultQuery(query);
}

async function saveSubscriber(email, conversation_id = '')
{
    let query = {
        text: 'INSERT INTO subscriber(email, conversation_id, date) values ($1, $2, CURRENT_TIMESTAMP)',
        values: [email, conversation_id]
    }

    return await db.singleResultQuery(query);
}

module.exports= {
    contact: saveContactInquiry,
    subscribe: saveSubscriber,
    notifyOnSubscribe: notifyOnSubscribe,
    notifyOnContact: notifyOnContact
}