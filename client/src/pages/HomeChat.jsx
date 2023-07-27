import React, { useEffect, useState, useRef } from "react";
import Contacts from "../components/Contacts";
import { getContacts } from "../services/contactService";
import useCurrentUser from "../customHooks/useCurrentUser";
import ChatContainer from "./../components/ChatContainer";
import {
	getConversation,
	newConversation,
	saveConversation,
} from "../services/conversationService";
import { io } from "socket.io-client";
import config from "../services/config.json";

function HomeChat(props) {
	const socket = useRef();

	const [contacts, setContacts] = useState([]);
	const [currentChat, setCurrentChat] = useState(undefined);
	const [currentConversation, setCurrentConversation] = useState(undefined);
	const [getConversationId, setConversationId] = useState(undefined);

	// get User from local storage
	const user = useCurrentUser();

	useEffect(() => {
		if (user) {
			socket.current = io(config.host); // Server host
			socket.current.emit("connect-user", user?._id);
		}
	}, [user]);

	useEffect(() => {
		async function fetchContacts() {
			try {
				if (user && user._id) {
					const { data } = await getContacts(user._id);
					setContacts(data.contacts);
				}
			} catch (ex) {
				console.error("Error fetching contacts:", ex);
			}
		}

		fetchContacts();
	}, [user]);

	useEffect(() => {
		async function fetchMessages() {
			try {
				if (user?._id && currentChat?._id) {
					const { data: conversation } = await getConversation(
						user._id,
						currentChat._id
					);
					if (conversation) {
						setCurrentConversation(conversation.messages);
						setConversationId(conversation._id);
					}
				}
			} catch (ex) {
				console.error("Error fetching conversation:", ex);
			}
		}

		async function createNewConversation() {
			try {
				if (user?._id && currentChat?._id) {
					const { data: conversation } = await newConversation(
						user._id,
						currentChat._id
					);

					if (conversation) {
						setCurrentConversation(conversation.messages);
						setConversationId(conversation._id);
					}
				}
			} catch (ex) {
				console.error("Error creating conversation:", ex);
			}
		}

		createNewConversation();
		fetchMessages();
	}, [currentChat, user]);
	// // console.log("response", currentConversation);
	// // console.log("user", user);
	// // console.log("contacts", contacts);
	// console.log("currentchat", currentChat);
	// console.log("conversationId", getConversationId);

	const handleMessage = async (message) => {
		// !message parameter is just a string
		socket.current.emit("send-msg", {
			message: message,
			receiver: currentChat?._id,
		});

		setCurrentConversation((prevMessages) => [
			...prevMessages,
			{
				sender: {
					// To ensure the correct sender
					_id: user?._id,
					username: user?.username,
				},
				content: message,
			},
		]);
		await saveConversation(getConversationId, user, message);
	};

	useEffect(() => {
		if (socket.current) {
			socket.current.on("msg-receive", (messageContent) => {
				setCurrentConversation((prevMessages) => [
					...prevMessages,
					{
						content: messageContent,
					},
				]);
			});
		}
	}, [user]);

	const handleChatChange = (chat) => {
		setCurrentChat(chat);
	};

	return (
		<div className="chat-container">
			<Contacts
				user={user}
				contacts={contacts}
				onChangeChat={handleChatChange}
			/>
			{currentChat ? (
				<ChatContainer
					conversationId={getConversationId}
					currentChat={currentChat}
					setCurrentConversation={setCurrentConversation}
					messages={currentConversation}
					socket={socket}
					onSendMessage={handleMessage}
				/>
			) : null}
		</div>
	);
}

export default HomeChat;
