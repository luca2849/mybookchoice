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

const eras = ["past", "1600", "1700", "1800", "1900", "2000", "2100", "future"];

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

const calculateEraScore = (bookDates, inputDatesSplit) => {
	// Get types for book
	const eras = getEras(bookDates);
	// Score vector similarity
	let sumSquares = 0;
	for (let i = 0; i < eras.length; i++) {
		const diff = eras[i] - inputDatesSplit[i];
		sumSquares += diff * diff;
	}
	const d = Math.sqrt(sumSquares);
	const similarity = 1 / (1 + d);
	return similarity;
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
	// Split vector into groups
	const genreVector = userVector.slice(0, 8);
	const typeVector = userVector.slice(8, 12);
	const preferencesVector = userVector.slice(12, 20);
	const erasVector = userVector.slice(20, 28);
	// Get genre score
	const genreScore = calculateGenreScore(bookSubjects, genreVector);
	// Get type score
	const typeScore = calculateTypeScore(bookSubjects, typeVector);
	// Get preference score
	const preferencesScore = calculatePreferencesScore(
		bookSubjects,
		preferencesVector
	);
	// Calculate eras score
	const erasScore = calculateEraScore(bookDates, erasVector);
	// Calculate Average Score
	return (1 / 4) * (typeScore + genreScore + preferencesScore + erasScore);
};

const getBookRecommendation = (
	inputGenres,
	inputTypes,
	inputPreferences,
	inputEras,
	books,
	n
) => {
	// Loop through books
	const scores = [];
	for (const book of books) {
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
