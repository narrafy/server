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

    app.post('/subscribe',  (req, res) => {
        var results = [];

        //grab data from http request
        var data = {email: req.body.email};
        var connectionString = process.env.PSQL_CONNECTION_STRING;
        var pq = require('pg');
        pg.defaults.ssl = true;
        pg.connect(connectionString,
             (err, client, done) => {
                if (err) {
                    done();
                    console.log(err);
                    return res.status(500).json({success: false, data: err});
                }
                var insertQuery = client.query("INSERT INTO dronic_users(email) values($1)", [data.email]);
                insertQuery.on('end', () => {
                    done();
                    return res.redirect('/');
                });
            });
    });

}
