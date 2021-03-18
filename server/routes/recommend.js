// Express & Routing
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const recommend = require("../util/recommend");

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

module.exports = router;
