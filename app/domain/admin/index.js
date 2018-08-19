const mailService = require('../../service/email')

module.exports = {
    notifySubscriber: function(data){
        mailService.notifySubscriber(data.email)
    },
    notifyUser: function(email, name){
        mailService.sendEmail(email, name)
    }
}