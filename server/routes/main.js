var express = require("express");
var router = express.Router();

var path = require('path');

console.log(__dirname);
module.exports = function(passport) {
	//
	// router.get('/js/*', function(req, res) {
	// 	res.sendFile(path.resolve(__dirname + '/../../dist/' + req.params[0]));
	// });

	router.get('/*', function(req, res) {
		res.sendFile(path.resolve(__dirname + '/../../client/' + req.path));
	});



	router.get('/', function(req, res) {
		res.render('visualizer');
	});
	return router;
}
