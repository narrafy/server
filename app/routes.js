// app/routes.js
require('dotenv').config({silent: true});

module.exports =  (app) => {

    //free ssl encryption
    app.get('/.well-known/acme-challenge/:content', (req, res) => {
        res.send(process.env.SSL_SECRET);
    });

    app.get('/', (req, res) => {
        res.render('index.ejs');
    });

    app.get('/privacy-policy/ ', (req,res) => {
        res.send('privacy.ejs');
    });
}
