// Express & Routing
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const User = require("../models/User");

// GET /api/data/user
// Purpose - Get a user's threads
// Access - Private
router.get("/user", [auth], async (req, res) => {
	const { search } = req.query;
	if (search === "") return res.status(200).json([]);
	try {
		const users = await User.find({
			$or: [
				{ username: { $regex: `.*${search}.*`, $options: "i" } },
				{ name: { $regex: `.*${search}.*`, $options: "i" } },
			],
		}).select("username name profileImage");
		return res.status(200).json(users);
	} catch (error) {
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal Server Error" }] });
	}
});

module.exports = router;
