const idGen = (length) => {
	const chars =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let out = [];
	for (let i = 0; i < length; i++) {
		out.push(chars[Math.floor(Math.random() * chars.length)]);
	}
	return out.join("");
};

module.exports = idGen;
