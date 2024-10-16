import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Container, Row } from "reactstrap";
import logo from "../../assets/images/eco-logo.png";
import userIcon from "../../assets/images/user-icon.png";
import useAuth from "../../custom-hooks/useAuth";
import { auth, db } from "../../firebase.config";
import "./header.css";

// Navigation links for the header
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
// Header component
const Header = () => {
	// Using useRef to get reference to the header and menu elements
	const headerRef = useRef(null);
	// Using useSelector to get the total quantity of items in the cart from the redux store
	const totalQuantity = useSelector((state) => state.cart.totalQuantity);

	const menuRef = useRef(null);
	const profileActionRef = useRef(null);
	// Using useNavigate for programmatic navigation
	const navigate = useNavigate();
	// Using custom hook to get the current user
	const { currentUser } = useAuth();

	const [isAdmin, setIsAdmin] = useState(false);

	// Function to make the header sticky on scroll
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

	// Function to handle logout
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

	// useEffect to fetch admin status of the user
	useEffect(() => {
		if (currentUser) {
			const fetchAdminStatus = async () => {
				try {
					// Add the correct path to your user's admin status in Firestore
					const docRef = doc(db, "users", currentUser.uid);
					const docSnap = await getDoc(docRef);

					if (docSnap.exists() && docSnap.data().isAdmin) {
						setIsAdmin(true);
					} else {
						setIsAdmin(false);
					}
				} catch (error) {
					console.error("Error fetching admin status:", error);
				}
			};

			fetchAdminStatus();
		}
	}, [currentUser]);

	// useEffect to add and remove the scroll event listener
	useEffect(() => {
		stickyHeaderFunction();
		return () => window.removeEventListener("scroll", stickyHeaderFunction);
	});
	// Function to toggle the menu
	const menuToggle = () => menuRef.current.classList.toggle("active__menu");

	// Functions to navigate to cart and settings
	const navToCart = () => {
		navigate("/cart");
	};
	const navToSetting = () => {
		navigate("/setting");
	};

	const toggleProfileActions = () => {
		profileActionRef.current.classList.toggle("show__profileActions");
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
							<span className="setting__icon" onClick={navToSetting}>
								<i class="ri-settings-2-line"></i>
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
											<span>
												{currentUser && isAdmin && (
													<Link to="/dashboard">Dashboard</Link>
												)}
											</span>
											{/* Only show dashboard link if user is an admin */}
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
