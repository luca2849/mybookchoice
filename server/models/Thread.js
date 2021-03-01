const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ThreadSchema = new Schema(
	{
		users: [
			{
				type: Schema.Types.ObjectId,
				ref: "user",
			},
		],
	},
	{
		timestamps: {
			createdAt: "createdAt",
			updatedAt: "updatedAt",
		},
	}
);

module.exports = Thread = mongoose.model("thread", ThreadSchema);
