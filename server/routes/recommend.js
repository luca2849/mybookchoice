// Express & Routing
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const recommend = require("../util/recommend");

router.get("/", auth, async (req, res) => {
	const userId = req.user._id;
	const books = await recommend(userId, 3);
	return res.json({ books });
});

module.exports = router;
