const customer = require ('../customer')
const log = require('../log')
const Conversation = require('../conversation/conversation')
const Analytics = require ('../analytics')
const mailService = require('../email')
const config = require('../config')
const fb = require('../facebook-api')

module.exports = (app) => {

	app.get('/webhook', async function (req, res) {

		let customerVerifyToken =  req.query['hub.verify_token'];
		let customerConfig = await config.getCustomerByToken(customerVerifyToken);
		if (customerConfig && (customerConfig.facebook.verify_token === customerVerifyToken)) {
            res.send(req.query['hub.challenge'])

            /* Configure Facebook */
            fb.init({
                greeting: customerConfig.facebook.greeting_message,
                cta: customerConfig.facebook.cta,
                access_token: customerConfig.facebook.access_token
            }).catch(log.error)

		} else {
			res.send('Invalid verify token!')
		}
	})

	app.post('/webhook', async function (req, res) {
		await Conversation.messengerRequest(req.body)
		res.sendStatus(200)
	})

	app.post('/api/message', async function (req, res) {

		const {conversation, messages} = await Conversation.web(req)

		let messageArray = []

		if(messages){
            messages.forEach(item => {
                messageArray.push(item)
            })
		}
        conversation.output.text = messageArray.join(" ")
        res.json(conversation)
	})

	app.post('/api/contact', async (req, res) => {

		let data = {
            email: req.body.email,
            message: req.body.message,
			name: req.body.name,
            source: "contact form",
            date: new Date()
        };
		await customer.addInquiry(data)
        mailService.contact(data)
        mailService.user(data.email, data.name)
		res.sendStatus(200)
	})

	app.post('/api/story/send', async (req, res) => {

        let data = await Analytics.saveStory(req.body)
        mailService.bot(data)
		res.sendStatus(200)
    })

    app.post('/api/story/save', async (req, res) => {
		await Analytics.saveStory(req.body)
        res.sendStatus(200)
    })

	app.post('/api/subscribe', async (req, res) => {
		let data = {
            email: req.body.email,
            date: new Date(),
        };
		await customer.addSubscriber(data)
        mailService.admin("Congrats, another user just subscribed!")
        mailService.subscriber(data.email)
		res.sendStatus(200)
	})

	app.get('/api/transcript/get', async (req, res) => {
		var conversation_id = req.query['conversation_id']
		if (conversation_id !== null) {
			const transcript = await Analytics.getTranscript(conversation_id)
			res.json(transcript)
		} else {
			res.sendStatus(500)
		}
	})

	app.get('/api/transcript/email',  async (req, res) => {

		var conversation_id = req.query['conversation_id']
		var email = req.query['email']
		if (conversation_id !== null) {
			const transcript = await Analytics.getTranscript(conversation_id)
			if(transcript)
				mailService.transcript(email, transcript)
			res.sendStatus(200)
		} else {
			res.sendStatus(500)
		}
	})

    app.get('/story', async function (req, res) {

        let model = await Analytics.getStoryModel(req.query['conversation_id'])
        if (model) {
            res.render('profile/user.ejs', model)
        } else {
            res.sendStatus(500)
        }
    })

	app.get('/', (req, res) => {
		res.render('index.ejs')
	})

	app.get('/stats', async (req,res) => {

		let model = await Analytics.getStatsModel()
		res.render('analytics/index.ejs', model)
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

    //free ssl encryption
    app.get('/.well-known/acme-challenge/:content', (req, res) => {
        res.send(config.sslSecret)
    })
}
