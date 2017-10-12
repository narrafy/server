const express = require('express')
const app = express()
const logger = require('pino')()
const flash = require('connect-flash')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const db = require('./app/modules/db')
const config = require('./app/modules/config')
const Facebook = require('./app/modules/facebook-api')

/* Bootstrap middleware */
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser())
app.use(bodyParser.urlencoded({
	'extended': 'true'
}))
app.use(bodyParser.json())
app.use(bodyParser.json({
	type: 'application/vnd.api+json'
}))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(flash())
app.use(express.static(__dirname + "/public"))
app.use('/whitepaper', express.static(__dirname + '/views/foundation/whitepaper_en.pdf'));

/* Connect to DB */
db
	.connect(config.mongoDb.uri)
	.then(() => logger.info('Connected to DB.'))
	.catch((error) => {
		logger.error('Failed to connect to DB.')
		logger.error(error)
	})


/* Bootstrap routes*/
require('./app/modules/router/routes.js')(app)

/* Start server */
app.listen(config.app.port)
logger.info(`Narrafy listening on port ${config.app.port}`)