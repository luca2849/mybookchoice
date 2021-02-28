const express = require("express");
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
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server Listening on Port ${PORT}`);
});
