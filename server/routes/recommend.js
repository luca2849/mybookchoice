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
	const books = await Book.find({ title: { $exists: true } });
	const recs = getBookRecommendation(
		genres,
		types,
		preferences,
		eras,
		books,
		limit
	);
	let cleanRecommendations = [];
	for (const rec of recs) {
		const book = await Book.findOne({ _id: rec.id });
		cleanRecommendations.push({
			...book.toJSON(),
			score: rec.score,
		});
	}
	// Combine with general scores
	let output = [];
	const generalRecs = await recommend(req.user.id, 3);
	for (const book of cleanRecommendations) {
		for (let i = 0; i < generalRecs.length; i++) {
			const recBook = generalRecs[i];
			if (
				mongoose.Types.ObjectId(book._id).equals(
					mongoose.Types.ObjectId(recBook.book)
				)
			) {
				output.push({
					...book,
					score: `${
						Math.round(
							(0.75 * book.score + 0.25 * recBook.certainty) *
								10000
						) / 100
					}%`,
				});
			} else {
				// (1) - AND check if is last index of generalRecs before adding
				// Move presence check to (1)
				const isPresent = output.filter((obj) =>
					mongoose.Types.ObjectId(book._id).equals(
						mongoose.Types.ObjectId(obj._id)
					)
				);
				if (isPresent.length < 1 && i === generalRecs.length - 1) {
					output.push({
						...book,
						score: `${Math.round(book.score * 10000) / 100}%`,
					});
				}
			}
		}
	}
	return res.status(200).json([...new Set(output)]);
});

module.exports = router;
