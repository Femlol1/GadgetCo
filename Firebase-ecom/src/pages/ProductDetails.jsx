import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Container, Row } from "reactstrap";
import Helmet from "../components/Helmet/helmet";
import CommonSection from "../components/UI/CommonSection";
import ProductsList from "../components/UI/ProductsList";
import useGetData from "../custom-hooks/useGetData";
import { db } from "../firebase.config";
import { cartActions } from "../redux/slices/cartSlice";
import "../styles/product-details.css";

const ProductDetails = () => {
	const [product, setProduct] = useState({});
	const [tab, setTab] = useState("desc");
	const [rating, setRating] = useState(null);
	const reviewUser = useRef("");
	const reviewMsg = useRef("");
	const dispatch = useDispatch();
	const { id } = useParams();
	const { data: products } = useGetData("products");

	const docRef = doc(db, "products", id);

	useEffect(() => {
		const getProduct = async () => {
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setProduct(docSnap.data());
			} else {
				console.log("no products available");
			}
		};
		getProduct();
	}, []);

	const {
		imgUrl,
		productName,
		price,
		// avgRating,
		// reviews,
		description,
		shortDesc,
		category,
	} = product;

	const categoryLower = category?.toLowerCase() || "";

	const relatedProducts = products.filter((item) => item.category === category);
	const submitHandler = (e) => {
		e.preventDefault();

		const reviewUserName = reviewUser.current.value;
		const reviewUsermsg = reviewMsg.current.value;

		const reviewObj = {
			userName: reviewUserName,
			text: reviewUsermsg,
			rating,
		};
		console.log(reviewObj);
		toast.success("Review submitted");
	};
	const addToCart = () => {
		dispatch(
			cartActions.addItem({
				id,
				image: imgUrl,
				productName,
				price,
			})
		);
		toast.success("Item has been added to cart");
	};
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [product]);

	return (
		<Helmet title={productName}>
			<CommonSection title={productName} />
			<section className="pt-0">
				<Container>
					<Row>
						<Col lg="6">
							<img src={imgUrl} alt="" />
						</Col>
						<Col lg="6">
							<div className="product__details">
								<h2>{productName}</h2>
								<div className="product__rating d-flex align-items-center gap-5 mb-3">
									<div>
										<span>
											<i class="ri-star-s-fill"></i>
										</span>
										<span>
											<i class="ri-star-s-fill"></i>
										</span>
										<span>
											<i class="ri-star-s-fill"></i>
										</span>
										<span>
											<i class="ri-star-s-fill"></i>
										</span>
										<span>
											<i class="ri-star-half-s-fill"></i>
										</span>
									</div>
									<p>{/* (<span>{avgRating}</span> ratings) */}</p>
								</div>
								<div className="d-flex align-items-center gap-5">
									<span className="product__price">£{price}</span>
									{/* Ensure category is displayed only when it's available */}
									{category && <span>Category: {categoryLower}</span>}
								</div>
								<p className="mt-3">{shortDesc}</p>
								<motion.button
									whileTap={{ scale: 1.2 }}
									className="buy__btn"
									onClick={addToCart}
								>
									Add to Cart
								</motion.button>
							</div>
						</Col>
					</Row>
				</Container>
			</section>

			<section>
				<Container>
					<Row>
						<Col lg="12">
							<div className="tab__wrapper d-flex align-items-center gap-5">
								<h6
									className={`${tab === "desc" ? "active__tab" : ""}`}
									onClick={() => setTab("desc")}
								>
									Description
								</h6>
								<h6
									className={`${tab === "rev" ? "active__tab" : ""}`}
									onClick={() => setTab("rev")}
								>
									Reviews
								</h6>
							</div>

							{tab === "desc" ? (
								<div className="tab__content mt-5">
									<p>{description}</p>
								</div>
							) : (
								<div className="Product__review">
									<div className="review__wrapper d-flex align-items-center gap-5">
										{" "}
										{/* may need to remove text style*/}
										{/* <ul>
											{reviews?.map((item, index) => (
												<li kew={index} className="mb-4">
													<h6>Femi Isi</h6>
													<span>{item.rating} ( rating)</span>
													<p>{item.text}</p>
												</li>
											))}
										</ul> */}
										<div className="review__form">
											<h4>Leave your experience</h4>
											<form action="" onSubmit={submitHandler}>
												<div className="form__group">
													<input
														type="text"
														placeholder="Enter name"
														ref={reviewUser}
														required
													/>
												</div>
												<div className="form__group d-flex align-item-center gap-5 rating__group">
													<motion.span
														whileTap={{ scale: 1.2 }}
														onClick={() => setRating(1)}
													>
														1<i class="ri-star-s-fill"></i>
													</motion.span>
													<motion.span
														whileTap={{ scale: 1.2 }}
														onClick={() => setRating(2)}
													>
														2<i class="ri-star-s-fill"></i>
													</motion.span>
													<motion.span
														whileTap={{ scale: 1.2 }}
														onClick={() => setRating(3)}
													>
														3<i class="ri-star-s-fill"></i>
													</motion.span>
													<motion.span
														whileTap={{ scale: 1.2 }}
														onClick={() => setRating(4)}
													>
														4<i class="ri-star-s-fill"></i>
													</motion.span>
													<motion.span
														whileTap={{ scale: 1.2 }}
														onClick={() => setRating(5)}
													>
														5<i class="ri-star-s-fill"></i>
													</motion.span>
												</div>
												<div className="form__group">
													<textarea
														ref={reviewMsg}
														rows={4}
														type="text"
														placeholder="Review Message"
														required
													/>
												</div>
												<motion.button
													whileTap={{ scale: 1.2 }}
													type="submit"
													className="buy__btn"
												>
													Submit
												</motion.button>
											</form>
										</div>
									</div>
								</div>
							)}
						</Col>
						<Col lg="12" className="mt-5">
							<h2 className="related__title">Related Products</h2>
						</Col>
						<ProductsList data={relatedProducts} />
					</Row>
				</Container>
			</section>
		</Helmet>
	);
};

export default ProductDetails;
