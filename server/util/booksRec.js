const User = require("../models/User");
const Book = require("../models/Book");
const mongoose = require("mongoose");

const booksRec = async (targetUser) => {
	try {
		// Get current user
		const currentUser = await User.findOne({ _id: targetUser }).populate(
			"ratings.book_id"
		);
		if (!currentUser) return -1;
		// Get all users except current
		const users = await User.find({
			_id: { $nin: [mongoose.Types.ObjectId(targetUser)] },
		}).populate("ratings.book_id");
		if (users.length < 1) return -1;
		const scores = [];
		// As every user rates the same books in the same order, searches are not needed
		for (const user of users) {
			let sumSquares = 0;
			// User to check needs more ratings than the current user
			if (user.ratings.length <= currentUser.ratings.length) continue;
			// For all user's ratings...
			for (let i = 0; i < currentUser.ratings.length; i++) {
				// Calculate Euclidean Distance & add to sum
				const rating1 = currentUser.ratings[i].rating;
				const rating2 = user.ratings[i].rating;
				const diff = rating1 - rating2;
				sumSquares += diff * diff;
			}
			const d = Math.sqrt(sumSquares);
			// Calculate similarity score between 0 and 1
			const similarity = 1 / (1 + d);
			scores.push({ user: user._id, score: similarity });
		}
		// Sort
		scores.sort((a, b) => (a.score > b.score ? 1 : -1));
		return scores;
	} catch (error) {
		console.error(error);
	}
};

module.exports = booksRec;
