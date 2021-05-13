const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
// Helper functions
const { addMessageToDB } = require("./util/socketHelpers.js");
// Models
const User = require("./models/User");
const Thread = require("./models/Thread");
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
app.use("/api/messaging", require("./routes/messaging"));
app.use("/api/data", require("./routes/data"));

// Serve React Build
app.get("*", (req, res) => {
	return res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// WebSockets - Realtime Responses
io.on("connection", (socket) => {
	const room = socket.handshake.query.user;
	socket.join(room);
	socket.on("message", async ({ message, threadId, username }) => {
		try {
			const thread = await Thread.findOne({ _id: threadId }).populate(
				"users",
				"username name profileImage"
			);
			if (!thread) return;
			const user = await User.findOne({ username });
			if (!user) return;
			const otherUser = thread.users.filter(
				(user) => user.username !== username
			)[0];
			const result = await addMessageToDB(message, user._id, thread);
			// Respond with SocketIO
			io.to(otherUser.username)
				.to(user.username)
				.emit("message", { message: result });
			io.to(otherUser.username).emit("newMessage", {
				from: user.username,
			});
		} catch (error) {
			console.error(error);
		}
	});
	socket.on("friendRequest", async ({ username }) => {
		io.to(username).emit("friendRequest", { username });
	});
	socket.on("accepted", async ({ newFriendUsername, username }) => {
		const newFriend = await User.findOne({
			username: newFriendUsername,
		})
			.select("-password -__v")
			.populate("friends.user", "-ratings")
			.populate("readingList.book_id", "olId title authors");
		const user = await User.findOne({ username })
			.select("-password -__v")
			.populate("friends.user", "-ratings")
			.populate("readingList.book_id", "olId title authors");
		io.to(username).emit("accept", { user: newFriend });
		io.to(newFriendUsername).emit("reqAccepted", { user });
	});
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
	console.log(`Server Listening on Port ${PORT}`);
});
