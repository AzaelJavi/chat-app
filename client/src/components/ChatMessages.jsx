import React, { useEffect, useRef } from "react";
import useCurrentUser from "../customHooks/useCurrentUser";

function ChatMessages({ messages }) {
	const user = useCurrentUser();

	const scroll = useRef();

	useEffect(() => {
		scroll?.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className="chat-messages">
			{messages &&
				messages.map((message, index) => {
					const messagePosition =
						message.sender?._id === user?._id
							? "sender__position"
							: "receiver__position";

					const messageColor =
						message.sender?._id === user?._id
							? "send-message"
							: "receive-message";
					return (
						<div ref={scroll} key={index}>
							<div className={`message ${messagePosition}`}>
								<div className={`message__content  ${messageColor}`}>
									<p>{message.content}</p>
								</div>
							</div>
						</div>
					);
				})}
		</div>
	);
}

export default ChatMessages;
