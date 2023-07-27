const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { ObjectId } = mongoose.Types;

const conversationSchema = new mongoose.Schema({
	participants: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	messages: [
		{
			sender: {
				type: new mongoose.Schema({
					username: {
						type: String,
						trim: true,
						minlength: 3,
					},
				}),
			},
			content: {
				type: String,
				minlength: 0,
			},
			timestamp: {
				type: Date,
				default: Date.now,
			},
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

conversationSchema.statics.lookup = async function (
	currentUserId,
	currentChatId
) {
	// Convert the IDs to ObjectId before passing them to the query
	const convertedCurrentUserId = new ObjectId(currentUserId);
	const convertedCurrentChatId = new ObjectId(currentChatId);

	const conversation = await this.findOne({
		participants: {
			$all: [convertedCurrentUserId, convertedCurrentChatId],
		},
	});

	// We gonna return found conversation, otherwise return null

	return conversation;
};
const Conversation = mongoose.model("Conversation", conversationSchema);

function validationJoi(req) {
	const schema = Joi.object({
		userId2: Joi.objectId().required(),
		userId1: Joi.objectId().required(),
	});

	return schema.validate(req);
}

module.exports = {
	Conversation,
	validationJoi,
};
