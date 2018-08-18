const db = require('../utils/db/posgres')


async function getCustomerConfigurationFile(customer_id)
{
    let query = {
        text: 'SELECT * FROM customer where customer_id = $1;',
        values: [customer_id]
    };

    return await db.singleResultQuery(query);
}

async function getCustomerConfigByToken(verifyToken)
{
    let query = {
        text: 'SELECT * FROM customer WHERE facebook @> \'{"facebook.verify_token":$1}\';',
        values: [verifyToken]
    };

    return await db.singleResultQuery(query);
}

async function saveCustomer(doc){

    let query = {
        text: 'INSERT INTO customer(customer_id, name, email, facebook, conversation) values ($1, $2, $3, $4, $5)',
        values: [doc.customer_id, doc.name, doc.email, JSON.stringify(doc.facebook), JSON.stringify(doc.conversation)]
    }

    return await db.singleResultQuery(query);
}

module.exports = exports = {

    getConfig: getCustomerConfigurationFile,
    getCustomerByToken: getCustomerConfigByToken,
    saveCustomer: saveCustomer,
}
