const mongoose = require("mongoose");

module.exports = function () {
	const db = process.env.MONGO_URL;

	mongoose
		.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
		.then(() => console.log(`Connected to MongoDB ${db}`))
		.catch((err) => console.error(`Could not connect to MongoDB ${err}`));
};
