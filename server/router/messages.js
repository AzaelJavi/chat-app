const express = require("express");
const { Conversation, validationJoi } = require("../models/conversation-model");
const { User } = require("../models/user-model");
const validate = require("../middleware/validationJoi");
const router = express.Router();

router.get("/:currentUserId/:currentChatId", async (req, res) => {
	try {
		const { currentUserId, currentChatId } = req.params;
		const conversation = await Conversation.lookup(
			currentUserId,
			currentChatId
		);

		res.send(conversation);
	} catch (ex) {
		return res.status(500).send(`Something bad happened... ${ex}`);
	}
});

router.post("/", [validate(validationJoi)], async (req, res) => {
	try {
		const userId1 = await User.findById(req.body.userId1);
		const userId2 = await User.findById(req.body.userId2);

		const conversation = await Conversation.lookup(userId1, userId2);

		if (!conversation) {
			// if conversation is not found, create a new conversation
			const newConversation = new Conversation({
				participants: [
					{ _id: userId1._id, username: userId1.username },
					{ _id: userId2._id, username: userId2.username },
				],
				messages: [],
			});

			await newConversation.save();
			return res.send(newConversation);
		}

		res.send(conversation);
	} catch (ex) {
		return res.status(500).send(`Something bad happened... ${ex}`);
	}
});

router.put("/:id", async (req, res) => {
	try {
		const { userId, content } = req.body;

		const user = await User.findById(userId);

		const conversation = await Conversation.findById(req.params.id);

		if (!conversation) return res.status(404).send("Conversation not found.");

		// Check participants
		const isParticipant = conversation.participants.some(
			(participant) => participant.toString() === user._id.toString()
		);

		if (!isParticipant)
			return res
				.status(403)
				.send("User is not a participant in the conversation.");

		const message = {
			sender: {
				_id: user._id,
				username: user.username,
			},
			content,
		};

		conversation.messages.push(message);

		const updatedConversation = await conversation.save();

		res.send(updatedConversation);
	} catch (ex) {
		return res.status(500).send(`Something bad happened... ${ex}`);
	}
});

module.exports = router;
