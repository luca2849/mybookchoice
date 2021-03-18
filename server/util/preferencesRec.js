const User = require("../models/User");
const mongoose = require("mongoose");

const preferencesRecc = async (targetUser) => {
	try {
		// Get current user
		const currentUser = await User.findOne({ _id: targetUser }).populate(
			"ratings.book_id"
		);
		// Get all users except current
		const users = await User.find({
			_id: { $nin: [mongoose.Types.ObjectId(targetUser)] },
		}).populate("ratings.book_id");
		if (users.length < 1) return -1;
		const scores = [];
		for (const user of users) {
			let sumSquares = 0;
			// For each user, calculate nearest neighbors based on preferences
			// Order both users genre preferences
			const userVector = new Array(12).fill(0);
			const currentVector = new Array(12).fill(0);
			const genres = [
				"Science-Fiction",
				"Fiction",
				"Thriller",
				"Horror",
				"Children's",
				"Mystery",
				"Romance",
				"Non-Fiction",
			];
			const types = ["Novel", "Poem", "Comic", "Play"];
			// Add selected genres to pre-defined arrays
			for (const genre of user.preferences.genres) {
				const index = genres.indexOf(genre);
				userVector[index] = 1;
			}
			for (const genre of currentUser.preferences.genres) {
				const index = genres.indexOf(genre);
				currentVector[index] = 1;
			}
			// Add types to arrays
			for (const type of currentUser.preferences.types) {
				const index = types.indexOf(type);
				currentVector[index + 8] = 1;
			}
			for (const type of user.preferences.types) {
				const index = types.indexOf(type);
				userVector[index + 8] = 1;
			}
			// Find similarity between arrays
			for (let i = 0; i < 12; i++) {
				const diff = currentVector[i] - userVector[i];
				sumSquares += diff * diff;
			}
			const d = Math.sqrt(sumSquares);
			const similarity = 1 / (1 + d);
			scores.push({ user: user._id, score: similarity });
		}
		scores.sort((a, b) => (a.score > b.score ? 1 : -1));
		return scores;
	} catch (error) {
		console.error(error);
	}
};

module.exports = preferencesRecc;
