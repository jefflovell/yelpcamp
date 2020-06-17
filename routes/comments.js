var express 		= require("express");
var router 			= express.Router({mergeParams: true});
var Campground 		= require("../models/campground");
var Comment 		= require("../models/comment");
var middleware 		= require("../middleware");


// NEW COMMENT FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", "Oops! Something went sideways. Might be the flux capacitor. Try again in a bit.");
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

// CREATE NEW COMMENT
router.post("/", middleware.isLoggedIn, function(req, res){
	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", "Oops! Something went sideways. Might be the flux capacitor. Try again in a bit.");
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			console.log(req.body.comment);
			//create new comments
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Oops! Something went sideways. Might be the flux capacitor. Try again in a bit.");
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					//connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "That's just like your opinion man...comment added successfully.");
					//redirect campground to show page
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
})

// EDIT COMMENTS

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			req.flash("error", "Oops! Something went sideways. Might be the flux capacitor. Try again in a bit.");
			res.redirect("back");
		}else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

// UPDATE COMMENTS

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			req.flash("error", "Oops! Something went sideways. Might be the flux capacitor. Try again in a bit.");
			res.redirect("back");
		}else{
			req.flash("success", "Fixed that for you...comment edited successfully.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY COMMENTS

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			req.flash("error", "Oops! Something went sideways. Might be the flux capacitor. Try again in a bit.");
			res.redirect("back");
		}else{
			req.flash("success", "And like that -poof- it's gone...comment deleted successfully.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//***********************
//        EXPORT
//***********************

module.exports = router;