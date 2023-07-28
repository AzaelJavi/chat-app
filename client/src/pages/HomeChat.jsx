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
	const [getDocumentConversation, setDocumentConversation] = useState(null);

	// get User from local storage
	const user = useCurrentUser();

	useEffect(() => {
		if (user) {
			socket.current = io(config.host); // Server host
			socket.current.emit("connect-user", user?._id);
		}

		return () => {
			if (socket.current) {
				socket.current.disconnect();
			}
		};
	}, [user]);

	useEffect(() => {
		if (socket.current && currentChat) {
			socket.current.emit("join-conversation", getDocumentConversation?._id);
		}
	}, [getDocumentConversation]);

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
		const handleMessageReceived = (messageContent) => {
			setCurrentConversation((prevMessages) => [
				...prevMessages,
				{
					sender: { _id: currentChat?._id, username: currentChat?.username },
					content: messageContent,
				},
			]);
		};

		if (socket.current) {
			socket.current.on("receive-message", handleMessageReceived);
		}

		return () => {
			if (socket.current && getDocumentConversation) {
				socket.current.off("receive-message", handleMessageReceived);
			}
		};
	}, [user]);

	const fetchMessages = async (contactId) => {
		try {
			const { data: conversation } = await getConversation(
				user?._id,
				contactId
			);
			if (conversation) {
				setCurrentConversation(conversation.message);
				setDocumentConversation(conversation);
			}
		} catch (ex) {
			console.log("Error fetching Conversation", ex);
		}
	};

	const createConversation = async (contactId) => {
		try {
			if (user?._id && contactId) {
				const { data: conversation } = await newConversation(
					user._id,
					contactId
				);

				if (conversation) {
					setCurrentConversation(conversation.messages);
					setDocumentConversation(conversation);
				}
			}
		} catch (ex) {
			console.log("Error creating conversation", ex);
		}
	};

	const handleMessage = async (message) => {
		// !message parameter is just a string
		const receiver = getDocumentConversation?.participants?.find(
			(participant) => participant === currentChat._id
		);

		if (receiver) {
			socket.current.emit(
				"send-message",
				getDocumentConversation?._id,
				receiver,
				message
			);

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
		}
		await saveConversation(getDocumentConversation?._id, user, message);
	};

	const handleChatChange = (chat) => {
		setCurrentChat(chat);

		fetchMessages(chat._id);
		createConversation(chat._id);
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
