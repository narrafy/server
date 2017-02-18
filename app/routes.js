// app/routes.js
require('dotenv').config({silent: true});

module.exports =  (app) => {

    app.get('/', (req, res) => {
        res.render('index.ejs');
    });
    app.get('/chat', (req, res) => {
        res.render('chat.ejs');
    });

    //free ssl encryption
    app.get('/.well-known/acme-challenge/:content', (req, res) => {
        res.send(process.env.SSL_SECRET);
    });

}
