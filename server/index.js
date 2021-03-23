const express = require("express");
const path = require("path");
const app = express();
// Database connection function
const connectDB = require("./config/db.js");

// Connect to database
connectDB();

// Init Middleware
app.use(
	express.json({
		extend: false,
	})
);
// Statically define react front-end
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(
	"/api/img",
	express.static(path.join(__dirname, "./public/profileImages"))
);
// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/recommend", require("./routes/recommend"));

// Serve React Build
app.get("*", (req, res) => {
	return res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server Listening on Port ${PORT}`);
});
