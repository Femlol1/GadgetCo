import React, { useState } from "react";
import "../Chatbot/chatbot.css";

function Chatbot() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");

	const handleInputChange = (e) => {
		setInput(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const userMessage = { text: input, sender: "user" };
		setMessages((messages) => [...messages, userMessage]);

		const response = await fetch("http://localhost:5000/get", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message: input }),
		});
		const responseData = await response.json();
		const botMessage = { text: responseData.response, sender: "bot" };
		setMessages((messages) => [...messages, botMessage]);

		setInput("");
	};
	return (
		<div className="chatbot">
			<div className="chat-messages">
				{messages.map((message, index) => (
					<div key={index} className={`message ${message.sender}`}>
						{message.text}
					</div>
				))}
			</div>
			<form onSubmit={handleSubmit} className="chat-input">
				<input
					type="text"
					value={input}
					onChange={handleInputChange}
					placeholder="Type a message..."
				/>
				<button type="submit">Send</button>
			</form>
		</div>
	);
}
export default Chatbot;
