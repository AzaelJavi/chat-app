const express = require("express");
const { User } = require("../models/user-model");
const router = express.Router();

router.get("/:id", async (req, res) => {
	try {
		const getContacts = await User.findById(req.params.id)
			.populate({ path: "contacts", select: "username" })
			.select("contacts");
		if (!getContacts) return res.status(404).send("User not found.");

		res.send(getContacts);
	} catch (ex) {
		return res.status(500).send(`Something bad happened... ${ex}`);
	}
});

module.exports = router;
