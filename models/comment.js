var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
	text: String,
	createdAt: {type: Date, default: Date.now}, //moment.js for time since created
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Comment", commentSchema);