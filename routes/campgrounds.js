var express 		= require("express");
var router 			= express.Router();
var Campground 		= require("../models/campground");
var middleware 		= require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// INDEX CAMPGROUNDS
router.get("/", function(req, res){
	// get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			req.flash("error", "Oops! Something went sideways. Might be the flux capacitor. Try again in a bit.");
			console.log("Something went wrong!");
			console.log(err)
		} else {
			res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});  //declare the page variable for nav selection for campgrounds on partials/header.ejs
		}
	});
});

// NEW CAMPGROUND FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// CREATE NEW CAMPGROUND
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var desc = req.body.description;
  var amenities = req.body.amenities;
  var alerts = req.body.alerts;
  var booking = req.body.booking;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash("error", "Are you sure that's a real place? Try again.");
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, image: image, price: price, description: desc, amenities: amenities, alerts: alerts, booking: booking, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
	  console.log(req.body);
			Campground.create(newCampground, function(err, newlyCreated){
			if(err){
			req.flash("error", "Oops! Something went sideways. Might be the flux capacitor. Try again in a bit.");
			console.log(err);
			} else {
			//redirect back to campgrounds page
			console.log(newlyCreated);
			req.flash("success", "Check out those sweet views!  Campground created successfully.");
			res.redirect("/campgrounds");
			}
		});
    });
});

// SHOW CAMPGROUND DETAILS
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			req.flash("error", "Oops! Something went sideways. Might be the flux capacitor. Try again in a bit.");
			console.log(err);
		} else {
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT CAMPGROUND
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// UPDATE CAMPGROUND
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash("error", "Are you sure that's a real place? Try again.");
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Fixed that for you...campground successfully updated.");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

// DESTROY CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash("error", "Oops! Something went sideways. Might be the flux capacitor. Try again in a bit.");
			res.redirect("/campgrounds");
		}else{
			req.flash("success", "And like that -poof- it's gone...campground deleted successfully.");
			res.redirect("/campgrounds");
		}
	});
});

//***********************
//       EXPORT
//***********************

module.exports = router;