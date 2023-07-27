import React from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

function ChatContainer({ currentChat, messages, onSendMessage }) {
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
			<ChatInput onSendMessage={onSendMessage} />
		</div>
	);
}

export default ChatContainer;
