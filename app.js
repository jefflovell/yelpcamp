//***********************
//        SETUP
//***********************

//-------Includes--------

require("dotenv").config();

var express    	  		= require("express"),
	bodyParser	  		= require("body-parser"),
	mongoose   	  		= require("mongoose"),
	flash				= require("connect-flash"),
	User 		  		= require("./models/user"),
	Campground	  		= require("./models/campground"),
	Comment   	  		= require("./models/comment"),
	seedDB    	  		= require("./seeds"),
	passport	  		= require("passport"),
	LocalStrategy 		= require("passport-local"),
	methodOverride		= require("method-override"),
	indexRoutes   		= require("./routes/index"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	commentRoutes 		= require("./routes/comments");

//***********************
//      DATABASES
//***********************

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

//***********************
//       CONFIGS
//***********************

// seedDB(); //seed the database

var app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');  // must be before passport
app.locals.truncate = require('node-truncate-string');

// PASSPORT CONFIGS
app.use(require("express-session")({
	secret: "Is that you, John Wayne?",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));   //comes with passport-local-mongoose
passport.serializeUser(User.serializeUser());  			//comes with passport-local-mongoose
passport.deserializeUser(User.deserializeUser());  		//comes with passport-local-mongoose

//***********************
//      MIDDLEWARE
//***********************

// Current User Template Var -> Must be before router middleware
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Express Router
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//***********************
//     START SERVER
//***********************

app.listen(3000, function(){
	console.log("YelpCamp listening on port 3000");
});