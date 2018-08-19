const db = require('../../service/db/posgres')
const bcrypt = require('bcrypt')

async function save(doc){

    let config = {
        facebook: doc.facebook,
        conversation: doc.conversation
    }

    let query = {
        text: 'INSERT INTO customer(id, name, config) values ($1, $2, $3)',
        values: [doc.customer_id, doc.name, JSON.stringify(config)]
    }

    return await db.singleResultQuery(query);
}

async function create(email, password) {
    const salt = bcrypt.genSaltSync();
    const pwdHash = bcrypt.hashSync(password, salt);

    let query = {
        text: 'INSERT INTO customer(email, password) values ($1, $2)',
        values: [email, pwdHash]
    }

    return await db.singleResultQuery(query);
}

async function findById(id) {
    let query = {
        text: 'SELECT * FROM customer where id = $1;',
        values: [id]
    };

    return await db.singleResultQuery(query);
}

async function findOne(email) {

    let query = {
        text: 'SELECT * FROM customer where email = $1;',
        values: [email]
    };

    return await db.singleResultQuery(query);
}

async function findByToken(verifyToken) {
    let query = {
        text: 'SELECT * FROM customer WHERE config @> \'{"config.facebook.verify_token":$1}\';',
        values: [verifyToken]
    };

    return await db.singleResultQuery(query);
}

module.exports = exports = {
    findById: findById,
    findOne: findOne,
    findByToken: findByToken,
    save: save,
    create: create
}
