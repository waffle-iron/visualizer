var express = require('express');
var router = express.Router();

module.exports = function(passport) {
	router.get('/', passport.authenticate('soundcloud', {
		failureRedirect: '/user/login'
	}), function(req, res) {
		console.log(req.user);
		res.redirect('/');
	});

	return router;
}
