var request = require('request');
var sc = require('../config/soundcloud.js');


module.exports = function(req, res, next) {
	request.post({
		url: 'https://api.soundcloud.com/oauth2/token',
		qs: {
			client_id: sc.id,
			client_secret: sc.secret,
			redirect_uri: sc.redirect,
			grant_type: 'authorization_code',
			code: req.query.code
		}
	}, function(err, res, body) {
		if (typeof req.query.access_token == undefined) {
			req.accessToken = JSON.parse(body).access_token;
			req.query.access_token = JSON.parse(body).access_token;
			console.log(req.query.access_token);
			next();
		} else {
			next();
		}
	});


}
