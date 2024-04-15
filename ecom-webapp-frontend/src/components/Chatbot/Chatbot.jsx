import React, { useEffect, useState } from "react";
import "../Chatbot/chatbot.css";

function Chatbot() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [isExpanded, setIsExpanded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [isMinimized, setIsMinimized] = useState(false); // New state to track if the chatbot is minimized

	useEffect(() => {
		// This function runs when the chatbot component is mounted
		const greetingMessage = {
			text:
				"Hello! My name is GadgetCo.\n I am your customer service chatbot.\n  How can I assist you today?",
			sender: "bot",
		};
		setMessages([greetingMessage]); // Set the initial message
	}, []); // The empty array ensures this effect runs only once on mount

	const handleInputChange = (e) => {
		setInput(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		const userMessage = { text: input, sender: "user" };
		setMessages((messages) => [...messages, userMessage]);
		handleTypingIndicator();

		try {
			const response = await fetch("http://localhost:5000/get", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message: input }),
			});
			if (!response.ok) {
				setError(`HTTP error! status: ${response.status}`);
				setIsLoading(false);
				return;
			}
			const responseData = await response.json();
			const botMessage = {
				text: responseData.response,
				sender: "bot",
				sentiment: responseData.sentiment,
			};
			setMessages((messages) => [...messages, botMessage]);
			setIsLoading(false);
		} catch (error) {
			console.error("Failed to fetch:", error);
			setError("Error connecting to the chat service.");
			const errorMessage = {
				text: "Error connecting to the chat service.",
				sender: "bot",
			};
			setMessages((messages) => [...messages, errorMessage]);
			setIsLoading(false);
		}

		setInput("");
	};

	const toggleSize = () => {
		setIsExpanded(!isExpanded);
		if (isMinimized) {
			setIsMinimized(false);
		}
	};

	const minimizeChatbot = () => {
		setIsMinimized(true);
		setIsExpanded(false); // Ensure the chatbot is not expanded when minimized
	};

	const handleTypingIndicator = () => {
		const typingMessage = { text: "GadgetCo is typing...", sender: "bot" };
		setMessages((messages) => [...messages, typingMessage]);

		setTimeout(() => {
			setMessages((messages) =>
				messages.filter((msg) => msg.text !== "GadgetCo is typing...")
			);
		}, 1000);
	};

	return (
		<div>
			{!isMinimized ? (
				<div className={`chatbot ${isExpanded ? "expanded" : "compact"}`}>
					<div className="chatbot-header">
						GadgetCo Chatbot
						<div className="header-buttons">
							<button className="resize-button" onClick={toggleSize}>
								{isExpanded ? "-" : "+"} {/* Changed for better visibility */}
							</button>
							<button className="resize-button" onClick={minimizeChatbot}>
								X
							</button>
						</div>
					</div>
					{error && <div className="error-message">{error}</div>}
					{isLoading && <div className="loading">Loading...</div>}
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
			) : (
				<button className="chatbot-icon" onClick={() => setIsMinimized(false)}>
					🗨️
				</button>
			)}
		</div>
	);
}

export default Chatbot;
