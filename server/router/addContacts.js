const express = require("express");
const { User } = require("../models/user-model");
const { Notification, validationJoi } = require("../models/notification-model");
const router = express.Router();
const validate = require("../middleware/validationJoi");

router.get("/", async (req, res) => {
	const notif = await Notification.find().sort("-createdAt");
	res.send(notif);
});

router.post("/", [validate(validationJoi)], async (req, res) => {
	try {
		let receiver = await User.findById(req.body.receiverId);
		let sender = await User.findById(req.body.senderId);
		const newNotification = new Notification({
			type: req.body.type,
			message: req.body.message,
			receiverData: {
				_id: receiver._id,
				username: receiver.username,
			},
			senderData: {
				_id: sender._id,
				username: sender.username,
			},
		});

		receiver.notifications.push(newNotification);

		await newNotification.save();
		await receiver.save();

		return res.send(receiver);
	} catch (ex) {
		return res.status(500).send(`Something bad happened.. ${ex}`);
	}
});

router.put("/:id", async (req, res) => {
	try {
		const userId = req.params.id;
		const senderId = req.body.senderId;

		const user = await User.findById(userId);

		if (!user) return res.status(404).send("User not found.");

		if (!user.contacts.includes(senderId)) {
			user.contacts.push(senderId);
			await user.save();

			return res.send(user);
		}

		return res.send(`${senderId} already in your contact list.`);
	} catch (ex) {
		return res.status(500).send(`Something bad happened.. ${ex}`);
	}
});

module.exports = router;
