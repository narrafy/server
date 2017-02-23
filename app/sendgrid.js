require('dotenv').config({silent: true});

const SendGrid = require('sendgrid')(process.env.SENDGRID_API_KEY);
const MailHelper = require('sendgrid').mail;

function notifyAdmin(data) {
    var fromEmail = new MailHelper.Email('noreply@dronic.io');
    var toEmail = new MailHelper.Email('contact@dronic.io');
    var subject = 'A new user subscribed';
    var content = new MailHelper.Content('text/plain', 'User: ' + data.email + '. Said: '+ data.message);
    var mail = new MailHelper.Mail(fromEmail, subject, toEmail, content);
    var request = SendGrid.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });
    SendGrid.API(request,(error, response) => {
        if(error)
            return console.log(error);
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });

}


module.exports = {

    NotifyAdmin: (data) => {
        notifyAdmin(data);
    }
};
