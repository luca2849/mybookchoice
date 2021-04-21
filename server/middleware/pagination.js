module.exports = function (req, res, next) {
	// Get limit & skip from url query
	const { limit, skip } = req.query;
	// check if they exist
	if ("limit" in req.query && "skip" in req.query) {
		// Set req attributes as numeric values (+)
		req.limit = +limit;
		req.skip = +skip;
		next();
	} else {
		return res
			.status(400)
			.json({ errors: [{ message: "Missing pagination parameter(s)" }] });
	}
};
