import React, { useState } from "react";
import "../Chatbot/chatbot.css";

function Chatbot() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [isExpanded, setIsExpanded] = useState(false); // State to track the size

	const handleInputChange = (e) => {
		setInput(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const userMessage = { text: input, sender: "user" };
		setMessages((messages) => [...messages, userMessage]);

		try {
			const response = await fetch("http://localhost:5000/get", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message: input }),
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const responseData = await response.json();
			const botMessage = { text: responseData.response, sender: "bot" };
			setMessages((messages) => [...messages, botMessage]);
		} catch (error) {
			console.error("Failed to fetch:", error);
			const errorMessage = {
				text: "Error connecting to the chat service.",
				sender: "bot",
			};
			setMessages((messages) => [...messages, errorMessage]);
		}

		setInput("");
	};
	const toggleSize = () => {
		setIsExpanded(!isExpanded);
	};
	return (
		<div className={`chatbot ${isExpanded ? "expanded" : "compact"}`}>
			<button className="resize-button" onClick={toggleSize}>
				{isExpanded ? "Minimize" : "Expand"}
			</button>
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
