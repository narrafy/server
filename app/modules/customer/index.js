const db = require('../db')

function addInquiry(data)
{
    db.addInquiry(data)
}

function addSubscriber(data) {

    db.addSubscriber(data)
}

function getCustomerByToken(customerVerifyToken)
{
    return db.getCustomerByToken(customerVerifyToken)
}

function getConfig(customer_id)
{
    return db.getConfigurationFile(customer_id)
}

module.exports = exports = {

    getCustomerByToken: getCustomerByToken,

    getConfig: getConfig,

    addInquiry: addInquiry,

    addSubscriber: addSubscriber,

}
