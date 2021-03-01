const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	book_isbn: {
		type: String,
		required: true,
	},
	rating: {
		type: Number,
		required: true,
	},
	review: {
		type: String,
	},
});

module.exports = Review = mongoose.model("review", ReviewSchema);
