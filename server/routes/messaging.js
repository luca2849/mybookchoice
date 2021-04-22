// Express & Routing
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const pagination = require("../middleware/pagination");

const { check, validationResult } = require("express-validator");

const User = require("../models/User");
const Thread = require("../models/Thread");
const Message = require("../models/Message");

const { addMessageToDB } = require("../util/socketHelpers");

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
// Purpose - Get messages from thread
// Access - Private
router.get("/:threadId", [auth, pagination], async (req, res) => {
	try {
		if (!req.params.threadId)
			return res
				.status(400)
				.json({ errors: [{ msg: "Missing thread ID" }] });
		const { threadId } = req.params;
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
			.sort({ $natural: -1 })
			.populate("user", "name username profileImage");
		const totalMessages = await Message.find({
			thread: threadId,
		}).countDocuments();
		return res.status(200).json({ messages, totalMessages });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal Server Error" }] });
	}
});

// GET /api/messaging/doesExist/:username
// Purpose - Returns a thread if one exists between two users
// Access - Private
router.get("/doesExist/:username", [auth], async (req, res) => {
	try {
		if (!req.params.username) {
			return res.status(400).json({ msg: "A thread ID is required" });
		}
		// Get other user ID
		let userId = await User.findOne(
			{ username: req.params.username },
			{ _id: 1 }
		);
		if (!userId) {
			return res.status(404).json({ msg: "User not found" });
		}
		userId = ObjectId(userId._id);
		const me = ObjectId(req.user.id);
		// Get messages for this thread
		const thread = await Thread.find({
			users: { $eq: [userId, me] },
		});
		if (thread.length > 0) {
			return res
				.status(200)
				.json({ thread: thread[0]._id, doesExist: true });
		} else {
			return res.status(200).json({ doesExist: false });
		}
	} catch (error) {
		return res.status(500).json({ msg: "Internal Server Error" });
	}
});

// @route GET /api/messaging/thread/:thread
// @desc Get specific thread information by ID
// @access Private
router.get("/thread/:threadId", [auth], async (req, res) => {
	try {
		if (!req.params.threadId) {
			return res.status(400).json({ msg: "A thread ID is required" });
		}
		const { threadId } = req.params;
		if (!ObjectId.isValid(threadId)) {
			return res.status(400).json({ msg: "Invalid Thread ID" });
		}
		// Check if user is in thread
		const thread = await Thread.findOne({
			_id: threadId,
		}).populate("users", "name username profileImage");
		if (!thread) {
			return res.status(404).json({ msg: "Thread not found" });
		}
		return res.status(200).json({ thread });
	} catch (error) {
		return res.status(500).json({ msg: "Internal Server Error" });
	}
});

// @route POST /api/messaging/:username
// @desc Creates a new message thread between two users
// @access Private
router.post("/:username", [auth], async (req, res) => {
	const { username: recipientUsername } = req.params;
	if (!recipientUsername)
		return res.status(400).json({ msg: "A username is required" });
	try {
		const recipient = await User.findOne(
			{ username: recipientUsername },
			{ _id: 1 }
		);
		if (!recipient) return res.status(400).json({ msg: "User not found" });
		const me = await User.findOne({ _id: req.user.id }, { _id: 1 });
		// Check for already existing thread
		const check = await Thread.find({
			users: { $eq: [recipient._id, me._id] },
		});
		// Add new thread
		if (check.length === 0) {
			let newThread = new Thread();
			newThread.users = [ObjectId(recipient._id), ObjectId(me._id)];
			await newThread.save();
			const populatedModel = await Thread.populate(newThread, [
				{
					path: "users",
					select: "name username profileImage",
				},
			]);
			return res.status(200).json({ newThread: populatedModel });
		} else {
			return res.status(400).json({ msg: "Thread already exists" });
		}
	} catch (error) {
		return res.status(500).json({ msg: "Internal Server Error" });
	}
});

// @route POST /api/messaging/message/:thread
// @desc Add a new message to a thread
// @access Private
router.post(
	"/message/:thread",
	[auth, check("text", "Message content is required").not().isEmpty()],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		if (!req.params.thread) {
			return res.status(400).json({ msg: "A thread ID is required" });
		}
		try {
			const { thread: threadId } = req.params;
			if (!ObjectId.isValid(threadId)) {
				return res.status(400).json({ msg: "Invalid Thread ID" });
			}
			const thread = await Thread.findOne({ _id: threadId });
			if (!thread) {
				return res.status(404).json({ msg: "Thread not found" });
			}
			const added = await addMessageToDB(
				req.body.text,
				req.user.id,
				thread
			);
			if (!added) return res.status(400);
			return res.status(200).json(added);
		} catch (error) {
			console.log(error);
			return res.status(500).json({ msg: "Internal Server Error" });
		}
	}
);

module.exports = router;
