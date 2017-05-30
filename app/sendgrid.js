require('dotenv').config({silent: true});

const SendGrid = require('sendgrid')(process.env.SENDGRID_API_KEY);
const MailHelper = require('sendgrid').mail;

function sendEmail(mail){
    var request = SendGrid.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });
    SendGrid.API(request,(error, response) => {
        if(error)
            return console.log(error);
        console.log(response.statusCode);
    });
}

function notifyAdmin(email, message) {
    var fromEmail = new MailHelper.Email(email);
    var toEmail = new MailHelper.Email(process.env.DRONIC_IO_ADMIN);
    var subject = 'Narrafy Notification';
    var content = new MailHelper.Content('text/plain', message);
    var mail = new MailHelper.Mail(fromEmail, subject, toEmail, content);
   sendEmail(mail);
}

function notifySubscriber(email) {
    var fromEmail = new MailHelper.Email(process.env.DRONIC_IO_ADMIN);
    var toEmail = new MailHelper.Email(email);
    var subject = "Narrafy got your email";
    var content = new MailHelper.Content('text/plain', "Hey, I'm Narrafy. I got your email." +
        " I will contact you when I have something cool to share, otherwise I don't bother innocent people!");
    var mail = new MailHelper.Mail(fromEmail, subject, toEmail, content);
    sendEmail(mail);
}

function notifyUser(email) {
    var fromEmail = new MailHelper.Email(process.env.DRONIC_IO_ADMIN);
    var toEmail = new MailHelper.Email(email);
    var subject = "we got your message!";
    var content = new MailHelper.Content('text/plain', "Hey, I'm Narrafy. I got your email. I will get back to you shortly!");
    var mail = new MailHelper.Mail(fromEmail, subject, toEmail, content);
    sendEmail(mail);
}

module.exports = {
    NotifyAdmin: (data) => {
        notifyAdmin(data.email, data.message);
    },

    NotifyUser: (email) =>{
     notifyUser(email);
    },
    NotifySubscriber: (email) => {
        notifySubscriber(email)
    }
};
