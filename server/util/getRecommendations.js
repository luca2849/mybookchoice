const { euclideanDistance, numberMap } = require("./linearAlgebra");

const genres = [
	"science-fiction",
	"nonfiction",
	"fiction",
	"thriller",
	"romance",
	"adventure",
	"mystery",
	"children",
];

const types = ["book", "poetry", "play", "comic"];

const preferences = [
	"humour",
	"horror",
	"magic",
	"classics",
	"hope",
	"politics",
	"drama",
	"suspense",
];

const eras = ["past", "1600", "1700", "1800", "1900", "2000", "2100", "future"];

// Work out constants
const a = new Array(
	genres.length + types.length + preferences.length + eras.length
).fill(0);
const b = new Array(
	genres.length + types.length + preferences.length + eras.length
).fill(1);
const max = euclideanDistance(a, b);
const min = 0;

const getGenre = (bookSubjects) => {
	const presentGenres = new Array(8).fill(0);
	for (let i = 0; i < genres.length; i++) {
		const genre = genres[i];
		const reExp = new RegExp(`\\b${genre}\\b`, "gi");
		for (const subject of bookSubjects) {
			const found = subject.match(reExp);
			if (found) {
				presentGenres[i] = 1;
			}
		}
	}
	return presentGenres;
};

const getType = (bookSubjects) => {
	const presentTypes = new Array(4).fill(0);
	for (let i = 0; i < types.length; i++) {
		const type = types[i];
		const reExp = new RegExp(`\\b${type}\\b`, "gi");
		for (const subject of bookSubjects) {
			const found = subject.match(reExp);
			if (found) {
				presentTypes[i] = 1;
			}
		}
	}
	return presentTypes;
};

const getOtherPreferences = (bookSubjects) => {
	const presentPreferences = new Array(8).fill(0);
	for (let i = 0; i < types.length; i++) {
		const preference = preferences[i];
		const reExp = new RegExp(`\\b${preference}\\b`, "gi");
		for (const subject of bookSubjects) {
			const found = subject.match(reExp);
			if (found) {
				presentPreferences[i] = 1;
			}
		}
	}
	return presentPreferences;
};

const getEras = (bookDates) => {
	const presentEras = new Array(8).fill(0);
	for (let i = 0; i < eras.length; i++) {
		for (const date of bookDates) {
			if (eras[i] === date) {
				presentEras[i] = 1;
			}
		}
	}
	return presentEras;
};

const compileUserVector = (
	inputGenres,
	inputTypes,
	inputPreferences,
	inputEras
) => {
	const userVector = new Array(
		genres.length + types.length + preferences.length + eras.length
	).fill(0);
	for (let i = 0; i < genres.length; i++) {
		for (const genre of inputGenres) {
			if (genre.toLowerCase() === genres[i].toLowerCase()) {
				userVector[i] = 1;
			}
		}
	}
	for (let i = 0; i < types.length; i++) {
		for (const type of inputTypes) {
			if (type.toLowerCase() === types[i].toLowerCase()) {
				userVector[i + genres.length] = 1;
			}
		}
	}
	for (let i = 0; i < preferences.length; i++) {
		for (const preference of inputPreferences) {
			if (preference.toLowerCase() === preferences[i].toLowerCase()) {
				userVector[i + genres.length + types.length] = 1;
			}
		}
	}
	for (let i = 0; i < eras.length; i++) {
		for (const era of inputEras) {
			if (era.toLowerCase() === eras[i].toLowerCase()) {
				userVector[
					i + genres.length + types.length + preferences.length
				] = 1;
			}
		}
	}
	return userVector;
};

const compileBookVector = (bookSubjects, bookDates) => {
	const genres = getGenre(bookSubjects);
	const types = getType(bookSubjects);
	const preferences = getOtherPreferences(bookSubjects);
	const eras = getEras(bookDates);
	return [...genres, ...types, ...preferences, ...eras];
};

const calculateWeightedScore = (
	bookSubjects,
	bookDates,
	inputGenres,
	inputTypes,
	inputPreferences,
	inputEras
) => {
	// Compile user vector
	const userVector = compileUserVector(
		inputGenres,
		inputTypes,
		inputPreferences,
		inputEras
	);
	// Compile book vector
	const bookVector = compileBookVector(bookSubjects, bookDates);
	// Get distance
	const dist = euclideanDistance(bookVector, userVector);
	// Map value to range 0, 1
	const score = numberMap(dist, min, max, 0, 1);
	// Calculate Average Score
	return 1 - score;
};

const getBookRecommendation = (
	inputGenres,
	inputTypes,
	inputPreferences,
	inputEras,
	books,
	n,
	disallowBooks = []
) => {
	// Remove disallowed books (books already in reading list)
	const cleanBooks = books.filter(
		(book) => !disallowBooks.includes(book._id)
	);
	// Loop through books
	const scores = [];
	for (const book of cleanBooks) {
		// Get score
		const score = calculateWeightedScore(
			book.subjects,
			book.dates ? book.dates : [],
			inputGenres,
			inputTypes,
			inputPreferences,
			inputEras
		);
		// Add score to obj list
		scores.push({ id: book._id, title: book.title, score: score });
	}
	// Sort scores
	scores.sort((a, b) => b.score - a.score);
	// Get top n books from list & return
	return scores.slice(0, n);
};

module.exports = {
	getBookRecommendation,
};
