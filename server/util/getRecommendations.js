const genres = [
	"science fiction",
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

const compileUserVector = (inputGenres, inputTypes, inputPreferences) => {
	const userVector = new Array(
		genres.length + types.length + preferences.length
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
				userVector[i + genres.length] = 1;
			}
		}
	}
	return userVector;
};

const calculateGenreScore = (bookSubjects, inputGenresSplit) => {
	// Get genres for book
	const genres = getGenre(bookSubjects);
	// Score vector similarity
	let sumSquares = 0;
	for (let i = 0; i < genres.length; i++) {
		const diff = genres[i] - inputGenresSplit[i];
		sumSquares += diff * diff;
	}
	const d = Math.sqrt(sumSquares);
	const similarity = 1 / (1 + d);
	return similarity;
};

const calculateTypeScore = (bookSubjects, inputTypesSplit) => {
	// Get types for book
	const types = getType(bookSubjects);
	// Score vector similarity
	let sumSquares = 0;
	for (let i = 0; i < types.length; i++) {
		const diff = types[i] - inputTypesSplit[i];
		sumSquares += diff * diff;
	}
	const d = Math.sqrt(sumSquares);
	const similarity = 1 / (1 + d);
	return similarity;
};

const calculatePreferencesScore = (bookSubjects, inputPreferencesSplit) => {
	// Get types for book
	const preferences = getOtherPreferences(bookSubjects);
	// Score vector similarity
	let sumSquares = 0;
	for (let i = 0; i < preferences.length; i++) {
		const diff = preferences[i] - inputPreferencesSplit[i];
		sumSquares += diff * diff;
	}
	const d = Math.sqrt(sumSquares);
	const similarity = 1 / (1 + d);
	return similarity;
};

const calculateWeightedScore = (
	bookSubjects,
	inputGenres,
	inputTypes,
	inputPreferences
) => {
	// Compile user vector
	const userVector = compileUserVector(
		inputGenres,
		inputTypes,
		inputPreferences
	);
	// Split vector into groups
	const genreVector = userVector.slice(0, 8);
	const typeVector = userVector.slice(8, 12);
	const preferencesVector = userVector.slice(12, 20);
	// Get genre score
	const genreScore = calculateGenreScore(bookSubjects, genreVector);
	// Get type score
	const typeScore = calculateTypeScore(bookSubjects, typeVector);
	// Get preference score
	const preferencesScore = calculatePreferencesScore(
		bookSubjects,
		preferencesVector
	);
	// Weight scores (0.7 * type + 0.3 * genre)
	return (1 / 3) * (typeScore + genreScore + preferencesScore);
};

const getBookRecommendation = (
	inputGenres,
	inputTypes,
	inputPreferences,
	books,
	n
) => {
	// Loop through books
	const scores = [];
	for (const book of books) {
		// Get score
		const score = calculateWeightedScore(
			book.subjects,
			inputGenres,
			inputTypes,
			inputPreferences
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
