//server.js
//get the tools we need

var express = require('express');
var app = express();

//require our database connection
var pg = require('pg');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(flash()); //use connect-flash for flash messages stored in session

require('./app/routes.js')(app);

app.use(express.static(__dirname + "/public"));
var port = process.env.PORT || 3000;

var facebookToken = 'EAAPS7lPxGP4BACC6t8U3u2RdAI9jg8NcLT8bO6BOPVcQTRfhscf3ZCQoT02frfRinEazMwKfxLWXhRbzgoiiYikChcaeT1iCDeE9YKidXZBlkSBGehEFtavf79ahTacknUWxZAd0US2tsAajcSWSTDts6xeNQqswfEPeQ5MVQZDZD';

//launch =========
app.listen(port);
console.log('Dronic happens on port '+ port);
