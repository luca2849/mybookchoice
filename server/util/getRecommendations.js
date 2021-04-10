const genres = [
	"science fiction",
	"nonfiction",
	"fiction",
	"thriller",
	"romance",
	"horror",
	"mystery",
	"children",
];

const types = ["book", "poetry", "play", "comic"];

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

const compileUserVector = (inputGenres, inputTypes) => {
	const userVector = new Array(genres.length + types.length).fill(0);
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

const calculateWeightedScore = (bookSubjects, inputGenres, inputTypes) => {
	// Compile user vector
	const userVector = compileUserVector(inputGenres, inputTypes);
	// Split vector into groups
	const genreVector = userVector.slice(0, 8);
	const typeVector = userVector.slice(8, 12);
	// Get genre score
	const genreScore = calculateGenreScore(bookSubjects, genreVector);
	// Get type score
	const typeScore = calculateTypeScore(bookSubjects, typeVector);
	// Weight scores (0.7 * type + 0.3 * genre)
	return typeScore * 0.3 + genreScore * 0.7;
};

const getBookRecommendation = (inputGenres, inputTypes, books, n) => {
	// Loop through books
	const scores = [];
	for (const book of books) {
		// Get score
		const score = calculateWeightedScore(
			book.subjects,
			inputGenres,
			inputTypes
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
