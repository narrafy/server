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

	app.get('/api/transcript/email',  async (req, res) => {

		var conversation_id = req.query['conversation_id']
		var email = req.query['email']
		if (conversation_id !== null) {
			const transcript = await db.getTranscript(conversation_id)
			if(transcript)
				mailService.send(email, transcript)
			res.sendStatus(200)
		} else {
			res.sendStatus(500)
		}
	})

	app.get('/api/story/get', async (req, res) => {
		let conversation_id = req.query['conversation_id'];
		let interview_type = req.query['interview_type'];

		let templateArray = {
			"internalization" : "$user_name you say you are too _problem.object about _context.sentence. " +
            "It usually happens when you are _trigger.object. This does affect your life, because it makes " +
            "you do things you would not do otherwise. _influence.sentence. It affects " +
            "people and relationships you care about. _influence_on_relationships_example.sentence. " +
            "It makes your life difficult. _difficulties.sentence. " +
            "But, there is a a fountain of hope! You see it. One day, you will wake up in the morning, and your life life will be " +
            "different. _invitation_to_exception.sentence.",

			"externalization" : "$user_name, let's look back and see what kind of villain you are fighting with." +
            " His name is $problem_story. Something happened and it was possible for him to dominate your life. " +
            "You it's: $vulnerable_to_external_problem. The villain appears in specific contexts. " +
            "In your case is when $story_context. It is a bad guy. It even managed to get you to do things " +
            "against your better judgement - $jeopardize_judgement. $external_problem takes over when $takeover. " +
            "It has an effect on your relationships. You say it $problem_effect_on_relationships. " +
            "And it makes your life hard: \\\"$external_problem_cause_difficulties\\\". " +
            "But you managed to fight back - $unique_outcome. Several times! And you are prepared to take a position against it."
		}


		if (conversation_id !== null) {
			let data = {
				template: templateArray[interview_type],
				conversation_id: conversation_id,
				interview_type: interview_type
			};

			try {
                const story = await Nlg.story(data);
                res.json(story);
			} catch (e) {
				console.log(e.stack);
			}

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
