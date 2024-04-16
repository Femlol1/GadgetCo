import {
	addDoc,
	collection,
	doc,
	getDoc, // Added to fix 'limit is not defined'
	getDocs, // Added to fix 'startAfter is not defined'
	limit,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	startAfter,
	updateDoc,
} from "firebase/firestore";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Container, Row } from "reactstrap";
import Helmet from "../components/Helmet/helmet";
import CommonSection from "../components/UI/CommonSection";
import ProductsList from "../components/UI/ProductsList";
import useAuth from "../custom-hooks/useAuth";
import useGetData from "../custom-hooks/useGetData";
import { db } from "../firebase.config";
import { addItem } from "../redux/slices/cartSlice";

import "../styles/product-details.css";

const ProductDetails = () => {
	const { currentUser, loading, error } = useAuth();
	const [product, setProduct] = useState({});
	const [tab, setTab] = useState("desc");
	const [reviews, setReviews] = useState([]);
	const [rating, setRating] = useState(null);
	const reviewMsg = useRef("");
	const dispatch = useDispatch();
	const { id } = useParams();
	const { data: products } = useGetData("products");
	const [lastVisible, setLastVisible] = useState(null);
	const [allReviewsLoaded, setAllReviewsLoaded] = useState(false);

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
	}, [docRef]);

	const addReview = async (productId, review) => {
		if (!productId) {
			console.error("Product ID is undefined.");
			return;
		}
		try {
			const reviewRef = collection(db, "products", productId, "reviews");
			const docRef = doc(db, "products", productId);
			await addDoc(reviewRef, {
				...review,
				createdAt: serverTimestamp(),
			});

			// Update the product document with new rating and recalculate average
			const productDoc = await getDoc(docRef);
			if (productDoc.exists()) {
				const productData = productDoc.data();
				const newRatings = [...(productData.ratings || []), review.rating];
				const averageRating =
					newRatings.reduce((a, b) => a + b, 0) / newRatings.length;
				await updateDoc(docRef, {
					ratings: newRatings,
					avgRating: averageRating,
				});
			}

			//toast.success("Review and rating added successfully!");
		} catch (error) {
			console.error("Failed to add review:", error);
			toast.error("Failed to add review.");
		}
	};

	const loadMoreReviews = async () => {
		if (!lastVisible) return;

		const next = query(
			collection(db, "products", id, "reviews"),
			orderBy("createdAt", "desc"),
			startAfter(lastVisible),
			limit(5) // Ensures we are importing and using limit correctly
		);

		getDocs(next).then((documentSnapshots) => {
			const isEnd = documentSnapshots.size < 5;
			setAllReviewsLoaded(isEnd);

			const newReviews = documentSnapshots.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setReviews((prevReviews) => [...prevReviews, ...newReviews]);
			setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
		});
	};

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

	const handleReviewSubmit = async (e) => {
		e.preventDefault();
		if (!id) {
			toast.error("Product ID is missing.");
			return;
		}
		if (!currentUser) {
			toast.error("You must be logged in to submit a review.");
			return;
		}
		const review = {
			userName: currentUser.displayName || currentUser.email,
			text: reviewMsg.current.value,
			rating,
		};
		await addReview(id, review);
		if (reviewMsg.current) {
			reviewMsg.current.value = "";
		}
		setRating(0);
		toast.success("Review added successfully!");
	};
	const addToCart = () => {
		dispatch(
			addItem({
				id,
				image: imgUrl,
				productName,
				price,
			})
		);
		toast.success("Item has been added to cart");
	};
	useEffect(() => {
		const reviewsRef = collection(db, "products", id, "reviews");
		const q = query(reviewsRef, orderBy("createdAt", "desc"), limit(5)); // Using limit here

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
			setLastVisible(lastVisibleDoc);
			setAllReviewsLoaded(querySnapshot.empty);

			const reviewsData = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setReviews(reviewsData);
		});

		return () => unsubscribe();
	}, [id]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [id]); // Only re-run this effect if the `id` changes

	if (loading) {
		return (
			<Container>
				<p>Loading...</p>
			</Container>
		);
	}

	if (error) {
		return (
			<Container>
				<p>Error: {error.message}</p>
			</Container>
		);
	}

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
									<div className="review__wrapper">
										<div className="review__form">
											<h4>Leave your experience</h4>
											<p>
												Average Rating:{" "}
												{product.avgRating?.toFixed(2) || "Not rated yet"}
											</p>
											<form action="" onSubmit={handleReviewSubmit}>
												<div className="form__group d-flex align-item-center gap-5 rating__group">
													<label>Rating:</label>
													{[1, 2, 3, 4, 5].map((star) => (
														<motion.span
															key={star}
															whileTap={{ scale: 1.2 }}
															onClick={() => setRating(star)}
															style={{
																color: star <= rating ? "gold" : "grey",
																cursor: "pointer",
															}}
														>
															<i className="ri-star-fill"></i>
														</motion.span>
													))}
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
										</div>{" "}
										<div className="d ">
											{reviews.map((review) => (
												<li key={review.id} className="review-item">
													<h4>user: {review.userName}</h4>

													<div className="review__rating">
														rating:{" "}
														{Array.from({ length: 5 }, (_, index) => (
															<i
																key={index}
																className={`ri-star-${
																	index < review.rating ? "fill" : "line"
																}`}
															></i>
														))}
													</div>
													<p>review: {review.text}</p>
												</li>
											))}
											{!allReviewsLoaded && (
												<motion.button
													className="buy__btn"
													onClick={loadMoreReviews}
													whileTap={{ scale: 1.2 }}
												>
													Load More Reviews
												</motion.button>
											)}
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
