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

// Define Routes
app.use("/recommender", require("./routes/recommender"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
	console.log(`Recommender Listening on Port ${PORT}`);
});
