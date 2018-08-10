const log = require('../log')
const Conversation = require('../conversation/conversation')
const Analytics = require ('../analytics')
const mailService = require('../email')
const config = require('../config')
const fb = require('../facebook-api')
const mig = require('../db/migrate')

module.exports = (app, db) => {

	app.get('/api/webhook', async function (req, res) {

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

	app.post('/api/webhook', async function (req, res) {

        let customer_id = body.context.customer_id;

        let context = await setContextConfig(customer_id)

		await Conversation.messengerRequest(req.body, context)
		res.sendStatus(200)
	})

	app.post('/api/message', async function (req, res) {

        let session_id = req.sessionID;
		let body = req.body;

        let data = {};
        if (body)
        {
            if (body.input){
                data.text = body.input.text
            }

            if (body.context)
            {
                data.context = body.context
                let customer_id = body.context.customer_id
                const {access_token, workspace} = await setContextConfig(customer_id)
                data.access_token = access_token
                data.workspace = workspace
            }
        }

		const {conversation, messages} = await Conversation.web(session_id, data, db)

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
		await db.addInquiry(data)
        mailService.contact(data)
        mailService.user(data.email, data.name)
		res.sendStatus(200)
	})

	app.post('/api/story/send', async (req, res) => {

        let data = await Analytics.saveStory(req.body, db)
        mailService.bot(data)
		res.sendStatus(200)
    })

    app.post('/api/story/save', async (req, res) => {
		await Analytics.saveStory(req.body, db)
        res.sendStatus(200)
    })

	app.post('/api/subscribe', async (req, res) => {
		let data = {
            email: req.body.email,
            date: new Date(),
        };
		await db.addSubscriber(data)
        mailService.admin("Congrats, another user just subscribed!")
        mailService.subscriber(data.email)
		res.sendStatus(200)
	})

	app.get('/api/transcript/get', async (req, res) => {
		var conversation_id = req.query['conversation_id']
		if (conversation_id !== null) {
			const transcript = await db.getTranscript(conversation_id, db)
			res.json(transcript)
		} else {
			res.sendStatus(500)
		}
	})

	app.get('/api/transcript/email',  async (req, res) => {

		var conversation_id = req.query['conversation_id']
		var email = req.query['email']
		if (conversation_id !== null) {
			const transcript = await db.getTranscript(conversation_id, db)
			if(transcript)
				mailService.transcript(email, transcript)
			res.sendStatus(200)
		} else {
			res.sendStatus(500)
		}
	})

    app.get('/story', async function (req, res) {

        let model = await Analytics.getStoryModel(req.query['conversation_id'], db)
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

		let model = await Analytics.getStatsModel(db)
        model.limit_questions = 40;
        model.limit_minutes_spent = 40;

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

    async function setContextConfig(customer_id) {
        //refactor use projection to return only this two fields
        let customerConfig = await db.getConfig(customer_id)
        if(customerConfig)
            return { access_token: customerConfig.facebook.access_token, workspace: customerConfig.conversation.workspace}
        return null
    }

    app.get('/api/migrate/customer', async(req, res) => {
        await mig.migrateCustomer();
    })

    /*

	app.get('/api/migrate/conversation', async(req, res) => {
		await mig.migrateConversation();
	})

    app.get('/api/migrate/story', async(req, res) => {
        await mig.migrateStory();
    })

    app.get('/api/migrate/template', async(req, res) => {
        await mig.migrateStoryTemplate();
    })

    app.get('/api/migrate/subscriber', async(req, res) => {
        await mig.migrateSubscriber();
    })

    app.get('/api/migrate/transcript', async(req, res) => {
        await mig.migrateTranscript();
    })

    */
}
