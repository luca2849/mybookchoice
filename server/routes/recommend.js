// Express & Routing
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const recommend = require("../util/recommend");
const { getBookRecommendation } = require("../util/getRecommendations");

router.get("/", auth, async (req, res) => {
	const { limit, skip } = req.query;
	if (limit === undefined || skip === undefined)
		return res.json(400).json({ errors: [{ msg: "Missing Parameters" }] });
	const userId = req.user.id;
	const books = await recommend(userId, 3);
	// Skip
	const skipped = books.filter((book, i) => {
		if (i > skip - 1) return true;
	});
	// Limit
	const limited = skipped.filter((book, i) => {
		if (i <= limit - 1) return true;
	});
	const ids = limited.map((book) => book.book);
	const bookDetails = await Book.find({ _id: { $in: ids } });
	const returnBooks = bookDetails.map((book, index) => {
		return { ...book.toJSON(), certainty: limited[index].certainty };
	});
	return res.json({ books: returnBooks });
});

router.post("/specific", auth, async (req, res) => {
	const { genres, types, preferences, eras } = req.body;
	const { limit } = req.query;
	if (!genres || !types || !eras || limit <= 0)
		return res
			.status(400)
			.json({ errors: [{ msg: "Invalid/Missing Parameters" }] });
	const booksToNotInclude = await User.findOne({ _id: req.user.id }).select(
		"readingList"
	);
	const books = await Book.find({ title: { $exists: true } });
	const recs = getBookRecommendation(
		genres,
		types,
		preferences,
		eras,
		books,
		limit,
		booksToNotInclude.readingList.map((book) => book.book_id)
	);
	let cleanRecommendations = [];
	for (const rec of recs) {
		const book = await Book.findOne({ _id: rec.id });
		cleanRecommendations.push({
			...book.toJSON(),
			score: rec.score,
		});
	}
	let output = [];
	for (const book of cleanRecommendations) {
		output.push({
			...book,
			score: `${Math.round(book.score * 10000) / 100}%`,
		});
	}
	return res.status(200).json([...new Set(output)]);
});

module.exports = router;
