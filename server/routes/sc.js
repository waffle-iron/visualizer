var express = require('express');
var router = express.Router();

module.exports = function(passport) {
	router.get('/', function(req, res) {
		res.send(501);
	});

	return router;
}
