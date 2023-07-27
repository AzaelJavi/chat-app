import React, { useState } from "react";

function Contacts({ user, contacts, onChangeChat }) {
	const [selectedChat, setSelectedChat] = useState(undefined);

	const handleChatSelected = (contact, index) => {
		setSelectedChat(index);
		onChangeChat(contact);
	};
	return (
		<div className="contacts-container">
			<div className="brand">
				<h1 className="uppercase text-center text-3xl font-semibold my-4">
					woki toki
				</h1>
			</div>
			<div className="contacts">
				{contacts.map((contact, index) => {
					return (
						<div
							key={index}
							className={`contact__user ${
								index === selectedChat ? "selected__contact" : ""
							}`}
							onClick={() => handleChatSelected(contact, index)}>
							<div>Avatar</div>
							<div>
								<h3>{contact.username}</h3>
							</div>
						</div>
					);
				})}
			</div>
			<div className="current-user">
				<div className="flex">
					<div className="avatar">Avatar</div>
					<div className="username">
						<h2 className="">{user.username}</h2>
					</div>
				</div>
				<div>
					<div>Option Icon</div>
				</div>
			</div>
		</div>
	);
}

export default Contacts;
