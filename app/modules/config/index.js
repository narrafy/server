require('dotenv').config({silent: true})

module.exports = exports = {

	app: {
		port: process.env.PORT || 3000,
		name: process.env.APP_NAME
	},

	mongoDb: {
		uri: process.env.MONGODB_URI //|| 'mongodb://localhost:27017/narrafy'
	},

	sendGrid: {
		apiKey: process.env.SENDGRID_API_KEY,
		adminEmail: process.env.ADMIN_EMAIL
	},

	facebook: {
		pageToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
		graphUrl: process.env.FB_GRAPH_MSG_URL,
		verifyToken : process.env.FACEBOOK_PAGE_VERIFY_TOKEN,
		admin_id: process.env.ADMIN_FB_ID
	},

	watson : {
		workspaceId : process.env.WORKSPACE_ID
	},

	nlu :{
		username : process.env.NATURAL_LANGUAGE_UNDERSTANDING_USERNAME,
		password : process.env.NATURAL_LANGUAGE_UNDERSTANDING_PASSWORD,
		url : process.env.NLU_URL,
	},

	conversation : {
		username : process.env.CONVERSATION_USERNAME,
		password : process.env.CONVERSATION_PASSWORD,
		url : process.env.CONVERSATION_URL
	},

	sslSecret : process.env.SSL_SECRET,
	chatBotId: process.env.CHATBOT_ID,

	interviewNodes : {

        "internalization" : [
            "problem",
            "context",
            "trigger",
            "influence",
            "influence_on_relationships",
            "influence_on_relationships_example",
            "difficulties",
            "invitation_to_exception",
        ],
        "externalization": [
            "problem_story",
            "vulnerable_to",
            "story_context",
            "takeover",
            "jeopardize_judgement",
            "effect_on_relationships",
            "cause_difficulties",
            "blind_resources",
            "unique_outcome",
            "invite_action"
        ]
    }
}