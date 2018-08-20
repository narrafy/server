const mailService = require('../../service/email')

module.exports = {

    notify: mailService.contactAdmin,
    notifySubscriber: mailService.notifySubscriber,
    notifyUser: mailService.sendEmail

}