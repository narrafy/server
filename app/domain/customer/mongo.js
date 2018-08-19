const client = require('../db')

async function getCustomerConfigurationFile(customer_id){
    return client.connection.collection(collection.customer)
        .findOne({customer_id : customer_id})
}

async function getCustomerConfigByToken(verifyToken){
    return client.connection.collection(collection.customer)
        .findOne({ "facebook.verify_token" : verifyToken})
}

module.exports = {
    getConfig: getCustomerConfigurationFile,
    getCustomerByToken: getCustomerConfigByToken,
}
