const express = require("express");
const users = require("../router/users");
const auth = require("../router/auth");
const notifications = require("../router/addContacts");
const contacts = require("../router/contacts");

module.exports = function (app) {
	app.use(express.json());
	app.use("/api/users", users);
	app.use("/api/auth", auth);
	app.use("/api/add-contacts", notifications);
	app.use("/api/contacts", contacts);
};
