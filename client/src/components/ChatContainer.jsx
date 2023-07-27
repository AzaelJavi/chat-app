import React from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import useCurrentUser from "../customHooks/useCurrentUser";
import { saveConversation } from "../services/conversationService";

function ChatContainer({ currentChat, messages, conversationId }) {
	const user = useCurrentUser();

	const handleMessage = async (message) => {
		console.log("ConversationId", conversationId);
		console.log("UserId", user);
		await saveConversation(conversationId, user, message);
	};

	return (
		<div className="message-container">
			<div className="chat__header grid-container">
				<div className="user-details flex">
					<div className="border-2 border-red-600 bg-white text-black break-words rounded-full">
						Avatar
					</div>
					<div className="username">
						<h3>{currentChat.username}</h3>
					</div>
				</div>
			</div>
			{<ChatMessages messages={messages} />}
			<ChatInput onSendMessage={handleMessage} />
		</div>
	);
}

export default ChatContainer;
