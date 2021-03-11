// Express & Routing
const express = require("express");
const router = express.Router();
// Middleware
const auth = require("../middleware/auth");
// Mongo Models
const User = require("../models/User");

// GET /api/user
// Purpose - Get current user data
// Access - Private
router.get("/", auth, async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user.id }).select(
			"-password -__v"
		);
		if (!user) {
			return res
				.status(404)
				.json({ errors: [{ msg: "User not found" }] });
		}
		return res.json(user);
	} catch (error) {
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

// GET /api/user/:username
// Purpose - Get user data by username
// Access - Private
router.get("/:username", auth, async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username }).select("-password -__v");
		if (!user) {
			return res
				.status(404)
				.json({ errors: [{ msg: "User not found" }] });
		}
		return res.json(user);
	} catch (error) {
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

// POST /api/user/preferences
// Purpose - Update user preferences
// Access - Private
router.post("/preferences", auth, async (req, res) => {
	const { genres, types, authors } = req.body;
	if (!genres || !types || !authors)
		return res
			.status(400)
			.json({ errors: [{ msg: "Missing parameters" }] });
	try {
		const user = await User.findOne({ _id: req.user.id }).select(
			"-password -__v"
		);
		if (!user) {
			return res
				.status(404)
				.json({ errors: [{ msg: "User not found" }] });
		}
		user.preferences = {
			genres,
			types,
			authors,
		};
		await user.save();
		return res.status(200).json(user);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

module.exports = router;
