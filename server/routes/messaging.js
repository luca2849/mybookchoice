// Express & Routing
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const pagination = require("../middleware/pagination");

const User = require("../models/User");
const Thread = require("../models/Thread");
const Message = require("../models/Message");

const ObjectId = require("mongoose").Types.ObjectId;

// GET /api/messaging/threads
// Purpose - Get a user's threads
// Access - Private
router.get("/threads", [auth, pagination], async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user.id });
		if (!user)
			return res
				.status(404)
				.json({ errors: [{ msg: "User not found" }] });
		const threads = await Thread.find({
			users: {
				$in: [user._id],
			},
		})
			.skip(req.skip)
			.limit(req.limit)
			.populate("users", "name username profileImage")
			.sort({ updatedAt: -1 });
		return res.status(200).json(threads);
	} catch (error) {
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal Server Error" }] });
	}
});

// GET /api/messaging/:thread
// Purpose - Get a specific thread by ID
// Access - Private
router.get("/:threadId", [auth, pagination], async (req, res) => {
	try {
		if (!req.params.threadId)
			return res
				.status(400)
				.json({ errors: [{ msg: "Missing thread ID" }] });
		const { threadId } = req.params;
		if (ObjectId.isValid(threadId))
			return res
				.status(400)
				.json({ errors: [{ msg: "Invalid thread ID" }] });
		// Check if user is in thread (security)
		const thread = await Thread.find({
			_id: threadId,
			users: { $in: [req.user.id] },
		});
		if (thread.length === 0) {
			return res
				.status(404)
				.json({ errors: [{ msg: "Thread not found" }] });
		}
		const messages = await Message.find({ thread: threadId })
			.limit(req.limit)
			.skip(req.skip)
			.sort({ created_at: -1 })
			.populate("user", "name username profileImage");

		return res.status(200).json(messages);
	} catch (error) {
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal Server Error" }] });
	}
});

module.exports = router;
