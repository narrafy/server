require('dotenv').config({silent: true});

const SendGrid = require('sendgrid')(process.env.SENDGRID_API_KEY);
const MailHelper = require('sendgrid').mail;

function notifyAdmin(data) {
    var fromEmail = new MailHelper.Email(data.email);
    var toEmail = new MailHelper.Email(process.env.DRONIC_IO_ADMIN);
    var subject = 'A new user subscribed';
    var content = new MailHelper.Content('text/plain', 'My email: ' + data.email + '.I think your service is awesome and I think: '+ data.message);
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
    });
}

module.exports = {
    NotifyAdmin: (data) => {
        notifyAdmin(data);
    }
};
