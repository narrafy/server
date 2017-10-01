const config = require('../config')
const SendGrid = require('sendgrid')(config.sendGrid.apiKey)
const MailHelper = require('sendgrid').mail
const log = require('../log')

async function sendEmail(mail) {

	const request = SendGrid.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: mail.toJSON(),
	})

	const [response, body] = await SendGrid.API(request)
	console.info(response.statusCode)
}

async function notifyAdmin(email, message) {
	const fromEmail = new MailHelper.Email(email)
	const toEmail = new MailHelper.Email(config.sendGrid.adminEmail)
	const subject = config.app.name
	const content = new MailHelper.Content('text/plain', message)
	const mail = new MailHelper.Mail(fromEmail, subject, toEmail, content)
	return sendEmail(mail)
}

async function sendTranscript(email, transcript) {
	const fromEmail = new MailHelper.Email(email)
	const toEmail = new MailHelper.Email(config.sendGrid.adminEmail)
	const subject = "Exercise Transcript"
	const emailBody = getTranscriptEmailBody(transcript)
	const content = new MailHelper.Content('text/html', emailBody)
	const mail = new MailHelper.Mail(fromEmail, subject, toEmail, content)
	return sendEmail(mail)
}

async function notifySubscriber(email) {
	const fromEmail = new MailHelper.Email(config.sendGrid.adminEmail)
	const toEmail = new MailHelper.Email(email)
	const subject = "Narrafy got your email"
	const emailBody = getSubscriberReplyEmailBody()
	const content = new MailHelper.Content('text/html', emailBody)
	const mail = new MailHelper.Mail(fromEmail, subject, toEmail, content)
	return sendEmail(mail)
}

async function notifyUser(email) {
	const fromEmail = new MailHelper.Email(config.sendGrid.adminEmail)
	const toEmail = new MailHelper.Email(email)
	const subject = "We've got your message!"
	const emailBody = getUserReplyEmailBody()
	const content = new MailHelper.Content('text/html', emailBody)
	const mail = new MailHelper.Mail(fromEmail, subject, toEmail, content)
	return sendEmail(mail)
}

function getTranscriptEmailBody(transcript) {

	const transcriptHtml = transcript.map(record => {
		return i % 2 ? `<li>${record}</li>` : `<li><strong>${record}</strong></li>`
	}).join('')

	return `<html><body><ul>{transcriptHtml}</ul><body/></html>`
}

function getSubscriberReplyEmailBody() {
	return "<html><body><p>" + "Hey! We've got your email." +
		" We will contact you when I have something cool to share." +
		" Otherwise, we don't bother innocent people!" + "</p>" +
		"<p>Have a nice day! <a href='https://www.narrafy.io'>Narrafy</a> Team</p></body></html>"
}

function getUserReplyEmailBody() {
	return "<html><body><p>" + "Hey! We've got your email." +
		" We will contact as soon as possible. Thank you for your interest!" +
		"</p>" +
		"<p><a href='https://www.narrafy.io'>Narrafy</a> Team</p></body></html>"
}

module.exports = {

	notifyUser: notifyUser,
	notifySubscriber: notifySubscriber,
	sendTranscript: sendTranscript,

	async notifyAdmin(data) {
		return notifyAdmin(data.email, data.message)
	}

}
