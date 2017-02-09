// app/routes.js
var r = require('request');

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

    app.get('/webhook', function(req,res){

        if(req.query['hub.verify_token']==='testbot_verify_token'){
            res.send(req.query['hub.challenge']);
        }else{
            res.send('Invalid verify token!');
        }
    });

    app.post('/webhook', function(req,res){
       var events = req.body.entry[0].messaging;
        for(i=0; i<events.length; i++){
            var event = events[i];
            if(event.message){
                var word = event.message.text.split(' ');
                if( word[0]==='kitten'){
                    kittenMessage(event.sender.id,event.message.text);
                } else if(event.message && event.message.text){
                    sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
                }
            }
        }
        res.sendStatus(200);
    });

    function kittenMessage(recipientId, text) {

        text = text || "";
        var values = text.split(' ');

        if (values.length === 3 && values[0] === 'kitten') {
            if (Number(values[1]) > 0 && Number(values[2]) > 0) {

                var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);

                message = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": [{
                                "title": "Kitten",
                                "subtitle": "Cute kitten picture",
                                "image_url": imageUrl ,
                                "buttons": [{
                                    "type": "web_url",
                                    "url": imageUrl,
                                    "title": "Show kitten"
                                }, {
                                    "type": "postback",
                                    "title": "I like this",
                                    "payload": "User " + recipientId + " likes kitten " + imageUrl,
                                }]
                            }]
                        }
                    }
                };

                sendMessage(recipientId, message);

                return true;
            }
        }

        return false;

    }

    function sendMessage(recipientId, message){
        r({
            url: 'https://graph.facebook.com/v2.8/me/messages',
            qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
            method: 'POST',
            json: {
                recipient: {id: recipientId},
                message: message
            }
        }, function(error,response){
            if(error){
                console.log('Error sending message: ', error);
            }else if(response.body.error){
                console.log('Error: ', response.body.error);
            }
        });
    }
}
