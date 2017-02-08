// app/routes.js
module.exports = function(app){
    app.get('/', function(req, res){
    res.render('index.ejs');
    });

    //free ssl encryption
    app.get('/.well-known/acme-challenge/:content', function(req,res){
        res.send('oQBLMccwx4brlIoFUDwSGCl0N3hg5nr19JdMT1SFjI4.DqH5Yu5qS7LsaYrDHVTo6hbZgjtbea5MxucBs24Mxno');
    });

    app.post('/subscribe', function(req, res){
    var results= [];

    //grab data from http request
    var data = {email: req.body.email};
    var connectionString = 'postgres://ifmdaskjdzmyci:aR5F-iCwhIlH4FVXf1XBQkJTdW@ec2-54-228-219-2.eu-west-1.compute.amazonaws.com:5432/d5md0il57415vo';
    var pq = require('pg');
    pg.defaults.ssl = true;
    pg.connect(connectionString,
      function(err, client, done){
        if(err){
          done();
          console.log(err);
          return res.status(500).json({success: false, data:err});
        }
        var insertQuery = client.query("INSERT INTO dronic_users(email) values($1)", [data.email]);
        insertQuery.on('end', function(){
          done();
          return res.redirect('/');
        });
    });
  });
}
