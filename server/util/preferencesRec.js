const User = require("../models/User");
const Book = require("../models/Book");
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
			const userGenres = new Array(8).fill(0);
			const currentGenres = new Array(8).fill(0);
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
			// Add selected genres to pre-defined arrays
			for (const genre of user.preferences.genres) {
				const index = genres.indexOf(genre);
				userGenres[index] = 1;
			}
			for (const genre of currentUser.preferences.genres) {
				const index = genres.indexOf(genre);
				currentGenres[index] = 1;
			}
			// Find similarity between arrays
			for (let i = 0; i < 8; i++) {
				const diff = currentGenres[i] - userGenres[i];
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
