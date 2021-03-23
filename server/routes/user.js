// Express & Routing
const express = require("express");
const router = express.Router();
// File Uploads
const multer = require("multer");
// ID Generation
const idGen = require("../util/idGen");
// File System
const fs = require("fs");
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
		const user = await User.findOne({ _id: req.user.id }).select(
			"-password -__v"
		);
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

// GET /api/user/:username
// Purpose - Get user data by username
// Access - Private
router.get("/:username", auth, async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username }).select("-password -__v");
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
			req.body.formData,
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
		console.log(error);
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
		const file = req.file;
		const user = await User.findOne({ _id: req.user.id }).select(
			"-password"
		);
		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}
		const oldAvatar = user.profileImage;
		try {
			if (oldAvatar !== "default.jpg") {
				fs.unlinkSync(`./public/profileImages/${oldAvatar}`);
			}
		} catch (error) {
			console.log("Error deleting old avatar", error);
		}
		user.profileImage = file.filename;
		await user.save();
		return res.status(200).json(user);
	}
);

module.exports = router;
