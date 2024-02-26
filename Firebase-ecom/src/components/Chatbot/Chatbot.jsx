import React from "react";
import ChatBotUi from "react-simple-chatbot";
import Avatar from "../../assets/images/user-icon.png";
import "../Chatbot/chatbot.css";

const Chatbot = () => {
	return (
		<section>
			<ChatBotUi
				headerTitle="Customer service Chatbot"
				placeholder="Have Fun..."
				botAvatar={Avatar}
				steps={[
					{
						id: "1",
						message: "Hi, I'm the Chatbot for Gadgetco, Would you like to talk",
						trigger: 2,
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
						message: "What is your name?",
						trigger: 4,
					},
					{
						id: "4",
						user: true,
						trigger: "5",
					},

					{
						id: "5",
						message:
							"Hi {previousValue}, nice to meet you, what can I do for you today?",
						trigger: 6,
					},
					{
						id: "6",
						options: [
							{
								value: 1,
								label: "Would You like to start again",
								trigger: "1",
							},
							{ value: 2, label: "Good bye", end: true },
						],
					},
				]}
				floating={true}
			></ChatBotUi>
		</section>
	);
};

export default Chatbot;
