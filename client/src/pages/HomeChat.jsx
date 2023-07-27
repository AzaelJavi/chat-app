import React, { useEffect, useState } from "react";
import Contacts from "../components/Contacts";
import { getContacts } from "../services/contactService";
import useCurrentUser from "../customHooks/useCurrentUser";
import ChatContainer from "./../components/ChatContainer";
import {
	getConversation,
	newConversation,
} from "../services/conversationService";

function HomeChat(props) {
	const [contacts, setContacts] = useState([]);
	const [currentChat, setCurrentChat] = useState(undefined);
	const [currentConversation, setCurrentConversation] = useState(undefined);
	const [getConversationId, setConversationId] = useState(undefined);

	// get User from local storage
	const user = useCurrentUser();

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
				if (user._id && currentChat._id) {
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
				if (user._id && currentChat._id) {
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
	}, [currentChat]);
	// console.log("response", currentConversation);
	// console.log("user", user);
	// console.log("contacts", contacts);
	console.log("currentchat", currentChat);
	console.log("conversationId", getConversationId);

	const handleChatChange = (chat) => {
		setCurrentChat(chat);
		console.log("Handled", chat);
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
					messages={currentConversation}
				/>
			) : null}
		</div>
	);
}

export default HomeChat;
