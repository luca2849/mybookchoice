const Thread = require("../models/Thread");
const Message = require("../models/Message");

const isAllowed = async (threadId, currentUserId) => {
	try {
		const thread = await Thread.findOne({
			_id: threadId,
			users: { $in: [currentUserId] },
		});
		if (!thread) return false;
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};

const addMessageToDB = async (text, userId, thread) => {
	try {
		// Check if allowed
		const allowed = await isAllowed(thread._id, userId);
		if (!allowed) return false;
		// Add message to DB
		thread.updated_at = new Date();
		await thread.save();
		let newMessage = new Thread({
			text,
			user: userId,
			thread: thread._id,
		});
		await newMessage.save();
		const populatedModel = await Message.populate(newMessage, [
			{ path: "user", select: "name username profileImage" },
			{ path: "thread", select: "updated_at" },
		]);
		return populatedModel;
	} catch (error) {
		console.error(error);
		return false;
	}
};

module.exports = {
	isAllowed,
	addMessageToDB,
};
