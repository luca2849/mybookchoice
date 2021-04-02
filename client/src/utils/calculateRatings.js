const calculateRatings = (ratings) => {
	const likes = ratings.filter((item) => item.rating === 1);
	const notRead = ratings.filter((item) => item.rating === 0);
	return [
		likes.length,
		notRead.length,
		ratings.length - likes.length - notRead.length,
	];
};

export default calculateRatings;
