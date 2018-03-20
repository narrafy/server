const db = require('../db')
const log = require('../log')
const Conversation = require('../conversation/conversation')
const Nlg = require('../natural-language/generation')
const mailService = require('../email')
const config = require('../config')
const fb = require('../facebook-api')

module.exports = (app) => {

	app.get('/webhook', async function (req, res) {

		let customerVerifyToken =  req.query['hub.verify_token'];
		let customerConfig = await db.getCustomerByToken(customerVerifyToken);
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
		await db.addInquiry(data)
        mailService.contact(data)
        mailService.user(data.email)
		res.sendStatus(200)
	})

    app.get('/story', async function (req, res) {

        var conversation_id = req.query['conversation_id']
        if (conversation_id !== null) {

            let drafts = await db.getStory(conversation_id)
            let model = {}
            if(drafts.length === 0){
                //no user drafts, just stub
                let stub = await Conversation.getStoryStub(conversation_id)
				if(stub){
                    model = {
                        "user_name": stub.user_name,
                        "email": stub.email,
                        "conversation_id": conversation_id,
                        "internalization": stub.story.internalization,
                        "externalization": stub.story.externalization,
						"cc": stub.story.cc
                    }
                    await db.saveStory(stub)
                }
            } else {
                model = drafts[0]
            }
            res.render('profile/user.ejs', model)
        } else {
            res.sendStatus(500)
        }
    })

	app.post('/api/story/send', async (req, res) => {

        let data = {
            email: req.body.email,
			cc: req.body.cc,
            conversation_id: req.body.conversation_id,
			user_name: req.body.user_name,
			internalization: req.body.internalization,
			externalization: req.body.externalization,
            date: new Date(),
			cc: req.body.cc
        }
        await db.saveStory(data)

        mailService.bot(data, "P.S. at Narrafy we help people better understand themselves.")
		if(data.cc){
        	data.email = data.cc;
        	mailService.bot(data, "P.S. at Narrafy we help people better understand themselves.");
		}

		await db.addSubscriber({
			email: data.email,
			date: data.date
		})

		res.sendStatus(200)
    })

    app.post('/api/story/save', async (req, res) => {

        let data = {
            email: req.body.email,
            conversation_id: req.body.conversation_id,
            user_name: req.body.user_name,
            internalization: req.body.internalization,
            externalization: req.body.externalization,
            date: new Date(),
			cc: req.body.cc
        };
        await db.saveStory(data)
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
				mailService.transcript(email, transcript)
			res.sendStatus(200)
		} else {
			res.sendStatus(500)
		}
	})

	app.get('/api/story/get', async (req, res) => {

		let conversation_id = "561d304c-f378-4b84-a6ae-04f67fec0182"
		let interview_type = "internalization"

		if (conversation_id !== null) {
			let data = {
				conversation_id: conversation_id,
				interview_type: interview_type
			};

			try {
                const story = await Nlg.getStoryStub(data);
                res.json(story);
			} catch (e) {
				console.log(e.stack);
			}

		} else {
			res.sendStatus(500)
		}
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

    //free ssl encryption
    app.get('/.well-known/acme-challenge/:content', (req, res) => {
        res.send(config.sslSecret)
    })
}
