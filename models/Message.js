const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
	{
		text: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			default: Date.now,
		},
		thread: {
			type: Schema.Types.ObjectId,
			ref: "thread",
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "user",
		},
	},
	{
		timestamps: {
			createdAt: "createdAt",
			updatedAt: "updatedAt",
		},
	}
);

module.exports = Message = mongoose.model("message", MessageSchema);
