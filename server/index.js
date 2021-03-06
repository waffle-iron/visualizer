var express = require("express");
var url = require('url');
var http = require('http');
var path = require('path');

var chalk = require("chalk");

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');



// configuration ===============================================================
try {
	// mongoose.connect('mongodb://heroku_s5ccgckt:4qs0gmog36h51aj1j1jdfg2lp9@ds151909.mlab.com:51909/heroku_s5ccgckt'); // connect to our database
} catch (e) {
	console.log(e);
}

var app = express();

app.use(function(req, res, next) {
	// res.header("Access-Control-Allow-Origin", "*");
	// res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('views', path.resolve(__dirname + '/../client/views/'));
app.set('view engine', 'pug');

app.use(session({
	secret: 'ilovescotchscotchyscotchscotch'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

require('./config/passport')(passport);

//Routes

app.get('/album', function(req, res) {
	var purl = url.parse(req.query.href);
	var externalReq = http.request({
		hostname: purl.hostname,
		path: purl.path
	}, function(externalRes) {
		res.setHeader("content-disposition", "attachment; filename=logo.png");
		externalRes.pipe(res);
	});
	externalReq.end();
});

var info = {
  rootDir: path.resolve(__dirname + "/../")
}

var audioRoute = require('./routes/audio.js')(info,passport);
var authRoute = require('./routes/auth.js')(info,passport);
var styleRoute = require('./routes/styles.js')(info,passport);
var assetRoute = require('./routes/assets.js')(info,passport);
var userRoute = require('./routes/user.js')(info,passport);
var mainRoute = require('./routes/main.js')(info,passport);
app.use('/auth', authRoute);
app.use('/audio', audioRoute);
app.use('/styles', styleRoute);
app.use('/assets', assetRoute);
app.use('/user', userRoute);
app.use('/', mainRoute);






module.exports = function() {
	app.listen(process.env.PORT || 80, function() {
		console.log("listening on *:80");
	});
}
