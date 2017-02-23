var express = require('express');
var router = express.Router();

module.exports = function(passport) {
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	router.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	router.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('user/login', {
			message: req.flash('loginMessage')
		});
	});

	router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/', // redirect to the secure profile section
		failureRedirect: '/user/login', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));
	// process the login form
	// router.post('/login', do all our passport stuff here);

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	router.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('user/signup', {
			message: req.flash('signupMessage')
		});
	});

	// process the signup form
	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/user/profile', // redirect to the secure profile section
		failureRedirect: '/user/signup', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	// process the signup form
	// router.post('/signup', do all our passport stuff here);

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	router.get('/profile', isLoggedIn, function(req, res) {
		res.render('user/profile', {
			user: req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/user/login');
	});
	return router;
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
