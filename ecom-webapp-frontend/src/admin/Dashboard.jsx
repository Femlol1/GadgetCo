import React from "react";
import { Col, Container, Row } from "reactstrap";
import useGetData from "../custom-hooks/useGetData";
import "../styles/dashboard.css";

const Dashboard = () => {
	const { data: products } = useGetData("products");
	const { data: users } = useGetData("users");

	return (
		<>
			<section>
				<Container>
					<Row>
						<Col className="lg-3">
							<div className="revenue__box">
								<h5>Total Sales</h5>
								<span>£89000</span>
							</div>
						</Col>
						<Col className="lg-3">
							<div className="order__box">
								<h5>Orders</h5>
								<span>890</span>
							</div>
						</Col>
						<Col className="lg-3">
							<div className="product__box">
								<h5>Total Products</h5>
								<span>{products.length}</span>
							</div>
						</Col>
						<Col className="lg-3">
							<div className="users__box">
								<h5>Total Users</h5>
								<span>{users.length}</span>
							</div>
						</Col>
					</Row>
				</Container>
			</section>
		</>
	);
};

export default Dashboard;
