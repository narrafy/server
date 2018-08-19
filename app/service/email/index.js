const config = require('../config/index')
const log = require('../log/index')
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

function adminbot(data) {
    const emailBody = body.adminEmail(data)
    const msg = {
        to: config.sendGrid.adminEmail,
        from: data.email,
        subject: "A story from Narrafy",
        html: emailBody,
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

function contactAdmin(data) {
    let emailBody = body.contactHtml(data)
    const msg = {
        to: config.sendGrid.contactEmail,
        from: data.email,
        subject: "Message from " + data.name,
        html: emailBody,
    };
    return send(msg)
}

function transcript(email, transcript) {

	const emailBody = body.transcript(transcript)
    const msg = {
        to: email,
        from: config.sendGrid.adminEmail,
        subject: "Conversation Transcript",
        html: emailBody,
    };
	return send(msg)
}

function story(email, story) {

    let emailBody = body.story(story)
    const msg = {
        to: config.sendGrid.adminEmail,
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
        from: config.sendGrid.adminEmail,
        subject: "Narrafy got your email",
        html: emailBody,
    }
	return send(msg)
}

function sendEmail(email, user) {

	let emailBody = body.userReply(user)
    const msg = {
        to: email,
        from: config.sendGrid.contactEmail,
        subject: "We've got your message!",
        html: emailBody,
    }
	return send(msg)
}

module.exports = {

	notifySubscriber: notifySubscriber,
	transcript: transcript,
	story: story,
	bot: bot,
	adminBot: adminbot,
    sendEmail: sendEmail,
	admin(message) {
		return admin(message)
	},
	contactAdmin(data){
		return contactAdmin(data)
	}
}
