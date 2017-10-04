const db = require('../db')
const log = require('../log')
const Conversation = require('../conversation/conversation')
const Nlg = require('../natural-language/generation')
const mailService = require('../email')
const config = require('../config')

module.exports = (app) => {

	app.get('/webhook', function (req, res) {
		if (req.query['hub.verify_token'] === config.facebook.verifyToken) {
			res.send(req.query['hub.challenge'])
		} else {
			res.send('Invalid verify token!')
		}
	})

	app.post('/webhook', async function (req, res) {
		await Conversation.messengerRequest(req.body)
		res.sendStatus(200)
	})

	app.post('/api/message', async function (req, res) {
		await Conversation.web(req, res)
	})

	app.post('/api/contact', async (req, res) => {
		await db.addInquiry({
			email: req.body.email,
			message: req.body.message,
			source: "subscribe form",
			date: new Date()
		})
		res.sendStatus(200)
	})

	app.post('/api/subscribe', async (req, res) => {
		await db.addSubscriber({
			email: req.body.email,
			date: new Date(),
		})
		res.sendStatus(200)

	})

	app.get('/api/transcript/get', async (req, res) => {
		var conversation_id = req.query['conversation_id']
		if (conversation_id !== null) {
			const transcript = await db.getTranscript(conversation_id)
			res.json(transcript)
		} else {
			res.sendStatus(500)
		}
	})

	app.get('/api/transcript/email',  (req, res) => {

		var conversation_id = req.query['conversation_id']
		var email = req.query['email']
		if (conversation_id !== null) {
			const transcript = db.getTranscript(conversation_id)
			mailService.sendTranscript(email, transcript)
			res.sendStatus(200)
		} else {
			res.sendStatus(500)
		}
	})

	app.get('/api/story/get', async (req, res) => {
		var conversation_id = req.query['conversation_id']
		if (conversation_id !== null) {
			let data = {
				template: "$user_name you say you are too $problem.text. " +
                "And this is what it does to your life. You are too $problem.text about $context.text. " +
                "There is a trigger that launches it: trigger.text. This does affect your life, because it makes you do things you wouldn’t do otherwise. " +
                "If I am to quote you ... $influence.text. It affects the people and relationships you care about. " +
                "$influence_on_relationships_example.text. It makes your life difficult. $difficulties.text " +
                "But, there is a hope. You see it. One day, you will wake up in the morning and... $invitation_to_exception.text",
				conversation_id: conversation_id,
				interview_type: "recap_problem"
			}
			const story = await Nlg.story(data);
			res.json(story);
		} else {
			res.sendStatus(500)
		}
	})

	//free ssl encryption
	app.get('/.well-known/acme-challenge/:content', (req, res) => {
		res.send(config.sslSecret)
	})

	app.get('/', (req, res) => {
		res.render('index.ejs')
	})

	app.get('/timeline', (req, res) => {
		res.render('foundation/timeline.ejs')
	})

	app.get('/about', (req, res) => {
		res.render('foundation/about.ejs')
	})

	app.get('/careers', (req, res) => {
		res.render('foundation/careers.ejs')
	})

	app.get('/privacy-policy', (req, res) => {
		res.render('privacy.ejs')
	})

	app.get('/terms-of-use', (req, res) => {
		res.render('terms.ejs')
	})
	app.get('/contact', (req, res) => {
		res.render('foundation/contact.ejs')
	})
}
