const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const app = express();

require("dotenv").config();
require("./startup/db")();
require("./startup/routes")(app);
app.use(cors());

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

io.on("connection", (socket) => {
	socket.on("connect-user", (userId) => {
		console.log(`Connected ${userId} with this socket ${socket.id}`);
	});

	socket.on("join-conversation", (conversationId) => {
		if (conversationId) {
			socket.join(conversationId);
			console.log(`${socket.id} Joined the conversation ${conversationId}`);

			// Get the list of users in the conversation room
			const room = io.sockets.adapter.rooms.get(conversationId);
			if (room) {
				const usersInRoom = Array.from(room.keys()); // Get the socket IDs of users in the room

				// Log the users that have joined the room
				console.log(`Users in room ${conversationId}:`, usersInRoom);
			}
		}
	});

	socket.on("send-message", (conversationId, currentChat, message) => {
		if (conversationId) {
			socket.to(conversationId).emit("receive-message", message);
			// console.log(`Received message ${message} from ${socket.id}`);
			// console.log(`receiver: ${currentChat} Socket ID: ${socket.id}`);
			// console.log(`Conversation ID: ${conversationId}`);
		}
	});
});
