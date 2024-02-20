import React from 'react';
import ChatBotUi from 'react-simple-chatbot';
import '../Chatbot/chatbot.css';

const Chatbot = () => {
  return (
    <>
    <ChatBotUi
    headerTitle="Customer service Chatbot"
    steps={[
      {
        id: '1',
        message: 'What is your name?',
        trigger:2,
      },
      {
        id: '2',
        user:true,
        trigger: '3'
      },
      
      {
        id: '3',
        message: 'Hi {previousValue}, nice to meet you, what can I do for you today?',
        end:true
      },
      
      
    ]}
    
    floating={true}>
      </ChatBotUi></>
  
  )
}

export default Chatbot