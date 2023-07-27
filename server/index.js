const express = require("express");
const cors = require("cors");
// const http = require("http");
const socket = require("socket.io");
const app = express();
// const server = http.createServer(app);
// const io = socketio(server);

require("dotenv").config();
require("./startup/db")();
// require("./startup/cors")(app);
app.use(cors());
require("./startup/routes")(app);

const port = process.env.PORT || 9000;
const server = app.listen(port, () =>
	console.log(`Listening to PORT ${port}...`)
);

const io = socket(server, {
	cors: {
		origin: "http://localhost:3000",
		credentials: true,
	},
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
	global.chatSocket = socket;

	socket.on("connect-user", (userId) => {
		onlineUsers.set(userId, socket.id);
	});

	socket.on("send-msg", (data) => {
		const messageContent = data.message;

		const sendUserSocket = onlineUsers.get(data.receiver);
		// If the receiver is online, receiver will see the realtime message, otherwise the message stored in the database.
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit("msg-receive", messageContent);
		}
	});

	socket.on("disconnect", () => {
		console.log(`A user disconnected with socket id: ${socket.id}`);
	});
});
