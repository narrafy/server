const Request = require('request-promise-native')
const config = require('../../service/config')
const log = require('../../service/log')

const chatBotId = config.chatBotId
const graphUrl = config.facebook.graphUrl
const threadSettingUrl = config.facebook.threadSettingUrl


/*
*
* https://graph.facebook.com/v2.6/<USER_ID>?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=<PAGE_ACCESS_TOKEN>
*
*
*
* */

async function sendWebView(data, webView) {
	data.message = createWebView(webView)
	return sendMessage(data)
}

async function sendMessage(data) {

	if (data.id === chatBotId) return

	await typingOff(data)

	try {
		await Request({
			url: graphUrl,
			qs: { access_token: data.access_token },
			method: 'POST',
			json: {
				recipient: { id: data.id },
				message: data.message
			}
		})
	} catch (error) {
		log.error('Error sending message: ')
		log.error(error)
	}
}

function createWebView(data) {
	
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
                                                         "url": data.share_url + "?ref=" + data.id
                                                    },
                                                    "buttons": [
                                                    	{
                                                    		"type": "web_url",
                                                            "url": data.share_url + "?ref=" + data.id,
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

async function startTyping(data) {

	if (data.id === chatBotId) return

	try {
		await Request({
			url: graphUrl,
			qs: {access_token: data.access_token},
			method: 'POST',
			json: {
				recipient: {id: data.id},
				sender_action: "typing_on"
			}
		})
	} catch (error) {
		log.error('Error sending message: ')
		log.error(error)
	}

}

async function typingOff(data) {

	if (data.id === chatBotId) return

	try {

		await Request({
			url: graphUrl,
			qs: { access_token: data.access_token },
			method: 'POST',
			json: {
				recipient: {id: data.id},
				sender_action: "typing_off"
			}
		})

	} catch (error) {
		log.error('Error sending message: ')
		log.error(error)
	}
}

async function init(data) {

	await greet(data)
    await removePersistentMenu(data).catch(log.error)
    await addPersistentMenu(data).catch(log.error)

}

async function greet(data) {
	try {
		await Request({

			url: threadSettingUrl,
			qs: { access_token: data.access_token },
			method: 'POST',
			json: {
				setting_type: "greeting",
				greeting: {
					text: data.greeting
				},
				thread_state: "existing_thread"
			}

		})
	} catch (error) {
		log.error(error.stack)
	}
}

async function addPersistentMenu(data) {

	try {
		Request({
			url: threadSettingUrl,
			qs: { access_token: data.access_token },
			method: 'POST',
			json: {
				setting_type: "call_to_actions",
				thread_state: "existing_thread",
				call_to_actions: data.cta
			}
		})
	} catch (error) {
		log.error(error.stack)
	}
}

/* it will remove the persistent menu that appears on facebook */
async function removePersistentMenu(data) {
	try {

		await Request({
			url: threadSettingUrl,
			qs: { access_token: data.access_token },
			method: 'POST',
			json: {
				setting_type: "call_to_actions",
				thread_state: "existing_thread",
				call_to_actions: []
			}
		})
	} catch (error) {
		log.error(error.stack)
	}
}

module.exports = exports = {

	init: init,

	async sendMessage(data) {
		await startTyping(data)
		setTimeout( async ()=>{
            await sendMessage(data)
		}, 1000)
	},
	async sendWebView(data, webviewData){
		await startTyping(data)
		await sendWebView(data, webviewData)
	}

}