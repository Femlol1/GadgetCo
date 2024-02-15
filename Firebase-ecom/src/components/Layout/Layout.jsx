import React from "react";
import { ThemeProvider } from 'styled-components';
import Routers from "../../routers/Routers";
import Chatbot from "../Chatbot/Chatbot";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
const theme = {
  background: '#f5f8fb',
  fontFamily: 'Helvetica Neue',
  headerBgColor: '#0a1d37',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#0a1d37',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};


const Layout = () => {
  return (
    <>
      <Header />
      <div>
        <Routers />
      </div>
      <ThemeProvider theme={theme}>
      <Chatbot /></ThemeProvider>
      <Footer />
    </>
  );
};

export default Layout;
