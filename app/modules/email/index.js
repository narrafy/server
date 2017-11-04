const config = require('../config')
const SendGrid = require('sendgrid')(config.sendGrid.apiKey)
const MailHelper = require('sendgrid').mail
const log = require('../log')
const body = require('./body')

function send(mail) {

	const request = SendGrid.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: mail.toJSON(),
	})

    SendGrid.API(request,(error, response) => {
        if(error)
            return console.log(error);
        console.log(response.statusCode);
    });
}

function admin(message) {
	const fromEmail = new MailHelper.Email(config.sendGrid.contactEmail)
	const toEmail = new MailHelper.Email(config.sendGrid.adminEmail)
	const subject = config.app.name
	const content = new MailHelper.Content('text/plain', message)
	const mail = new MailHelper.Mail(fromEmail, subject, toEmail, content)
	return send(mail)
}


function adminbot(data) {

    const fromEmail = new MailHelper.Email("chatbot@narrafy.io")
    const toEmail = new MailHelper.Email(config.sendGrid.adminEmail)
    const subject = config.app.name
	const emailBody = body.adminemail(data)
    const content = new MailHelper.Content('text/html', emailBody)
    const mail = new MailHelper.Mail(fromEmail, subject, toEmail, content)
    return send(mail)
}

function bot(stories, ps, email) {

    const fromEmail = new MailHelper.Email("chatbot@narrafy.io")
    const toEmail = new MailHelper.Email(email)
    const subject = "The story of Rose"
    const emailBody = body.story(stories, ps)
    const content = new MailHelper.Content('text/html', emailBody)
    const mail = new MailHelper.Mail(fromEmail, subject, toEmail, content)
    return send(mail)
}


function contact(data) {
    const fromEmail = new MailHelper.Email(data.email)
    const toEmail = new MailHelper.Email(config.sendGrid.contactEmail)
    const subject = "Message from " + data.name
    const content = new MailHelper.Content('text/plain', data.message)
    const mail = new MailHelper.Mail(fromEmail, subject, toEmail, content)
    return send(mail)
}

function transcript(email, transcript) {
	const fromEmail = new MailHelper.Email(email)
	const toEmail = new MailHelper.Email(config.sendGrid.adminEmail)
	const subject = "Exercise Transcript"
	const emailBody = body.transcript(transcript)
	const content = new MailHelper.Content('text/html', emailBody)
	const mail = new MailHelper.Mail(fromEmail, subject, toEmail, content)
	return send(mail)
}

function story(email, story) {
    let fromEmail = new MailHelper.Email(email)
    let toEmail = new MailHelper.Email(config.sendGrid.adminEmail)
    let subject = "A story of hope from Narrafy"
    let emailBody = body.story(story)
    let content = new MailHelper.Content('text/html', emailBody)
    let mail = new MailHelper.Mail(fromEmail, subject, toEmail, content)
	return send(mail)
}

function subscriber(email) {
	const fromEmail = new MailHelper.Email(config.sendGrid.adminEmail)
	const toEmail = new MailHelper.Email(email)
	const subject = "Narrafy got your email"
	const emailBody = body.subscriberReply()
	const content = new MailHelper.Content('text/html', emailBody)
	const mail = new MailHelper.Mail(fromEmail, subject, toEmail, content)
	return send(mail)
}

function user(email) {
	const fromEmail = new MailHelper.Email(config.sendGrid.contactEmail)
	const toEmail = new MailHelper.Email(email)
	const subject = "We've got your message!"
	const emailBody = body.userReply()
	const content = new MailHelper.Content('text/html', emailBody)
	const mail = new MailHelper.Mail(fromEmail, subject, toEmail, content)
	return send(mail)
}

module.exports = {

	user: user,
	subscriber: subscriber,
	transcript: transcript,
	story: story,
	bot: bot,
	adminbot: adminbot,

	admin(message) {
		return admin(message)
	},
	contact(data){
		return contact(data)
	}
}
