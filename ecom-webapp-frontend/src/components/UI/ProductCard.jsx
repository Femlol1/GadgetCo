import { motion } from "framer-motion";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Col } from "reactstrap";
import { addItem } from "../../redux/slices/cartSlice"; // Adjusted import

import "../../styles/product-card.css";

// ProductCard component
const ProductCard = ({ item }) => {
	// Using useDispatch to dispatch actions
	const dispatch = useDispatch();

	// Function to add the item to the cart
	const addToCart = () => {
		// Dispatching the addItem action with the item data
		dispatch(
			addItem({
				id: item.id,
				productName: item.productName,
				price: item.price,
				imgUrl: item.imgUrl,
			})
		);

		toast.success("Item has been added to cart");
	};

	// StarRating component to display the rating of the product
	const StarRating = ({ rating }) => {
		const totalStars = 5;

		// Creates an array of stars to be displayed
		const starElements = [];
		for (let i = 1; i <= totalStars; i++) {
			starElements.push(
				<i
					key={i}
					className={i <= rating ? "ri-star-fill" : "ri-star-line"}
					style={{
						color: i <= rating ? "#ffc107" : "#e4e5e9",
						cursor: "default",
					}}
				></i>
			);
		}

		return <div className="star-rating">{starElements}</div>;
	};

	return (
		<Col lg="3" md="4" className="mb-2">
			<div className="product__item">
				<div className="product__img">
					<Link to={`/shop/${item.id}`}>
						<motion.img whileHover={{ scale: 0.9 }} src={item.imgUrl} alt="" />
					</Link>
				</div>
				<div className="p-2 product__info">
					<h3 className="product__name">
						<Link to={`/shop/${item.id}`}>{item.productName}</Link>
					</h3>
					<div className="product__rating">
						<StarRating rating={item.avgRating || 0} />
					</div>
					<span>{item.category}</span>
				</div>

				<div className="product__card-buttom d-flex align-items-center justify-content-between p-2">
					<span className="price">£{item.price}</span>
					<motion.span whileTap={{ scale: 1.2 }} onClick={addToCart}>
						<i class="ri-add-line"></i>
					</motion.span>
				</div>
			</div>
		</Col>
	);
};

export default ProductCard;
