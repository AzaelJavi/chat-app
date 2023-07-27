import React, { useState } from "react";
import Button from "./widgets/Button";
import authService from "../services/authService";

function Contacts({ user, contacts, onChangeChat }) {
	const [selectedChat, setSelectedChat] = useState(undefined);

	const handleLogout = () => {
		authService.logout();
		window.location = "/login";
	};
	const handleChatSelected = (contact, index) => {
		setSelectedChat(index);
		onChangeChat(contact);
	};
	return (
		<div className="contacts-container">
			<div className="brand grid-item">
				<h1 className="uppercase text-center text-3xl font-semibold my-4">
					woki toki
				</h1>
			</div>
			<div className="contacts grid-item">
				{contacts.map((contact, index) => {
					return (
						<div
							key={index}
							className={`contact__user ${
								index === selectedChat ? "selected__contact" : "username"
							} `}
							onClick={() => handleChatSelected(contact, index)}>
							<div>Avatar</div>
							<div>
								<h3 className="ml-2">{contact.username}</h3>
							</div>
						</div>
					);
				})}
			</div>
			<div className="current-user grid-item ">
				<div className="flex items-center justify-center">
					<div className="avatar">Avatar</div>
					<div className="ml-2">
						<h2 className="">{user.username}</h2>
					</div>
				</div>
				<div>
					<div>
						<Button className={"mr-2"} onClick={handleLogout}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-10 h-10">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
								/>
							</svg>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Contacts;
