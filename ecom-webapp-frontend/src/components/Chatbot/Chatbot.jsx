import React from "react";
import ChatBot from "react-simple-chatbot";
import Avatar from "../../assets/images/user-icon.png";
import "../Chatbot/chatbot.css";

const Chatbot = () => {
	return (
		<section>
			<ChatBot
				headerTitle="Customer Service Chatbot"
				placeholder="Please type your message..."
				botAvatar={Avatar}
				steps={[
					{
						id: "1",
						message:
							"Hi, I'm the Chatbot for Gadgetco. Would you like to talk?",
						trigger: "2",
					},
					{
						id: "2",
						options: [
							{ value: 1, label: "Sure", trigger: "3" },
							{ value: 2, label: "No", end: true },
						],
					},
					{
						id: "3",
						message: "Great! What's your name?",
						trigger: "4",
					},
					{
						id: "4",
						user: true,
						trigger: "5",
					},
					{
						id: "5",
						message:
							"Hi {previousValue}, nice to meet you! How can I assist you today?",
						trigger: "6",
					},
					{
						id: "6",
						options: [
							{ value: 1, label: "Check Order Status", trigger: "7" },
							{ value: 2, label: "Return an Item", trigger: "10" },
							{ value: 3, label: "Talk to Support", trigger: "13" },
							{ value: 4, label: "Feedback", trigger: "15" },
						],
					},
					{
						id: "7",
						message: "Please enter your order ID.",
						trigger: "8",
					},
					{
						id: "8",
						user: true,
						trigger: "9",
					},
					{
						id: "9",
						message:
							"Thanks! We are checking the status of order {previousValue}.",
						end: true,
					},
					{
						id: "10",
						message:
							"Please enter the order ID for the item you want to return.",
						trigger: "11",
					},
					{
						id: "11",
						user: true,
						trigger: "12",
					},
					{
						id: "12",
						message:
							"Thanks! We've initiated the return process for order {previousValue}.",
						end: true,
					},
					{
						id: "13",
						message: "Please hold while I connect you to a support agent.",
						end: true,
					},
					{
						id: "15",
						message:
							"We value your feedback! Please share your experience with us.",
						trigger: "16",
					},
					{
						id: "16",
						user: true,
						trigger: "17",
					},
					{
						id: "17",
						message: "Thank you for your feedback!",
						end: true,
					},
					{
						id: "6-repeat",
						message: "Would you like to do anything else?",
						trigger: "6-options-repeat",
					},
					{
						id: "6-options-repeat",
						options: [
							{ value: 1, label: "Yes", trigger: "6" },
							{ value: 2, label: "No, thank you.", end: true },
						],
					},
				]}
				floating={true}
			/>
		</section>
	);
};

export default Chatbot;
