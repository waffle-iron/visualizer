var express = require("express");
var router = express.Router();

var path = require('path');

module.exports = function(passport) {

	router.get('/', function(req, res) {
		res.render('visualizer');
	});
	return router;
}
