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

    app.get('/api/story/send', async (req, res) => {

        let email = "alukura@hotmail.com"

		let story_internalization = "Rose you say you are too opinionated about your experience of the world, your beliefs and perceptions. " +
			"It usually happens when you are feeling as though your are not being understood or listened to. " +
			"This does affect your life, because it makes you do things you would not do otherwise. You state your beliefs in several different ways. " +
			"It affects people and relationships you care about. Some people avoid discussing specific topics with you. It makes your life difficult. " +
			"Possibly difficult arguments with your daughter who is also opinionated. If by a miracle you would wake up and wouldn't opinionated anymore" +
			" you would feel silenced minimal influence in the world."

		let story_externalization = "Once upon a time, there was a hero - Rose. She was doing just fine in her own kingdom. However, one day, " +
			"Rose got challenged by a villain - the Full-on. It was “maybe not being heard, made to feel unimportant as a child that made her " +
			"vulnerable” to Full-on. The villain usually shows up when the person Rose is speaking to, doesn't understand or acknowledge " +
			"what she is saying. The villain is smart. It takes over by using tricks like making Rose feeling discounted or minimized. " +
			"It has an effect on Rose's relationships. Full-on escalates arguments with her daughter." +
			" And it makes Rose’s life challenging. She feels less important and less respected by her daughter. It blinds her in the moment of conflict. " +
			"But Rose has her own way to fight back. When she is with scaringly angry people, she practice detached compassion, strongly repressing her feelings " +
			"for safety sake. Last time she managed to fight back was when she was with a friend, allowing her to initiate the topic of conversation. " +
			"She knows what she experience to be true for her without expecting others to understand or agree, just knowing is enough. She prefers to simply " +
			"sit with her knowledge without needing to necessarily share it.\""

		let stories = [
			{
				interview_type:"internalization",
				story : story_internalization
			},
			{
				interview_type: "externalization",
				story: story_externalization
			}
		]

		let ps ="P.S. Rose, you are the first one I send a letter to! Sorry for the delay. Technical problems."

		mailService.bot(stories, ps, email)
		res.sendStatus(200)
    })

	app.get('/api/story/get', async (req, res) => {
		let conversation_id = "f1d1ca41-277a-4097-8844-592569cfa2c7" // req.query['conversation_id'];
		let interview_type = "externalization" // req.query['interview_type'];

		let templateArray = {
			"internalization" : "$user_name you say you are too _problem.sentence about _context.sentence. " +
			"It usually happens when you are _trigger.sentence. This does affect your life, because it makes you " +
			"do things you would not do otherwise. _influence.sentence. It affects people and relationships you care about." +
			" _influence_on_relationships_example.sentence. It makes your life difficult. _difficulties.sentence. " +
			"But, there is a hope! You see it. _invitation_to_exception.sentence. You are in the right place. I will help you!",

			"externalization" : "Once upon a time, there was a hero - $user_name emoji_hero. He was doing just fine in his own kingdom. " +
			"However, one day, $user_name got challenged by a villain - $problem_story.text. It was \\\"$vulnerable_to.sentence\\\" that made " +
			"him vulnerable to $problem_story.text. It usually shows up when $story_context.sentence. The villain is smart. It takes over by using " +
			"tricks like: $takeover.sentence. It even managed $user_name do things against his better judgement! For ex: $jeopardize_judgement.sentence. " +
			"It has an effect on $user_name's relationships. For ex: $effect_on_relationships.sentence And it makes your hero’s life" +
			" challenging:$cause_difficulties.sentence. But the hero has his own way to fight back. For ex: $unique_outcome.sentence " +
			"Several times! The hero is silently preparing a way to fight back and has a plan for the future: $invite_action.sentence"
		}


		if (conversation_id !== null) {
			let data = {
				template: templateArray[interview_type],
				conversation_id: conversation_id,
				interview_type: interview_type
			};

			try {
                const story = await Nlg.parseReply(data);
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
