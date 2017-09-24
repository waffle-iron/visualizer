var express = require('express');
var router = express.Router();
var path = require("path");

module.exports = function(info,passport) {
	router.get('/', function(req, res) {
		res.send(501);
	});
  router.get('/*', function(req, res) {
		res.sendFile(path.resolve('/' + decodeURI(req.path)));
    console.log(req.path);

	});
	return router;
}
