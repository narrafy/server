const crypto = require('crypto')
const logger = require('../log/index')

function generateCookieValue() {
	const current_date = (new Date()).valueOf().toString()
	const random = Math.random().toString()
	return crypto.createHash('sha1').update(current_date + random).digest('hex')
}

function setCookieIfMissing(req, res) {

	const cookie = req.cookies.conversation_id

	if (!cookie) {
		res.cookie('conversation_id', generateCookieValue(), {maxAge: 900000, httpOnly: true})
		logger.info('cookie created successfully')
	} else {
		logger.info('cookie exists', cookie)
	}

}

module.exports = exports = {

	setConversationCookie(req, res) {
		setCookieIfMissing(req, res)
	},
	readConversationCookie(req, res) {
		return req.cookies.conversation_id
	}

}