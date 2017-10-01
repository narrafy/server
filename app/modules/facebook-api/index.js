const Request = require('request-promise-native')
const config = require('../config')
const log = require('../log')

const page_token = config.facebook.pageToken
const chatBotId = config.chatBotId
const graphUrl = config.facebook.graphUrl

async function sendMessage(id, message) {

	if (id === chatBotId) return

	await typingOff(id)

	try {
		await Request({
			url: graphUrl,
			qs: {access_token: page_token},
			method: 'POST',
			json: {
				recipient: {id: id},
				message: message
			}
		})
	} catch (error) {
		log.error('Error sending message: ')
		log.error(error)
	}

}

async function startTyping(id) {

	if (id === chatBotId) return

	try {
		await Request({
			url: graphUrl,
			qs: {access_token: page_token},
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
			qs: {access_token: page_token},
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
			qs: {access_token: page_token},
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
			qs: {access_token: page_token},
			method: 'POST',
			json: {
				setting_type: "call_to_actions",
				thread_state: "existing_thread",
				call_to_actions: [
					{
						type: "web_url",
						title: "some thoughts  📖",
						url: "https://blog.isegoria.com"
					},
					{
						"title": "Let's try again",
						"type": "postback",
						"payload": "CLEAR_CONTEXT"
					},
					{
						"title": "I want to talk to a person",
						"type": "postback",
						"payload": "CONTACT_REQUEST"
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
			qs: {access_token: page_token},
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

}