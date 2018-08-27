const Email = require('../../service/email')
const Config = require('../../service/config')

function getContactHtml(message) {
    let startBody =  "<html><body><div>"

    let msg = "<h4>" + "You have a new message: " +"</h4>"

    let htmlBody = "<p>" + message + "</p>";

    let endBody = "</div><body/></html>"

    return startBody + msg + htmlBody + endBody
}

function contactAdmin(email, message) {
    let emailBody = getContactHtml(message)
    const msg = {
        to: Config.sendGrid.contactEmail,
        from: email,
        subject: "Message from " + email,
        html: emailBody,
    }
    return Email.sendMessage(msg)
}

function notifyConversation(message) {
    const msg = {
        to: Config.sendGrid.adminEmail,
        from: Config.sendGrid.contactEmail,
        subject: Config.app.name,
        text: message,
    }
    return Email.sendMessage(msg)
}

module.exports = {
    notify: contactAdmin,
    alert: notifyConversation,

}