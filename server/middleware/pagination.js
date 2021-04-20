module.exports = function (req, res, next) {
	// Get limit & skip from url query
	const { limit, skip } = req.params;
	// check if they exist
	if (req.param("limit") === "" || req.param("skip") === "") {
		return res
			.status(400)
			.json({ errors: [{ message: "Missing pagination parameter(s)" }] });
	}
	req.limit = limit;
	req.skip = skip;
	next();
};
