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

function notifyAdmin(data) {
    var fromEmail = new MailHelper.Email(data.email);
    var toEmail = new MailHelper.Email(process.env.DRONIC_IO_ADMIN);
    var subject = 'user subscribed';
    var content = new MailHelper.Content('text/plain', 'My email: ' + data.email + '. My message: '+ data.message);
    var mail = new MailHelper.Mail(fromEmail, subject, toEmail, content);
   sendEmail(mail);
}
function notifyUser(email) {
    var fromEmail = new MailHelper.Email(process.env.DRONIC_IO_ADMIN);
    var toEmail = new MailHelper.Email(email);
    var subject = "message received";
    var content = new MailHelper.Content('text/plain', "Hey, I'm Dronic. Your narrative assistant. Just " +
        "wanted to let you know that you have some good taste! Ok, I'm back to training. Getting smarter and stuff.");
    var mail = new MailHelper.Mail(fromEmail, subject, toEmail, content);
    sendEmail(mail);
}

module.exports = {
    NotifyAdmin: (data) => {
        notifyAdmin(data);
    },
    NotifyUser: (email) =>{
     notifyUser(email);
    }
};
