const express = require('express')
const app = express()
const logger = require('pino')()
const flash = require('connect-flash')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const db = require('./app/modules/db/posgres')
const config = require('./app/modules/config')
const path = require('path')

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

/*app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')*/
app.use(flash())

const staticFiles = express.static(__dirname + "web-client/build");
app.use(staticFiles)

//server static assets from express
app.use(express.static(__dirname + "/public"))

/* Bootstrap routes*/
require('./app/modules/router/routes.js')(app, db)

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'web-client/build/index.html'));
});

/* Connect to DB */
db.connect(config.db_settings.posgres)
	.then(() => logger.info('Connected to DB.'))
	.catch((error) => {
		logger.error('Failed to connect to DB.');
		logger.error(error); });

/* Start server */
app.listen(config.app.port)
logger.info(`Narrafy listening on port ${config.app.port}`)