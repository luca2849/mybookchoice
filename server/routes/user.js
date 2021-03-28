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
				console.log("Error deleting old avatar", error);
			}
			user.profileImage = file.filename;
			await user.save();
			return res.status(200).json(user);
		} catch (error) {
			console.log(error);
			return res
				.status(500)
				.json({ errors: [{ msg: "Internal server error" }] });
		}
	}
);

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
							"If you email exists, a link to reset your password has been sent.",
					},
				],
			});
		// Get client URL
		const url = `${config.get("client_url")}`;
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
						"If you email exists, a link to reset your password has been sent.",
				},
			],
		});
	} catch (error) {
		console.log(error);
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
	console.log(req.body);
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
		console.log(error);
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
		console.log(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

module.exports = router;
