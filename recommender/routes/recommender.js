// Express & Routing
const express = require("express");
const router = express.Router();

const recommend = require("../util/recommend");

router.get("/", async (req, res) => {
	const books = await recommend("60437e4b1965ce4110f1ef8f", 3);
	return res.json({ books });
});

module.exports = router;
