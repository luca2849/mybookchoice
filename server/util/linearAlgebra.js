const euclideanDistance = (a, b) => {
	return (
		a
			.map((x, i) => Math.abs(x - b[i]) ** 2)
			.reduce((sum, now) => sum + now) **
		(1 / 2)
	);
};

const numberMap = (value, x1, y1, x2, y2) =>
	((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

module.exports = {
	euclideanDistance,
	numberMap,
};
