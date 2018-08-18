const express = require('express')
const app = express()
const logger = require('pino')()
const flash = require('connect-flash')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const db = require('./app/modules/utils/db/posgres')
const config = require('./app/modules/config')

/* Bootstrap middleware */
app.use(morgan('dev'))
app.use(cookieParser())

app.use(bodyParser.urlencoded({
	'extended': 'true'
}))
app.use(bodyParser.json())
app.use(bodyParser.json({
	type: 'application/vnd.api+json'
}))

app.use(flash())

const staticFiles = express.static(__dirname + "/web-client/build");
app.use(staticFiles)

/* Bootstrap routes*/
require('./app/modules/router/routes.js')(app, db)

/* Connect to DB */
db.connect(config.db_settings.posgres_uri)
	.then(() => logger.info('Connected to DB.'))
	.catch((error) => {
		logger.error('Failed to connect to DB.');
		logger.error(error); });

/* Start server */
app.listen(config.app.port)
logger.info(`Narrafy listening on port ${config.app.port}`)