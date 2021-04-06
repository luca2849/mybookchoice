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
// Axios
const axios = require("axios");
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

// POST /api/auth/google
// Purpose - Create a new / Log in a Google User
// Access - Public
router.post("/google", async (req, res) => {
	const { result, token, accessToken } = req.body;
	if (!result || !token || !accessToken)
		return res
			.status(400)
			.json({ errors: [{ msg: "Malformed Request." }] });
	const user = await User.findOne({
		"externalId.idType": "GOOGLE",
		"externalId.id": result.googleId,
	});
	// Verify Token
	const googleApiUrl = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`;
	try {
		await axios.get(googleApiUrl);
	} catch (error) {
		console.error(error);
		return res.status(400).json({ errors: [{ msg: "Token is invalid." }] });
	}
	try {
		if (!user) {
			// Create user
			const randomNumber = Math.round(Math.random() * 1000000);
			// Sort out DOB (From Google People API)
			const conf = {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					Accept: "application/json",
				},
			};
			const url = `https://people.googleapis.com/v1/people/me?personFields=birthdays`;
			const peopleApiRes = await axios.get(url, conf);
			const birthdayArray = peopleApiRes.data?.birthdays;
			let dob;
			for (const birthday of birthdayArray) {
				if (Object.keys(birthday.date).length === 3) {
					const { year, month, day } = birthday.date;
					const date = `${year}-${month}-${day}`;
					dob = moment.utc(date, "YYYY-MM-DD").toDate();
				}
			}
			const newUser = new User({
				externalId: { idType: "GOOGLE", id: result.googleId },
				username: `${result.givenName}${randomNumber}`,
				name: result.name,
				email: result.email,
				dob: dob,
				profileImage: {
					imageType: "EXTERNAL",
					url: result.imageUrl,
				},
			});
			await newUser.save();
			const payload = {
				user: {
					id: newUser._id,
				},
			};
			const tok = jwt.sign(payload, config.get("jwtSecret"), {
				expiresIn: config.get("jwtExpiry"),
			});
			return res.status(200).json({ token: tok });
		}
		// Otherwise, log in (return token)
		// Create JWT
		const payload = {
			user: {
				id: user._id,
			},
		};
		const tok = jwt.sign(payload, config.get("jwtSecret"), {
			expiresIn: config.get("jwtExpiry"),
		});
		return res.json({ token: tok });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

router.post("/facebook", async (req, res) => {
	const { accessToken, id } = req.body;
	console.log(accessToken);
	// Validate token
	const check = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${config.get(
		"FACEBOOK_APP_ACCESS_TOKEN"
	)}`;
	try {
		const resp = await axios.get(check);
		const valid = resp.data.data.is_valid;
		if (!valid)
			return res.status(401).json({
				errors: [{ msg: "Token is invalid. Please try again." }],
			});
		// Check if user exists
		const user = await User.findOne({
			"externalId.idType": "FACEBOOK",
			"externalId.id": id,
		});
		if (!user) {
			// Register new Facebook user
			// Query Google API for user data
			const url = `https://graph.facebook.com/${id}?fields=name,picture,birthday,email,hometown&access_token=${accessToken}`;
			const response = await axios.get(url);
			console.log(response.data);
			const { name, picture, birthday, email } = response.data;
			const dob = moment.utc(birthday, "MM/DD/YYYY").toDate();
			const randomNumber = Math.round(Math.random() * 1000000);
			const username = `${name.split(" ")[0]}${randomNumber}`;
			console.log(picture.data.url);
			const newUser = new User({
				name,
				username,
				dob,
				email,
				externalId: { idType: "FACEBOOK", id },
				profileImage: {
					imageType: "EXTERNAL",
					url: picture.data.url,
				},
			});
			await newUser.save();
			const payload = {
				user: {
					id: newUser._id,
				},
			};
			const tok = jwt.sign(payload, config.get("jwtSecret"), {
				expiresIn: config.get("jwtExpiry"),
			});
			return res.status(200).json({ token: tok });
		}
		const payload = {
			user: {
				id: user._id,
			},
		};
		const tok = jwt.sign(payload, config.get("jwtSecret"), {
			expiresIn: config.get("jwtExpiry"),
		});
		return res.json({ token: tok });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal server error" }] });
	}
});

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
