const Request = require('request-promise-native')
const config = require('../config')
const log = require('../log')


const chatBotId = config.chatBotId
const graphUrl = config.facebook.graphUrl
const pageToken = config.facebook.pageToken

async function sendWebView(id, data) {
	let webView = createWebView(id, data)
	return sendMessage(id, webView)
}

async function sendMessage(id, message) {

	if (id === chatBotId) return

	await typingOff(id)

	try {
		await Request({
			url: graphUrl,
			qs: { access_token: pageToken },
			method: 'POST',
			json: {
				recipient: { id: id},
				message: message
			}
		})
	} catch (error) {
		log.error('Error sending message: ')
		log.error(error)
	}

}

function createWebView(id, data) {
	
    return {
        "attachment":{
            "type":"template",
                "payload":{
                "template_type":"generic",
                    "elements":[
                    {
                        "title": data.title,
                        "subtitle": data.subtitle,
                        "image_url": data.image_url,
                        "buttons": [
                            {
                                "type": "element_share",
                                "share_contents": {
                                    "attachment": {
                                        "type": "template",
                                        "payload": {
                                            "template_type": "generic",
                                            "elements": [
                                                {
                                                    "title": "I figured out that I'm too " + data.problem,
                                                    "subtitle": "And I have a fountain of hope",
                                                    "image_url": data.image_url,
                                                    "default_action": {
                                                        "type": "web_url",
                                                         "url": data.share_url + "?ref=" + id
                                                    },
                                                    "buttons": [
                                                    	{
                                                    		"type": "web_url",
                                                            "url": data.share_url + "?ref=" + id,
                                                            "title": "I figured out that I'm too " + data.problem
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        }
    }
}

async function startTyping(id) {

	if (id === chatBotId) return

	try {
		await Request({
			url: graphUrl,
			qs: {access_token: pageToken},
			method: 'POST',
			json: {
				recipient: {id: id},
				sender_action: "typing_on"
			}
		})
	} catch (error) {
		log.error('Error sending message: ')
		log.error(error)
	}

}

async function typingOff(id) {

	if (id === chatBotId) return

	try {

		await Request({
			url: graphUrl,
			qs: {access_token: pageToken},
			method: 'POST',
			json: {
				recipient: {id: id},
				sender_action: "typing_off"
			}
		})

	} catch (error) {
		log.error('Error sending message: ')
		log.error(error)
	}
}

async function greet(text) {
	try {
		await Request({
			url: 'https://graph.facebook.com/v2.8/me/thread_settings',
			qs: {access_token: pageToken},
			method: 'POST',
			json: {
				setting_type: "greeting",
				greeting: {
					text: text
				},
				thread_state: "existing_thread"
			}

		})
	} catch (error) {
		log.error('Error sending message: ')
		log.error(error)
	}
}

async function addPersistentMenu() {

	try {
		Request({
			url: 'https://graph.facebook.com/v2.8/me/thread_settings',
			qs: {access_token: pageToken},
			method: 'POST',
			json: {
				setting_type: "call_to_actions",
				thread_state: "existing_thread",
				call_to_actions: [
                    {
                        "title": "I want to talk to Alicia",
                        "type": "postback",
                        "payload": "CONTACT_REQUEST"
                    },
					{
						type: "web_url",
						title: "Our website 📖",
						url: "http://www.fountainofhope.no"
					},
					{
						"title": "Let's try again",
						"type": "postback",
						"payload": "CLEAR_CONTEXT"
					}
				]
			}
		})
	} catch (error) {
		log.error('Error sending message: ')
		log.error(error)
	}
}

/* it will remove the persistent menu that appears on facebook */
async function removePersistentMenu() {
	try {

		await Request({
			url: 'https://graph.facebook.com/v2.8/me/thread_settings',
			qs: {access_token: pageToken},
			method: 'POST',
			json: {
				setting_type: "call_to_actions",
				thread_state: "existing_thread",
				call_to_actions: []
			}
		})

	} catch (error) {
		log.error('Error sending message: ')
		log.error(error)
	}
}

module.exports = exports = {

	removePersistentMenu: removePersistentMenu,
	addPersistentMenu: addPersistentMenu,
	greet: greet,

	async sendMessage(id, message) {
		await startTyping(id)
		await sendMessage(id, message)
	},
	async sendWebView(id, data){
		await startTyping(id)
		await sendWebView(id, data)
	}

}