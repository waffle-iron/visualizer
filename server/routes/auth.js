var express = require('express');
var router = express.Router();

module.exports = function(passport) {
	router.get('/', passport.authenticate('soundcloud-token'), function(req, res) {
		console.log(req);
	});


	return router;
}
