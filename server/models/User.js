const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		externalId: {
			idType: { type: String },
			id: { type: String },
		},
		location: {
			type: String,
		},
		password: {
			type: String,
		},
		dob: {
			type: Date,
			required: true,
		},
		profileImage: {
			imageType: {
				type: String,
				required: true,
				default: "INTERNAL",
			},
			url: {
				type: String,
				required: true,
				default: "default.jpg",
			},
		},
		preferences: {
			genres: [{ type: String }],
			types: [{ type: String }],
			authors: [{ type: String }],
		},
		ratings: [
			{
				type: new mongoose.Schema(
					{
						book_id: {
							type: Schema.Types.ObjectId,
							ref: "book",
						},
						rating: {
							type: Number,
							enum: [1, 0, -1],
							required: true,
						},
					},
					{ timestamps: true }
				),
			},
		],
		friends: [
			{
				user: {
					type: Schema.Types.ObjectId,
					ref: "user",
				},
				since: {
					type: Date,
					required: true,
				},
			},
		],
	},
	{
		timestamps: {
			createdAt: "registered",
			updatedAt: "updatedAt",
		},
	}
);

module.exports = User = mongoose.model("user", UserSchema);
