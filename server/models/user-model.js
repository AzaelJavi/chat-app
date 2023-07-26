const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 255,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 255,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
	},
	contacts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	notifications: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Notification",
		},
	],
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{
			_id: this._id,
			username: this.username,
			email: this.email,
		},
		process.env.PRIVATE_KEY
	);

	return token;
};

const User = mongoose.model("User", userSchema);

function validationJoi(req) {
	const schema = Joi.object({
		username: Joi.string().required().min(3).max(255),
		email: Joi.string().required().min(3).max(255).email(),
		password: Joi.string().required().min(8),
	});

	return schema.validate(req);
}

module.exports = {
	User,
	validationJoi,
};
