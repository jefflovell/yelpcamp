var express 		= require("express");
var router 			= express.Router();
var passport		= require("passport");
var User			= require("../models/user");
var Campground		= require("../models/campground");

// SHOW HOME PAGE
router.get("/", function(req, res){
	res.render("landing");
});

//=======================
//  AUTH ROUTES
//=======================

//SHOW REGISTRATION FORM
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); //declare the page var for nav selection for registration form on partials/header.ejs
});

//CREATE REGISTERED USER
router.post("/register", function(req, res){
	var newUser = new User(
		{
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			avatar: req.body.avatar,
			email: req.body.email,
			bio: req.body.bio
		});
	if(req.body.adminCode === process.env.ADMIN_SECRET){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			return res.render("register", {"error": err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

// SHOW LOGIN FORM
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); //declare the page var for nav selection for login form on partials/header.ejs 
});

// LOG USER LOGIN
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds", 
		failureRedirect: "/login"
	}), function(req, res){
});

// LOGOUT
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You have successfully logged out!");
	res.redirect("/campgrounds");
});

// USER PROFILE SHOW
router.get("/users/:id", function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			req.flash("error", "Oops! Something went sideways. Are you sure this person exists in your timeline?");
			res.redirect("/");
		}
		Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
			if(err){
				req.flash("error", "Oops! Something went sideways. Are you sure this campground exists in your timeline?");
				res.redirect("/");
			}
			res.render("users/show", {user: foundUser, campgrounds: campgrounds});
		})
	});
});

module.exports = router;