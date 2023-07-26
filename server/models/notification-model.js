const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const notificationSchema = new mongoose.Schema({
	type: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	receiverData: {
		type: new mongoose.Schema({
			username: {
				type: String,
				required: true,
				trim: true,
			},
		}),
	},
	senderData: {
		type: new mongoose.Schema({
			username: {
				type: String,
				required: true,
				trim: true,
			},
		}),
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

const Notification = mongoose.model("Notification", notificationSchema);

function validationJoi(req) {
	const schema = Joi.object({
		receiverId: Joi.objectId().required(),
		senderId: Joi.objectId().required(),
		type: Joi.string().required().min(3).max(100),
		message: Joi.string().required().min(3).max(255),
	});

	return schema.validate(req);
}
module.exports = {
	Notification,
	validationJoi,
};
