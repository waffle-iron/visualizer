var express = require('express');
var router = express.Router();

module.exports = function(passport) {
	app.get('/', passport.authenticate('soundcloud-token'), function(req, res) {
		console.log(req);
	});


	return router;
}
