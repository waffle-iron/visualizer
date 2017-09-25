var express = require('express');
var sassMiddleware = require("node-sass-middleware");
var path = require('path');

var router = express.Router();

module.exports = function(info,passport) {
  router.use(function(req, res, next) {
    console.info("ASSETS", path.resolve(info.rootDir + "/client/assets/"));
    next();
  });


  router.use('/', express.static(path.resolve(info.rootDir + '/client/assets/')))

	return router;
}
