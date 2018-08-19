const express = require('express')
const passport = require('passport')
const logger = require('pino')()
const flash = require('connect-flash')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const db = require('./app/service/db/posgres')
const config = require('./app/service/config')
const cors = require('cors')

const app = express()

app.use(passport.initialize())

/* Bootstrap middleware */
app.use(morgan('dev'))
app.use(cookieParser())

require('./app/service/auth/passport')

app.use(bodyParser.urlencoded({
	'extended': 'true'
}))
app.use(bodyParser.json())
app.use(bodyParser.json({
	type: 'application/vnd.api+json'
}))

app.use(flash())
app.use(cors())

const staticFiles = express.static(__dirname + "/web-client/build");
app.use(staticFiles)

//free ssl encryption
app.get('/.well-known/acme-challenge/:content', (req, res) => {
    res.send(config.sslSecret)
})

/* Bootstrap routes*/

const customer = require('./app/domain/customer/routes');
const conversation = require('./app/domain/conversation/routes');
const user = require('./app/domain/user/routes');
const transcript = require('./app/domain/transcript/routes');
const story = require('./app/domain/story/routes');
const facebook = require('./app/domain/facebook/routes')

app.use("/api/customer", customer);
app.use("/api/conversation", conversation);
app.use("/api/user", user);
app.use("/api/transcript", transcript);
app.use("/api/story", story);
app.use("/api/fb", facebook)

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error : err });
});

/* Connect to DB */
db.connect(config.db_settings.posgres_uri, process.env.NODE_ENV !== 'development')
	.then(() => logger.info('Connected to DB.'))
	.catch((error) => {
		logger.error('Failed to connect to DB.');
		logger.error(error);
	});

/* Start server */
app.listen(config.app.port)
logger.info(`Narrafy listening on port ${config.app.port}`)