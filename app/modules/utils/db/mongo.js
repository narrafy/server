const mongoClient = require('mongodb')

require('dotenv').config({silent: true})

let dbConnection = null

async function connect(uri) {
	return mongoClient
		.connect(uri)
		.then((db) => dbConnection = db)
}


module.exports = exports = {
    connect: connect,
    connection: dbConnection,
}
