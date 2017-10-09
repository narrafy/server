require('dotenv').config({silent: true})

module.exports = exports = {

	app: {
		port: process.env.PORT || 3000,
		name: process.env.APP_NAME
	},

	mongoDb: {
		uri: 'mongodb://localhost:27017/narrafy'
	},

	sendGrid: {
		apiKey: process.env.SENDGRID_API_KEY,
		adminEmail: process.env.ADMIN_EMAIL,
		contactEmail: process.env.CONTACT_EMAIL
	},

	facebook: {
		graphUrl: process.env.FB_GRAPH_MSG_URL,
		threadSettingUrl: process.env.FB_THREAD_SETTINGS_URL,
		admin_id: process.env.ADMIN_FB_ID,
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
    },

	pos: {
		"CC": {
			def: "Coord Conjuncn",
			ex: "and,but,or"
		},
		"CD": {
			def: "Cardinal number",
			ex: "one, two"
		},
		"DT": {
			def: "Determiner",
			ex: "the, some"
		},
		"EX": {
			def: "Existential",
			ex: "there"
		},
		"FW": {
			def:"Foreign Word",
			ex: "mon dieu"
		},
		"IN": {
			def: "Preposition",
			ex: "of,in,by"
		},
		"JJ": {
            def: "Adjective",
            ex: "big"
		},
		"JJR": {
			def:"comparative",
			ex: "bigger"
		},
		"JJS": {
			def: "superlative",
			ex: "biggest"
		},
		"LS": {
			def: "item marker",
			ex: "1, One"
		},
		"MD": {
			def: "Modal",
			ex: "can, should"
		},
		"NN": {
			def: "Noun singular or masc",
			ex: "dog"
		},
		"NNP": {
			def: "Proper noun, sing.",
			ex: "Edinburgh"
		},
		"NNPS": {
			def: "Proper noun, plural",
			ex: "Smiths"
		},
		"NNS": {
			def: "Noun plural",
			ex: "dogs"
		},
		"POS": {
			def: "Possessive ending",
			ex: "'s"
		},
		"PDT": {
			def: "Predeterminer",
			ex: "all, both"
		},
        "PP$": {
			def: "Possessive pronoun",
			ex: " my,one's"
		},
        "PRP": {
			def: "Personal pronoun",
			ex: "I,you,she"
		},
        "RB":{
			def: "Adverb",
			ex: "quickly"
		},
        "RBR": {
			def: "Adverb, comparative",
			ex: "faster"
		},
        "RBS": {
			def: " Adverb, superlative",
			ex: "fastest"
		},
		"RP": {
			def:"Particle",
			ex: "up,off"
		},
        "SYM": {
			def:"Symbol",
			ex: "+,%,&"
		},
        "TO": {
			def: "to",
			ex: "to"
		},
		"UH": {
			def: "Interjection",
			ex: "oh, oops"
		},
		"URL": {
			def:"url",
			ex: "http://www.google.com/"
		},
		"VB": {
			def: "verb",
			ex: "eat"
		},
		"VBD": {
			def: "verb, past tense",
			ex: "ate"
		},
        "VBG": {
			def: "verb, gerund",
			ex: "eating"
		},
		"VBN": {
			def: "verb, past part",
			ex: "eaten"
		},
		"VBP": {
			def: "Verb, present",
			ex: "eat"
		},
        "VBZ": {
			def: "Verb, present",
			ex: "eats"
		},
		"WDT": {
			def: "Wh-determiner",
			ex: "which,that"
		},
		"WP": {
			def: "Wh pronoun",
			ex: "who,what"
		},
        "WP$": {
			def: "Possessive-Wh",
			ex: "whose"
		},
        "WRB": {
				def: "Wh-adverb",
				ex: "how,where"
		},
	}

	}
