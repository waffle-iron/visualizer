var express = require('express');
var sassMiddleware = require("node-sass-middleware");
var path = require('path');

var router = express.Router();

module.exports = function(info,passport) {
  router.use(function(req, res, next) {
    console.info("STYLES", path.resolve(info.rootDir + "/client/styles/scss"));
    next();
  });
	router.use(sassMiddleware({
    src: path.resolve(info.rootDir + "/client/styles/scss"),
    dest: path.resolve(info.rootDir + "/client/styles/css"),
    debug: true,
    outputStyle: 'expanded'
  }));

  router.use('/', express.static(path.resolve(info.rootDir + '/client/styles/css/')))

	return router;
}
