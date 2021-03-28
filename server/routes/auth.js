// Express & Routing
const express = require("express");
const router = express.Router();
// Environment Variables
const config = require("config");
// Value Validation
const { check, validationResult } = require("express-validator");
// Date Formatting
const moment = require("moment");
// Password Encryption Module
const bcrypt = require("bcryptjs");
// Tokens
const jwt = require("jsonwebtoken");
// Mongo Models
const User = require("../models/User");

// POST /api/auth/register/email
// Purpose - Create a new User
// Access - Public
router.post(
	"/register/email",
	[
		check("email", "Email is required").not().isEmpty(),
		check("email", "A valid email is required").isEmail(),
		check("username", "Username is required").not().isEmpty(),
		check("password", "A valid password is required").not().isEmpty(),
		check("confirmation", "A valid confirmation password is required")
			.not()
			.isEmpty(),
		check(
			"password",
			"Password must be at least 6 characters long"
		).isLength({ min: 6 }),
		check("name", "Name is required").not().isEmpty(),
		check("dob", "DOB is required").not().isEmpty(),
	],
	async (req, res) => {
		// Check validation result
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const {
			name,
			email,
			username,
			password,
			location,
			confirmation,
			dob,
		} = req.body;
		// Check passwords match

		if (password !== confirmation) {
			return res
				.status(400)
				.json({ errors: [{ msg: "Passwords do not match" }] });
		}
		// Query database
		try {
			// Check if e-mail is already registered
			let emailCheck = await User.findOne({ email });
			if (emailCheck) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Email already registered" }] });
			}
			// Check if username exists
			const usernameCheck = await User.findOne({ username });
			if (usernameCheck) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Username is taken" }] });
			}
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
			// Compile Date
			const dateDOB = moment.utc(dob, "DD-MM-YYYY").toDate();
			// Validation Over
			const newUser = new User({
				name,
				username,
				email,
				location,
				password,
				dob: dateDOB,
			});
			const salt = await bcrypt.genSalt(10);
			newUser.password = await bcrypt.hash(password, salt);
			await newUser.save();
			// Create user token
			const payload = {
				user: {
					id: newUser._id,
				},
			};
			const token = jwt.sign(payload, config.get("jwtSecret"), {
				expiresIn: config.get("jwtExpiry"),
			});
			return res.status(200).json({ token });
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.json({ errors: [{ msg: "Internal server error" }] });
		}
	}
);

// POST /api/auth/login/email
// Purpose - Log In a user
// Access - Public
router.post(
	"/login/email",
	[
		check("email", "Email is required").not().isEmpty(),
		check("email", "A valid email is required").isEmail(),
		check("password", "A valid password is required").not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;
		try {
			const user = await User.findOne({ email: email });
			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid log in details" }] });
			}
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid log in details" }] });
			}
			// Create JWT
			const payload = {
				user: {
					id: user._id,
				},
			};
			const token = jwt.sign(payload, config.get("jwtSecret"), {
				expiresIn: config.get("jwtExpiry"),
			});
			return res.json({ token });
		} catch (error) {
			return res
				.status(500)
				.json({ errors: [{ msg: "Internal server error" }] });
		}
	}
);

module.exports = router;
