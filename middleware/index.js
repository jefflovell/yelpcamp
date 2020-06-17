var Campground 		= require("../models/campground");
var Comment 		= require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Oops! Something went sideways. Might be the flux capacitor. Try again in a bit.");
				res.redirect("back");
			}else{
				//does user own campground?
				if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
					//move on to the next code block in the route
					next();
				}else{
					req.flash("error", "Not so fast, pal! You must be logged in as the campground owner to do that.");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "Stranger! Danger! You must be logged in to do that.");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Oops! Something went sideways. Might be the flux capacitor. Try again in a bit.");
				res.redirect("back");
			}else{
				//does user own comment?
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
					//move on to the next code block in the route
					next();
				}else{
					req.flash("error", "Not so fast, pal! You must be logged in as the comment owner to do that.");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "Stranger! Danger! You must be logged in to do that.");
		res.redirect("back");
	}	
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Stranger! Danger! You must be logged in to do that.");
	res.redirect("/login");
};

module.exports = middlewareObj;
