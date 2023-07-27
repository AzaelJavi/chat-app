import React, { useEffect, useState } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { saveConversation } from "../services/conversationService";
import useCurrentUser from "../customHooks/useCurrentUser";

function ChatContainer({
	currentChat,
	messages,
	setCurrentConversation,
	conversationId,
	socket,
}) {
	const user = useCurrentUser();
	const handleMessage = async (message) => {
		//message parameter is just a string
		socket.current.emit("send-msg", {
			message: message,
			receiver: currentChat?._id,
		});

		setCurrentConversation((prevMessages) => [
			...prevMessages,
			{ message: { content: message } },
		]);
		await saveConversation(conversationId, user, message);
	};

	useEffect(() => {
		if (socket.current) {
			socket.current.on("msg-receive", (messageContent) => {
				setCurrentConversation((prevMessages) => [
					...prevMessages,
					{ message: { content: messageContent } },
				]);
			});
		}

		return () => {
			socket.current.off("msg-receive");
		};
	}, [user]);
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
