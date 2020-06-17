var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
	name: String,
	price: String, //dynamic pricing
	image: String,
	description: String,
	amenities: [],
	alerts: [],
	booking: String,
	location: String, //google maps geocoding
	lat: Number, //google maps geocoding
	lng: Number, //google maps geocoding
	createdAt: {type: Date, default: Date.now},  //moment.js for time since created
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [ //embedded data association for mongo
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Campground", campgroundSchema);