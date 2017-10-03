const db = require('../db')
const log = require('../log')
const Conversation = require('../conversation/conversation')
const Nlu = require('../natural-language/understanding/nlu')
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

	app.get('/api/parse', async function (req, res) {
		var sentence = req.query['sentence']
		var roles = await Nlu.semanticParse("I want to break free")
		res.send(roles)
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

	app.get('/api/gettranscript', async (req, res) => {
		var conversation_id = req.query['conversation_id']
		if (conversation_id !== null) {
			const transcript = await db.getTranscript(conversation_id)
			res.json(transcript)
		} else {
			res.sendStatus(500)
		}
	})

	app.get('/api/emailtranscript',  (req, res) => {

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

	app.get('/api/getsemanticparse', async (req, res) => {
		var conversation_id = req.query['conversation_id']
		if (conversation_id !== null) {
			var context = {};
			const roles = await Nlu.semanticParse(context, config.interview.type.internalization.vars);
			res.json(roles)
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
