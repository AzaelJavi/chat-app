const express = require("express");
const router = express.Router();
const { User, validationJoi } = require("../models/user-model");
const validate = require("../middleware/validationJoi");
const bcrypt = require("bcrypt");
const _ = require("lodash");

router.get("/", async (req, res) => {
	const user = await User.find().sort("username");
	res.send(user);
});

router.get("/:id", async (req, res) => {
	const user = await User.findById(req.params.id).populate({
		path: "notifications",
		options: { sort: { createdAt: -1 } }, // Sort notifications by createdAt field in descending order
		select: "-receiverData", // Exclude receiverData field
	});

	if (!user) return res.status(404).send("User not found.");

	res.send(user);
});

router.post("/", [validate(validationJoi)], async (req, res) => {
	let user = await User.findOne({ email: req.body.email });
	if (user) return res.status(400).send("Email is already registered.");

	// Used pick method from lodash
	user = new User(_.pick(req.body, ["username", "email", "password"]));

	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	await user.save();

	const token = user.generateAuthToken(); // called the method from user-model
	res
		.header("x-auth-token", token)
		.header("access-control-expose-headers", "x-auth-token")
		.send(_.pick(user, ["_id", "username", "email"])); // exclude the password from the response.
});

module.exports = router;
