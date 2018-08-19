
const CustomerModel = require('./model')

module.exports = exports = {
    findOne: CustomerModel.findOne,
    findById: CustomerModel.findById,
    findByToken: CustomerModel.findByToken,
    save: CustomerModel.save,
}
