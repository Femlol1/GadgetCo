import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Container, Row } from "reactstrap";
import logo from "../../assets/images/eco-logo.png";
import userIcon from "../../assets/images/user-icon.png";
import useAuth from "../../custom-hooks/useAuth";
import { auth } from "../../firebase.config";
import "./header.css";

const nav__links = [
	{
		path: "home",
		display: "Home",
	},
	{
		path: "shop",
		display: "Shop",
	},
	{
		path: "cart",
		display: "Cart",
	},
];

const Header = () => {
	const headerRef = useRef(null);
	const totalQuantity = useSelector((state) => state.cart.totalQuantity);

	const menuRef = useRef(null);
	const profileActionRef = useRef(null);
	const navigate = useNavigate();
	const { currentUser } = useAuth();

	const stickyHeaderFunction = () => {
		window.addEventListener("scroll", () => {
			if (
				document.body.scrollTop > 80 ||
				document.documentElement.scrollTop > 80
			) {
				headerRef.current.classList.add("sticky__header");
			} else {
				headerRef.current.classList.remove("sticky__header");
			}
		});
	};

	const logout = () => {
		signOut(auth)
			.then(() => {
				toast.success("Logged out");
				navigate("/home");
			})
			.catch((err) => {
				toast.error(err.message);
			});
	};
	useEffect(() => {
		stickyHeaderFunction();
		return () => window.removeEventListener("scroll", stickyHeaderFunction);
	});
	const menuToggle = () => menuRef.current.classList.toggle("active__menu");

	const navToCart = () => {
		navigate("/cart");
	};

	const toggleProfileActions = () => {
		profileActionRef.current.classList.toggle("show__profileActions");
		console.log("Clicked logo");
	};

	return (
		<header className="header" ref={headerRef}>
			<Container>
				<Row>
					<div className="nav__wrapper">
						<div className="logo" onClick={() => navigate("/home")}>
							<img src={logo} alt="logo" />
							<div>
								<h1>GadgetCo</h1>
							</div>
						</div>
						<div className="navigation" ref={menuRef} onClick={menuToggle}>
							<ul className="menu">
								{nav__links.map((item, index) => (
									<li className="nav__item" key={index}>
										<NavLink
											to={item.path}
											className={(navClass) =>
												navClass.isActive ? "nav_Active" : ""
											}
										>
											{item.display}
										</NavLink>
									</li>
								))}
							</ul>
						</div>
						<div className="nav__icons">
							<span className="fav__icon">
								<i class="ri-heart-line"></i>
								<span className="badge">1</span>
							</span>
							<span className="cart__icon" onClick={navToCart}>
								<i class="ri-shopping-bag-line"></i>
								<span className="badge">{totalQuantity}</span>
							</span>
							<div className="profile">
								<div className="profile__logo">
									<motion.img
										whileTap={{ scale: 1.2 }}
										src={
											currentUser && currentUser
												? currentUser.photoURL
												: userIcon
										}
										alt=""
										onClick={toggleProfileActions}
									/>
								</div>
								<div
									className="profile__actions"
									ref={profileActionRef}
									onClick={toggleProfileActions}
								>
									{currentUser ? (
										<div className=" d-flex align-items-center justify-content-center flex-column">
											<span onClick={logout}>Logout</span>
											<Link to="/dashboard">Dashboard</Link>
										</div>
									) : (
										<div className=" d-flex align-items-center justify-content-center flex-column">
											<Link to="/signup">SignUp</Link>
											<Link to="/login">Login</Link>
										</div>
									)}
								</div>
							</div>
							<div className="mobile__menu">
								<span onClick={menuToggle}>
									<i class="ri-menu-line"></i>
								</span>
							</div>
						</div>
					</div>
				</Row>
			</Container>
		</header>
	);
};

export default Header;
