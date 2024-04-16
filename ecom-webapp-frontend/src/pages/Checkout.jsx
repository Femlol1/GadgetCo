import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Col, Container, Form, FormGroup, Row } from "reactstrap";
import Helmet from "../components/Helmet/helmet";
import CommonSection from "../components/UI/CommonSection";
import "../styles/checkout.css";

const Checkout = () => {
	const totalQuantity = useSelector((state) => state.cart.totalQuantity);
	const totalAmount = useSelector((state) => state.cart.totalAmount);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		streetAddress: "",
		city: "",
		postalCode: "",
		country: "",
		totalQuantity: totalQuantity,
		subTotal: totalAmount,
		total: totalAmount,
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Form Data:", formData);
		// Process checkout here (e.g., send data to server, process payment)
	};

	return (
		<Helmet title="Checkout">
			<CommonSection title="Checkout" />
			<section>
				<Container>
					<Row>
						<Col lg="8">
							<h6 className="mb-4 fw-bold">Billing Information</h6>
							<Form className="billing__form" onSubmit={handleSubmit}>
								<FormGroup className="form__group">
									<input
										type="text"
										name="name"
										placeholder="Enter your name"
										onChange={handleChange}
										value={formData.name}
									/>
								</FormGroup>
								<FormGroup className="form__group">
									<input
										type="email"
										name="email"
										placeholder="Enter your email"
										onChange={handleChange}
										value={formData.email}
									/>
								</FormGroup>
								<FormGroup className="form__group">
									<input
										type="text"
										name="phone"
										placeholder="Phone number"
										onChange={handleChange}
										value={formData.phone}
									/>
								</FormGroup>
								<FormGroup className="form__group">
									<input
										type="text"
										name="streetAddress"
										placeholder="Street Address"
										onChange={handleChange}
										value={formData.streetAddress}
									/>
								</FormGroup>
								<FormGroup className="form__group">
									<input
										type="text"
										name="city"
										placeholder="City"
										onChange={handleChange}
										value={formData.city}
									/>
								</FormGroup>
								<FormGroup className="form__group">
									<input
										type="text"
										name="postalCode"
										placeholder="Postal Code"
										onChange={handleChange}
										value={formData.postalCode}
									/>
								</FormGroup>
								<FormGroup className="form__group">
									<input
										type="text"
										name="country"
										placeholder="Country"
										onChange={handleChange}
										value={formData.country}
									/>
								</FormGroup>
								<Button className="buy__btn w-100" type="submit">
									Place an order
								</Button>
							</Form>
						</Col>
						<Col lg="4">
							<div className="checkout__cart">
								<h6>
									Total Quantity: <span>{totalQuantity} items</span>
								</h6>
								<h6>
									Subtotal: <span>£{totalAmount}</span>
								</h6>
								<h6>
									Shipping: <span>£0</span>
								</h6>
								<h4>
									Total Cost: <span>£{totalAmount}</span>
								</h4>
							</div>
						</Col>
					</Row>
				</Container>
			</section>
		</Helmet>
	);
};

export default Checkout;
