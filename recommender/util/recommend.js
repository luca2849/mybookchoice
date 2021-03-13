const User = require("../models/User");
const Book = require("../models/Book");
const mongoose = require("mongoose");

const recommend = async (targetUser, n) => {
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
			for (let i = 0; i < currentUser.ratings.length; i++) {
				const rating1 = currentUser.ratings[i].rating;
				const rating2 = user.ratings[i].rating;
				const diff = rating1 - rating2;
				sumSquares += diff * diff;
			}
			const d = Math.sqrt(sumSquares);
			const similarity = 1 / (1 + d);
			scores.push({ user: user._id, score: similarity });
		}
		// Sort
		scores.sort((a, b) => (a.score > b.score ? 1 : -1));
		// Get Current User's Not Read Books
		const userNotRead = currentUser.ratings.filter(
			(item) => item.rating === 0
		);
		// Get n nearest neighbors liked books (which are either not read or not rated by current user)
		if (scores.length < n) n = scores.length;
		let books = [];
		for (let i = 0; i < n; i++) {
			const currentScore = scores[i];
			// Get this users liked books
			const currUser = await User.findOne({ _id: currentScore.user });
			if (!currUser) continue;
			const likesBooks = currUser.ratings.map((curr, index) => {
				if (index <= currentUser.ratings.length - 1) {
					if (
						currentUser.ratings[index].rating === 0 &&
						currUser.ratings[index].rating === 1
					) {
						return curr.book_id;
					}
				} else {
					if (currUser.ratings[index].rating === 1)
						return curr.book_id;
				}
				return null;
			});
			books.push(likesBooks.filter((book) => book));
		}
		// Return books w/out duplicates
		return Array.from(new Set(books));
	} catch (error) {
		console.error(error);
	}
};

module.exports = recommend;
