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
		verifyToken : process.env.FACEBOOK_PAGE_VERIFY_TOKEN
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

	interview : {
		type: {
            internalization: {
            	flagName: "recap_internal_problem",
				vars: [
                     "internal_problem_context",
                     "internal_problem_prerequisite",
                     "internal_problem_influence",
                     "influence_on_relationships",
                     "influence_on_relationships_example",
                     "internal_problems_difficulties",
                     "internal_problem_invitation_to_unique_outcome",
				]
			},
            externalization: {
            	flagName: "recap_external_problem",
                vars: [
                     "external_problem",
                     "vulnerable_to_external_problem",
					 "external_problem_context",
                     "external_problem_takeover",
                     "external_problem_jeopardize_judgement",
                     "external_problem_effect_on_relationships",
                     "external_problem_cause_difficulties",
                     "external_problem_blind_resources",
                     "external_problem_unique_outcome",
                     "external_problem_invite_action"
                ]
			},
		},

    },
}