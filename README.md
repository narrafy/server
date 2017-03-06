# dronic
we are building the 911 of broken hearts. a narrative assistant to help people in the first 24 hours after a breakup.
To make the entire thing work. Clone the repo and add a .env configuration file with the following settings.

CONVERSATION_PASSWORD=(get it from your ibm bluemix console)

CONVERSATION_USERNAME=(get it from your ibm bluemix console)

CONVERSATION_URL=https://gateway.watsonplatform.net/conversation/api

MONGODB_URI=(mongo db uri, I used mongolab addon for heroku, a free tier for up to 500 mb of storage)

FACEBOOK_PAGE_ACCESS_TOKEN=( get it in your app dashboard)

FACEBOOK_PAGE_VERIFY_TOKEN= ( some random string you set up)

PAPERTRAIL_API_TOKEN= (is set by heroku papertrail addon, pretty cool addon to watch your logs)

SENDGRID_API_KEY= (this is one you ll get from sendgrid dashbboard_

SENDGRID_PASSWORD= (something heroku will add when you install sendgrid addon)

SENDGRID_USERNAME= (something heroku will add when you install sendgrid addon)

SSL_SECRET= (I used to store the secret key for Letsencrypt free ssl certificates)

WORKSPACE_ID= ( get it from ibm bluemix console, it's the watson coversation workspace id )

FB_GRAPH_MSG_URL= https://graph.facebook.com/v2.8/me/messages

DRONIC_IO_ADMIN= (the "from" email sendgrid will use to send out messages when a new user subscribed)

DRONIC_CHATBOT_ID= (your chatbot id)

