// Express & Routing
const express = require("express");
const router = express.Router();
// Middleware
const auth = require("../middleware/auth");
// Mongo Models
const User = require("../models/User");

// GET /api/user
// Purpose - Get current user data
// Access - Public
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

module.exports = router;
