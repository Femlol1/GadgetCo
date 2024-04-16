import React from "react";
import { useLocation } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import AdminNav from "../../admin/AdminNav";
import Routers from "../../routers/Routers";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const theme = {
	background: "#f5f8fb",
	fontFamily: "Montserrat",
	headerBgColor: "#0a1d37",
	headerFontColor: "#fff",
	headerFontSize: "15px",
	botBubbleColor: "#0a1d37",
	botFontColor: "#fff",
	userBubbleColor: "#fff",
	userFontColor: "#4a4a4a",
};

const Layout = () => {
	const location = useLocation();
	return (
		<>
			{location.pathname.startsWith("/dashboard") ? <AdminNav /> : <Header />}

			<div>
				<Routers />
			</div>
			<ThemeProvider theme={theme}> </ThemeProvider>
			<Footer />
		</>
	);
};

export default Layout;
