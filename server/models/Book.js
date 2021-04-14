const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
	olId: {
		type: String,
	},
	isbn: {
		type: String,
		required: true,
	},
	title: {
		type: String,
	},
	ratingCount: { type: Number },
	authors: [{ type: String }],
	published: {
		year: { type: String },
		by: [
			{
				type: String,
			},
		],
	},
	dates: [{ type: String }],
	bookPlaces: [{ type: String }],
	bookPeople: [{ type: String }],
	subjects: [{ type: String }],
	type: { type: String },
	languages: [{ type: String }],
	pageCount: { type: Number },
});

module.exports = Book = mongoose.model("book", BookSchema);
