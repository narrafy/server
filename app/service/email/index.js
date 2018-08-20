const config = require('../config/index')
const body = require('./body')

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.sendGrid.apiKey);

function send(msg) {
    sgMail.send(msg);
}

function admin(message) {
    const msg = {
        to: config.sendGrid.adminEmail,
        from: config.sendGrid.contactEmail,
        subject: config.app.name,
        text: message,
    };
	return send(msg)
}

function bot(data) {
    const emailBody = body.story(data)
	const msg = {
        to: data.email,
        from: config.sendGrid.adminEmail,
        subject: "A Narrafy Story",
        html: emailBody,
    };
    return send(msg)
}

function contactAdmin(email, message) {
    let emailBody = body.contactHtml(message)
    const msg = {
        to: config.sendGrid.contactEmail,
        from: email,
        subject: "Message from " + email,
        html: emailBody,
    };
    return send(msg)
}

function transcript(email, doc) {

	const emailBody = body.transcript(doc)
    const msg = {
        to: email,
        from: config.sendGrid.contactEmail,
        subject: "Conversation Transcript",
        html: emailBody,
    };
	return send(msg)
}

function story(email, story) {

    let emailBody = body.story(story)
    const msg = {
        to: config.sendGrid.contactEmail,
        from: email,
        subject: "A story from Narrafy",
        html: emailBody,
    };
	return send(msg)
}

function notifySubscriber(email) {

    const emailBody = body.subscriberReply()
    const msg = {
        to: email,
        from: config.sendGrid.contactEmail,
        subject: "Narrafy got your email",
        html: emailBody,
    }
	return send(msg)
}

function sendEmail(email, name) {

	let emailBody = body.userReply(name)
    const msg = {
        to: email,
        from: config.sendGrid.contactEmail,
        subject: "We've got your message!",
        html: emailBody,
    }
	return send(msg)
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

module.exports = {

	notifySubscriber: notifySubscriber,
	transcript: transcript,
	story: story,
	bot: bot,
    sendEmail: sendEmail,
	admin(message) {
		return admin(message)
	},
	contactAdmin: contactAdmin,
    validate: validateEmail
}
