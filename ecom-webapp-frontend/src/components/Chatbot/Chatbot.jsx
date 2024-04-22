import React, { useEffect, useRef, useState } from "react";
import chatbot_icon from "../../assets/images/chat-bot.svg";
import "../Chatbot/chatbot.css";
<link
	rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
/>;

function Chatbot() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [isExpanded, setIsExpanded] = useState(false);
	const [error, setError] = useState("");
	const [isMinimized, setIsMinimized] = useState(false); // New state to track if the chatbot is minimized
	const isMounted = useRef(true);
	const [sentimentGiven, setSentimentGiven] = useState({});

	useEffect(() => {
		isMounted.current = true;
		// This function runs when the chatbot component is mounted
		const greetingMessage = {
			text:
				"Hello! My name is GadgetCo.\n I am your customer service chatbot.\n  How can I assist you today?",
			sender: "bot",
			source: "AI",
		};
		setMessages([greetingMessage]); // Set the initial message

		return () => {
			isMounted.current = false;
		};
	}, []); // The empty array ensures this effect runs only once on mount

	const API_URL =
		"https://server-4tvhbvwe7q-ew.a.run.app" || "http://localhost:8080";

	const handleSentiment = (messageIndex, sentiment) => {
		// Assuming messageIndex corresponds to the bot's message.
		if (!sentimentGiven[messageIndex]) {
			const userMessage = messages[messageIndex - 1]; // Get the user message.
			const botMessage = messages[messageIndex]; // Get the bot message.

			if (
				userMessage &&
				botMessage &&
				userMessage.sender === "user" &&
				botMessage.sender === "bot"
			) {
				setSentimentGiven((currentSentiments) => ({
					...currentSentiments,
					[messageIndex]: true,
				}));

				// Now send the feedback.
				sendSentimentFeedback(
					userMessage.text,
					botMessage.text,
					sentiment,
					botMessage.source
				);
			}
		}
	};

	const sendSentimentFeedback = async (
		message,
		response,
		sentiment,
		source
	) => {
		try {
			const serverResponse = await fetch(API_URL + "/feedback", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message, response, sentiment, source }),
			});
			const responseData = await serverResponse.json();
			console.log("Feedback response:", responseData); // Log actual response from server.
			if (!serverResponse.ok) {
				throw new Error(`HTTP error! status: ${serverResponse.status}`);
			}
		} catch (error) {
			console.error("Failed to send sentiment feedback:", error);
			setError("Error sending sentiment feedback.");
		}
	};

	const sendMessage = async (userMessage) => {
		const typingMessage = {
			text: "GadgetCo is typing...",
			sender: "bot",
			source: "Typing",
		};
		setMessages((currentMessages) => [...currentMessages, typingMessage]);

		try {
			const response = await fetch(API_URL + "/get", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message: userMessage }),
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const responseData = await response.json();
			handleNewMessage(responseData.response, responseData.source);
		} catch (error) {
			console.error("Failed to fetch:", error);
			setError("Error connecting to the chat service.");
		}
	};
	const handleNewMessage = (responseText, responseSource) => {
		if (isMounted.current) {
			setMessages((currentMessages) =>
				currentMessages
					.filter((msg) => msg.text !== "GadgetCo is typing...")
					.concat({
						text: modifyResponse(responseText),
						sender: "bot",
						source: responseSource,
					})
			);
		}
	};

	const modifyResponse = (response) => {
		if (typeof response !== "string") {
			console.error("Expected responseText to be a string, got:", response);
			return ""; // Return a default string or handle this case appropriately.
		}
		const startDate = new Date();
		startDate.setDate(1); // Set the day to the 1st
		const endDate = new Date();
		endDate.setMonth(endDate.getMonth() + 1); // Set the month to the next month
		endDate.setDate(0);
		// Define replacements
		const replacements = {
			"{{Account Type}}": "Cheap",
			"{{Order Number}}": "123456789",
			"{{Order Tracking}}": "Order tracking",
			"{{Tracking Number}}": "20920399",
			"{{Invoice Number}}": "987654321",
			"{{Online Order Interaction}}": "replacement value",
			"{{Online Payment Interaction}}": "replacement value",
			"{{Online Navigation Step}}": "replacement value",
			"{{Online Customer Support Channel}}": "replacement value",
			"{{Profile}}": "cheap",
			"{{Profile Type}}": "Premium",
			"{{Settings}}": "replacement value",
			"{{Online Company Portal Info}}": "replacement value",
			"{{Date}}": new Date().toLocaleDateString(),
			"{{Date Range}}": `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
			"{{Shipping Cut-off Time}}": "5pm",
			"{{Delivery City}}": "Leicester",
			"{{Salutation}}": "Mr/Mrs",
			"{{Delivery Country}}": "United Kingdom",
			"{{Client First Name}}": "Femi",
			"{{Client Last Name}}": "Osibemekun",
			"{{Customer Support Phone Number}}": "07377788552",
			"{{Customer Support Email}}": "00158@student.le.ac.uk",
			"{{Customer Support Hours}}": "9am - 5pm",
			"{{Live Chat Support}}": "United Kingdom",
			"{{Website URL}}": "gadgetco-3794d.web.app",
			"{{Upgrade Account}}": "United Kingdom",
			"{{Account Category}}": "new",
			"{{Account Change}}": "Premium",
			"{{Program}}": "United Kingdom",
			"{{Refund Amount}}": "£300",
			"{{Money Amount}}": "£1000",
			"{{Store Location}}": "United Kingdom",
		};

		// Replace all placeholders with their corresponding replacements
		let modifiedResponse = response;
		for (let placeholder in replacements) {
			modifiedResponse = modifiedResponse.replace(
				new RegExp(placeholder, "g"),
				replacements[placeholder]
			);
		}

		return modifiedResponse;
	};

	const handleInputChange = (e) => {
		setInput(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		const userMessage = { text: input, sender: "user" };
		setMessages((messages) => [...messages, userMessage]);
		sendMessage(input);
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
		setIsExpanded(false);
	};

	return (
		<div>
			{!isMinimized ? (
				<div className={`chatbot ${isExpanded ? "expanded" : "compact"}`}>
					<div className="chatbot-header">
						GadgetCo Chatbot
						<div className="header-buttons">
							<button className="resize-button" onClick={toggleSize}>
								{isExpanded ? "-" : "+"}
							</button>
							<button className="close-button" onClick={minimizeChatbot}>
								x
							</button>
						</div>
					</div>
					{error && <div className="error-message">{error}</div>}

					<div className="chat-messages">
						{messages.map((message, index) => (
							<div key={index} className={`message ${message.sender}`}>
								{message.text}
								{/* Add a condition to check that feedback buttons should not be shown for the first message */}
								{message.sender === "bot" &&
									index !== 0 &&
									!sentimentGiven[index] && (
										<div className="sentiment-feedback">
											<button
												className="positive"
												onClick={() => handleSentiment(index, "positive")}
											>
												👍
											</button>
											<button
												className="neutral"
												onClick={() => handleSentiment(index, "neutral")}
											>
												😐
											</button>
											<button
												className="negative"
												onClick={() => handleSentiment(index, "negative")}
											>
												👎
											</button>
										</div>
									)}
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
					<img src={chatbot_icon} alt="chatbot logo" />
				</button>
			)}
		</div>
	);
}

export default Chatbot;
