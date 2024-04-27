import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import React, { useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Container, Row } from "reactstrap";
import userIcon from "../assets/images/user-icon.png";
import useAuth from "../custom-hooks/useAuth";
import { auth } from "../firebase.config";
import "../styles/admin-nav.css";

const admin__nav = [
	{
		display: "Dashboard",
		path: "/dashboard",
	},
	{
		display: "All-Products",
		path: "/dashboard/all-products",
	},
	{
		display: "Add-Products",
		path: "/dashboard/add-products",
	},
	{
		display: "Orders",
		path: "/dashboard/orders",
	},
	{
		display: "Users",
		path: "/dashboard/users",
	},
];

const AdminNav = () => {
	const { currentUser } = useAuth();
	const navigate = useNavigate();
	const profileActionRef = useRef(null);
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

	const toggleProfileActions = () => {
		profileActionRef.current.classList.toggle("show__profileActions");
	};

	return (
		<>
			<header className="admin_header">
				<div className="admin__nav-top">
					<Container>
						<div className="admin__nav-wrapper-top">
							<div className="logo" onClick={() => navigate("/home")}>
								<h2>GadgetCo</h2>
							</div>
							<div className="search__box">
								<input type="text" placeholder="Search..." />
								<span>
									<i class="ri-search-line"></i>
								</span>
							</div>
							<div className="admin__nav-top-right">
								<span>
									<i class="ri-notification-3-line"></i>
								</span>
								<span>
									<i
										class="ri-settings-2-line"
										onClick={() => navigate("/setting")}
									></i>
								</span>
								<div className="profile">
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
									<div
										className="profile__actions"
										ref={profileActionRef}
										onClick={toggleProfileActions}
									>
										{currentUser ? (
											<div className=" d-flex align-items-center justify-content-center flex-column">
												<span onClick={logout}>Logout</span>
												<Link to="/home">Home</Link>
											</div>
										) : (
											<div className=" d-flex align-items-center justify-content-center flex-column">
												<Link to="/signup">SignUp</Link>
												<Link to="/login">Login</Link>
											</div>
										)}
									</div>
								</div>
								{/* <img src={currentUser && currentUser.photoURL} alt="" /> */}
							</div>
						</div>
					</Container>
				</div>
			</header>
			<section className="admin__menu p-0">
				<Container>
					<Row>
						<div className="admin__navigation">
							<ul className="admin__menu-list">
								{admin__nav.map((item, index) => (
									<li className="admin__menu-item" key={index}>
										<NavLink
											to={item.path}
											className={(navClass) =>
												navClass.isActive ? "active__admin-menu" : ""
											}
										>
											{item.display}
										</NavLink>
									</li>
								))}
							</ul>
						</div>
					</Row>
				</Container>
			</section>
		</>
	);
};

export default AdminNav;
