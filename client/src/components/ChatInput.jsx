import React, { useState } from "react";
import InputForm from "./widgets/InputForm";
import Button from "./widgets/Button";

function ChatInput({ onSendMessage }) {
	const [value, setValue] = useState("");

	const doSubmit = (e) => {
		e.preventDefault();
		if (value.length > 0) {
			onSendMessage(value);
			setValue("");
		}
	};

	return (
		<>
			<form className="input-container" onSubmit={(e) => doSubmit(e)}>
				<InputForm
					type={"text"}
					name={"message"}
					placeholder={"Type your message here..."}
					value={value}
					onChange={(e) => setValue(e.currentTarget.value)}
					className={"input-form text-black pl-4 text-lg ml-4 "}
				/>
				<Button className={"pr-4"}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-10 h-10 text-cyan-500">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
						/>
					</svg>
				</Button>
			</form>
		</>
	);
}

export default ChatInput;
