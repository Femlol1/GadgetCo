import React from "react";
import { Container, Row } from "reactstrap";

import { NavLink } from "react-router-dom";
import useAuth from "../custom-hooks/useAuth";
import "../styles/admin-nav.css";

const admin__nav = [
	{
		display: "Dashboard",
		path: "/dashboard",
	},
	{
		display: "All-Products",
		path: "/dashboar/all-products",
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
	return (
		<>
			<header className="admin_header">
				<div className="admin__nav-top">
					<Container>
						<div className="admin__nav-wrapper-top">
							<div className="logo">
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
									<i class="ri-settings-2-line"></i>
								</span>
								<img src={currentUser.photoURL} alt="" />
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
										<NavLink to={item.path}>{item.display}</NavLink>
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
