const User = require("../models/User");
const Book = require("../models/Book");
const mongoose = require("mongoose");
const preferencesRec = require("./preferencesRec");
const booksRec = require("./booksRec");

const recommend = async (targetUser, n) => {
	try {
		const preferenceScores = await preferencesRec(targetUser);
		const bookScores = await booksRec(targetUser);
		const currentUser = await User.findOne({ _id: targetUser });
		const averageScores = [];
		for (let i = 0; i < bookScores.length; i++) {
			// Find preference score for user
			const record = search(bookScores[i].user, "user", preferenceScores);
			// Average Score
			const averageScore = {
				user: bookScores[i].user,
				score: 0.5 * (bookScores[i].score + record.score),
			};
			averageScores.push(averageScore);
		}
		// Get n nearest neighbors liked books (which are either not read or not rated by current user)
		if (averageScores.length < n) n = averageScores.length;
		let books = [];
		for (let i = 0; i < n; i++) {
			const currentScore = averageScores[i];
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
		return Array.from(new Set(books.flat(1)));
	} catch (error) {
		console.error(error);
	}
};

const search = (term, key, array) => {
	for (let i = 0; i < array.length; i++) {
		if (
			mongoose.Types.ObjectId(array[i][key]).equals(
				mongoose.Types.ObjectId(term)
			)
		) {
			return array[i];
		}
	}
};

module.exports = recommend;
