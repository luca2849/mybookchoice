// Express & Routing
const express = require("express");
const router = express.Router();
// File Uploads
const multer = require("multer");
// ID Generation
const idGen = require("../util/idGen");
// File System
const fs = require("fs");
// JSON web Tokens
const jwt = require("jsonwebtoken");
// Password Encryption Module
const bcrypt = require("bcryptjs");
// Env Variables
const config = require("config");
// Mailing
const nodemailer = require("nodemailer");
// Date/Time Manipulation
const moment = require("moment");
// Mongoose
const mongoose = require("mongoose");
// Middleware
const auth = require("../middleware/auth");
// Mongo Models
const User = require("../models/User");
const Book = require("../models/Book");

// Setup File Storage

let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/profileImages");
	},
	filename: (req, file, cb) => {
		cb(null, `${idGen(20)}.${file.originalname.split(".")[1]}`);
	},
});

let upload = multer({
	storage,
});

// GET /api/user
// Purpose - Get current user data
// Access - Private
router.get("/", auth, async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user.id })
			.select("-password -__v")
			.populate("friends.user", "-ratings")
			.populate("readingList.book_id", "olId title authors");
		if (!user) {
			return res
				.status(404)
				.json({ errors: [{ msg: "User not found" }] });
		}
		return res.json(user);
	} catch (error) {
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

// POST /api/user/preferences
// Purpose - Update user preferences
// Access - Private
router.post("/preferences", auth, async (req, res) => {
	const { genres, types, authors } = req.body;
	if (!genres || !types || !authors)
		return res
			.status(400)
			.json({ errors: [{ msg: "Missing parameters" }] });
	try {
		const user = await User.findOne({ _id: req.user.id }).select(
			"-password -__v"
		);
		if (!user) {
			return res
				.status(404)
				.json({ errors: [{ msg: "User not found" }] });
		}
		user.preferences = {
			genres,
			types,
			authors,
		};
		await user.save();
		return res.status(200).json(user);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

// POST /api/user/rating
// Purpose - Add a user's book rating
// Access - Private
router.post("/rating", auth, async (req, res) => {
	const { bookData, rating } = req.body;
	if (!bookData || rating === undefined) {
		return res
			.status(400)
			.json({ errors: [{ msg: "Missing parameters" }] });
	}
	try {
		const user = await User.findOne({ _id: req.user.id });
		const book = await Book.findOne({ isbn: bookData.isbn });
		if (!book || !user)
			return res
				.status(404)
				.json({ errors: [{ msg: "Book or user not found." }] });
		const {
			olId,
			title,
			authors,
			publish_date,
			publishers,
			places,
			people,
			subjects,
			type,
			languages,
			pageCount,
		} = bookData;
		book.olId = olId;
		book.title = title;
		book.authors = authors;
		book.published.year = publish_date;
		book.published.by = publishers;
		book.bookPlaces = places;
		book.bookPeople = people;
		book.subjects = subjects;
		book.type = type;
		book.languages = languages;
		book.pageCount = pageCount;
		await book.save();
		user.ratings.push({ book_id: book._id, rating: rating });
		await user.save();
		return res.json(user);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

// GET /api/user/books
// Purpose - Get a user's next 10 books
// Access - Private
router.get("/books", auth, async (req, res) => {
	try {
		const { bookCount, skip } = req.query;
		const user = await User.findOne({ _id: req.user.id });
		const books = await Book.find()
			.sort({ ratingCount: -1 })
			.skip(user.ratings.length + +skip)
			.limit(+bookCount); // Note - '+' converts str to int
		if (!user || !books)
			return res
				.status(404)
				.json({ errors: [{ msg: "Books or user not found." }] });
		return res.json(books);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

// GET /api/user/ratings
// Purpose - Get a user's past ratings
// Access - Private
router.get("/ratings", auth, async (req, res) => {
	const { limit, skip } = req.query;
	try {
		// Find and delete user
		const user = await User.findOne({ _id: req.user.id }).populate(
			"ratings.book_id"
		);
		if (!user)
			return res
				.status(404)
				.json({ errors: [{ msg: "User not found" }] });
		const ratings = user.ratings;
		// Skip
		const skipped = ratings.reverse().filter((rating, i) => {
			if (i > skip - 1) return true;
		});
		// Limit
		const limited = skipped.filter((rating, i) => {
			if (i <= limit - 1) return true;
		});
		return res.status(200).json({ ratings: limited });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

// PUT /api/user/ratings
// Purpose - Update a user's ratings
// Access - Private
router.put("/ratings", auth, async (req, res) => {
	try {
		const { ratingId, newRating } = req.body;
		if (!ratingId || !newRating)
			return res
				.status(400)
				.json({ errors: [{ msg: "Missing parameters" }] });
		// Find and delete user
		const user = await User.findOne({ _id: req.user.id }).populate(
			"ratings.book_id"
		);
		let foundRating = null;
		user.ratings.forEach((rating, index) => {
			if (
				mongoose.Types.ObjectId(rating._id).equals(
					mongoose.Types.ObjectId(ratingId)
				)
			) {
				user.ratings[index].rating = newRating;
				foundRating = user.ratings[index];
				return;
			}
		});
		if (!foundRating)
			return res
				.status(404)
				.json({ errors: [{ msg: "Rating not found." }] });
		user.save();
		return res.status(200).json(foundRating);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

// GET /api/user/notifications
// Purpose - Get a user's notifications
// Access - Private
router.get("/notifications", auth, async (req, res) => {
	const { limit, skip } = req.query;
	try {
		if (+limit <= 0) return res.status(200).json([]);
		const user = await User.findOne({ _id: req.user.id }).populate(
			"notifications.from",
			"-ratings -notifications"
		);
		if (!user)
			return res
				.status(404)
				.json({ errors: [{ msg: "User not found." }] });
		const notifications = user.notifications;
		// Skip
		const skipped = notifications.reverse().filter((notification, i) => {
			if (i > skip - 1) return true;
		});
		// Limit
		const limited = skipped.filter((notification, i) => {
			if (i <= limit - 1) return true;
		});
		return res.status(200).json(limited);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

// GET /api/user/friends
// Purpose - Get a user's friends list
// Access - Private
router.get("/friends", auth, async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user.id }).populate(
			"friends.user"
		);
		let { limit = 10, skip = 0 } = req.query;
		const friends = user.friends;
		// Skip
		const skipped = friends.reverse().filter((friend, i) => {
			if (i > skip - 1) return true;
		});
		// Limit
		const limited = skipped.filter((friend, i) => {
			if (i <= limit - 1) return true;
		});
		return res.status(200).json(limited);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

// GET /api/user/:username
// Purpose - Get user data by username
// Access - Private
router.get("/:username", auth, async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username })
			.populate("friends.user")
			.select("-password -__v");
		if (!user) {
			return res
				.status(404)
				.json({ errors: [{ msg: "User not found" }] });
		}
		return res.json(user);
	} catch (error) {
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

// PUT /api/user
// Purpose - Edit logged in user's profile
// Access - Private
router.put("/", auth, async (req, res) => {
	try {
		const user = await User.findOneAndUpdate(
			{ _id: req.user.id },
			req.body,
			{
				returnOriginal: false,
			}
		);
		if (!user)
			return res
				.status(404)
				.json({ errors: [{ msg: "User not found" }] });
		return res.json(user);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

// PUT /api/user/avatar
// Purpose - Edit logged in user's profile picture
// Access - Private
router.post(
	"/avatar",
	[auth, upload.single("profileImage")],
	async (req, res) => {
		try {
			const file = req.file;
			const user = await User.findOne({ _id: req.user.id }).select(
				"-password"
			);
			if (!user) {
				return res
					.status(404)
					.json({ errors: [{ msg: "User not found" }] });
			}
			const oldAvatar = user.profileImage;
			try {
				if (
					oldAvatar !== "default.jpg" &&
					fs.existsSync(`./public/profileImages/${oldAvatar}`)
				) {
					await fs.unlinkSync(`./public/profileImages/${oldAvatar}`);
				}
			} catch (error) {
				console.error("Error deleting old avatar", error);
			}
			user.profileImage = { imageType: "INTERNAL", url: file.filename };
			await user.save();
			return res.status(200).json(user);
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.json({ errors: [{ msg: "Internal server error" }] });
		}
	}
);

// PUT /api/user/friends/request
// Purpose - Sends a friend request to another user
// Access - Private
router.put("/friends/request", auth, async (req, res) => {
	try {
		const { remoteUser } = req.body;
		// Add notification to remoteUser
		const remoteUserObj = await User.findOne({ username: remoteUser });
		const user = await User.findOne({ _id: req.user.id });
		remoteUserObj.notifications = [
			...remoteUserObj.notifications,
			{
				type: "FRIEND_REQUEST",
				from: user._id,
			},
		];
		await remoteUserObj.save();
		return res.status(200).json(user);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

// PUT /api/user/friends/respond
// Purpose - Sends a friend request to another user
// Access - Private
router.put("/friends/respond", auth, async (req, res) => {
	try {
		let { limit, skip } = req.query;
		if (limit <= 0) limit = 1;
		const { remoteUser, notificationId, accepted } = req.body;
		// Mark notification as actioned
		await User.updateOne(
			{
				_id: req.user.id,
				notifications: {
					$elemMatch: {
						_id: notificationId,
					},
				},
			},
			{ $set: { "notifications.$.actioned": true } }
		);
		const remoteUserObj = await User.findOne({ username: remoteUser });
		const user = await User.findOne(
			{ _id: req.user.id },
			{ notifications: { $slice: [+skip, +limit] } }
		).populate("notifications.from");
		if (!!accepted) {
			remoteUserObj.friends.push({ user: req.user.id });
			user.friends.push({ user: remoteUserObj._id });
			await remoteUserObj.save();
			await user.save();
		}
		return res.status(200).json(user.notifications);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

// DELETE /api/user/friends
// Purpose - Sends a friend request to another user
// Access - Private
router.delete("/friends", auth, async (req, res) => {
	try {
		const { remoteUser } = req.body;
		// Remove friend
		const remoteUserObj = await User.findOne({
			username: remoteUser,
		});
		if (!remoteUserObj)
			return res
				.status(404)
				.json({ errors: [{ msg: "One or both users not found" }] });
		// Update local user
		await User.updateOne(
			{
				_id: req.user.id,
			},
			{
				$pull: {
					friends: {
						user: remoteUserObj._id,
					},
				},
			}
		);
		// Update remote user
		await User.updateOne(
			{ _id: remoteUserObj._id },
			{
				$pull: {
					friends: {
						user: req.user.id,
					},
				},
			}
		);
		const returnUser = await User.findOne({ _id: remoteUserObj._id });
		return res.status(200).json(returnUser);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

// POST /api/user/password
// Purpose - Request a passsword reset
// Access - Private
router.post("/password", async (req, res) => {
	const { email } = req.body;
	try {
		if (!email)
			return res
				.status(404)
				.json({ errors: [{ msg: "Email is required" }] });
		const user = await User.findOne({ email: req.body.email }).select(
			"-password"
		);
		if (!user)
			return res.status(200).json({
				errors: [
					{
						msg:
							"If your email exists in our database, a link to reset your password has been sent.",
					},
				],
			});
		// Get client URL
		const url = `${config.get("client_url")}/`;
		// Create tokens
		const payload = { user: user._id };
		// Create token w/ 5 minute expiry
		const token = jwt.sign(payload, config.get("jwtSecret"), {
			expiresIn: 300,
		});
		// Create mail config
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: config.get("email"),
				pass: config.get("email_password"),
			},
		});
		const tokenLink = `${url}passwordReset?t=${token}`;
		const mailBody = `<h1>MyBookChoice</h1> <p>A password reset has been requested for your account<p><p>If you did not request this, please ignore this email</p><p>If you did, please click the following link to reset your password</p><p><a href="${tokenLink}">${tokenLink}</a></p>`;
		const mailOptions = {
			from: config.get("email"),
			to: user.email,
			subject: "MyBookChoice Password Reset",
			html: mailBody,
		};
		// Send mail (nodemailer)
		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.error(err);
			}
		});
		// Return
		return res.status(200).json({
			errors: [
				{
					msg:
						"If your email exists in our database, a link to reset your password has been sent.",
				},
			],
		});
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

// POST /api/user/password/reset
// Purpose - Reset password
// Access - Private
router.post("/password/reset", async (req, res) => {
	const { password, confirmation, token } = req.body;
	if (!password || !confirmation || !token)
		return res
			.status(400)
			.json({ errors: [{ msg: "Missing parameters" }] });
	if (password !== confirmation)
		return res
			.status(400)
			.json({ errors: [{ msg: "Passwords do not match" }] });
	// Password format validation
	const passwordRegex = new RegExp(
		"(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])"
	);
	if (!passwordRegex.test(password)) {
		return res.status(400).json({
			errors: [
				{
					msg:
						"Password requires at least 1 upper-case character, 1 symbol, 1 lower-case character and 1 number",
				},
			],
		});
	}
	try {
		const decoded = jwt.verify(token, config.get("jwtSecret"));
		// Check if token has expired
		const { exp } = decoded;
		const expiry = exp * 1000;
		const now = moment.now();
		if (expiry < now)
			return res.status(400).json({
				errors: [
					{
						msg:
							"Token has expired. Please request a new password reset.",
					},
				],
			});
		const user = await User.findOne({ _id: decoded.user });
		if (!user)
			return res
				.status(404)
				.json({ errors: [{ msg: "User not found" }] });
		// Hash new password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
		await user.save();
		return res.status(200).json({
			errors: [
				{
					msg: "Password Changed",
				},
			],
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			errors: [{ msg: "Error. Please request a new password reset." }],
		});
	}
});

// DELETE /api/user
// Purpose - Delete user from DB
// Access - Private
router.delete("/", auth, async (req, res) => {
	try {
		// Find and delete user
		await User.findOneAndDelete({ _id: req.user.id }, (err) => {
			if (err) res.status(500).json({ errors: [{ msg: err }] });
		});
		return res.status(200).json({ msg: "Account Deleted" });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

// POST /api/user/list
// Purpose - Add to a user's reading list
// Access - Private
router.post("/list", auth, async (req, res) => {
	const { bookId } = req.body;
	if (!bookId) return res.status(400);
	try {
		const book = await Book.findOne({ _id: bookId });
		if (!book)
			return res
				.status(404)
				.json({ errors: [{ msg: "Book not found" }] });
		const user = await User.findOne({ _id: req.user.id });
		const currentReadingList = user.readingList;
		const found = currentReadingList.filter((item) =>
			mongoose.Types.ObjectId(item.book_id).equals(
				mongoose.Types.ObjectId(bookId)
			)
		);
		if (found.length > 0)
			return res
				.status(400)
				.json({ errors: [{ msg: "Book already present" }] });
		currentReadingList.push({ book_id: bookId });
		await user.save();
		const retUser = await User.findOne({ _id: req.user.id })
			.select("-password -__v")
			.populate("friends.user", "-ratings")
			.populate("readingList.book_id", "olId title authors");
		return res.status(200).json({ user: retUser });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal Server Error" }] });
	}
});

// DELETE /api/user/list
// Purpose - Add to a user's reading list
// Access - Private
router.delete("/list", auth, async (req, res) => {
	const { bookId } = req.body;
	if (!bookId) return res.status(400);
	try {
		const book = await Book.findOne({ _id: bookId });
		if (!book)
			return res
				.status(404)
				.json({ errors: [{ msg: "Book not found" }] });
		await User.updateOne(
			{
				_id: req.user.id,
			},
			{
				$pull: {
					readingList: {
						book_id: bookId,
					},
				},
			}
		);
		return res.status(200).json({ bookId });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal Server Error" }] });
	}
});

module.exports = router;
