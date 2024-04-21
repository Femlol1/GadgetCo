import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import counterImg from "../assets/images/counter-timer-img.png";
import heroImg from "../assets/images/hero-img.png";
import Helmet from "../components/Helmet/helmet";
import Clock from "../components/UI/Clock";
import ProductsList from "../components/UI/ProductsList";
import Services from "../services/Services";
import "../styles/home.css";

import useGetData from "../custom-hooks/useGetData";

const Home = () => {
	const { data: products, loading } = useGetData("products");
	const [trendingProducts, setTrendingProducts] = useState([]);
	const [bestSalesProducts, setBestSalesProducts] = useState([]);
	const [mobileProducts, setMobileProducts] = useState([]);
	const [wirelessProducts, setWirelessProducts] = useState([]);
	const [popularProducts, setPopularProducts] = useState([]);

	const year = new Date().getFullYear();

	useEffect(() => {
		const filteredTrendingProducts = products.filter(
			(item) => item.category === "chair"
		);

		const filteredBestSalesProducts = products.filter(
			(item) => item.category === "sofa"
		);

		const filteredMobileProducts = products.filter(
			(item) => item.category === "mobile"
		);

		const filteredWirelessProducts = products.filter(
			(item) => item.category === "wireless"
		);
		const filteredPopularProducts = products.filter(
			(item) => item.category === "watch"
		);

		setTrendingProducts(filteredTrendingProducts);
		setBestSalesProducts(filteredBestSalesProducts);
		setMobileProducts(filteredMobileProducts);
		setWirelessProducts(filteredWirelessProducts);
		setPopularProducts(filteredPopularProducts);
	}, [products]);
	return (
		<Helmet title={"Home"}>
			<section className="hero__section">
				<Container>
					<Row>
						<Col lg="6" md="6">
							<div className="hero__content">
								<p className="hero_subtitle">Trending product in {year}</p>
								<h2>Streamline Your Space with Sleek & Modern Designs</h2>
								<p>
									Elevate your home or office with our latest selection of
									sleek, minimalist furnishings. Designed for the modern
									lifestyle, our pieces combine functionality with effortless
									style, ensuring your space isn't just contemporary but also
									comfortable and inviting. Discover the future of interior
									design today and transform your environment into a haven of
									modern luxury.
								</p>
								<motion.button whileTap={{ scale: 1.2 }} className="buy__btn">
									<Link to="/shop">SHOP NOW</Link>
								</motion.button>
							</div>
						</Col>
						<Col lg="6" md="6">
							<div className="hero__img">
								<img src={heroImg} alt="" />
							</div>
						</Col>
					</Row>
				</Container>
			</section>
			<Services />
			<section className="trending__products">
				<Container>
					<Row>
						<Col lg="12" className="text-center mb-5">
							<h2 className="section__title">Trending Products</h2>
						</Col>
						{loading ? (
							<h5 className="fw-bold">Loading../||\..</h5>
						) : (
							<ProductsList data={trendingProducts} />
						)}
					</Row>
				</Container>
			</section>
			<section className="best__sales">
				<Container>
					<Row>
						<Col lg="12" className="text-center mb-5">
							<h2 className="section__title">Best Sales</h2>
						</Col>
						{loading ? (
							<h5 className="fw-bold">Loading../||\..</h5>
						) : (
							<ProductsList data={bestSalesProducts} />
						)}
					</Row>
				</Container>
			</section>
			<section className="timer__count">
				<Container>
					<Row>
						<Col lg="6" md="12" className="count__down-col">
							<div className="clock__top-content">
								<h4 className="text-white fs-6 mb-2">Limited Offers</h4>
								<h3 className="text-white fs-5 mb-3">Quality Armchair</h3>
							</div>
							<Clock />
							<motion.button
								whileTap={{ scale: 1.2 }}
								className="buy__btn store__btn"
							>
								<Link to="/shop">Visit Store</Link>
							</motion.button>
						</Col>
						<Col lg="6" md="12" className="text-end counter__img">
							<img src={counterImg} alt="" />
						</Col>
					</Row>
				</Container>
			</section>
			<section className="new__arrivals">
				<Container>
					<Row>
						<Col lg="12" className="text-center mb-5">
							<h2 className="section__title">New Arrivals</h2>
						</Col>
						{loading ? (
							<h5 className="fw-bold">Loading../||\..</h5>
						) : (
							<ProductsList data={mobileProducts} />
						)}
						{loading ? (
							<h5 className="fw-bold">Loading../||\..</h5>
						) : (
							<ProductsList data={wirelessProducts} />
						)}
					</Row>
				</Container>
			</section>
			<section className="popular__category">
				<Container>
					<Row>
						<Col lg="12" className="text-center mb-5">
							<h2 className="section__title">Popular in Category</h2>
						</Col>
						{loading ? (
							<h5 className="fw-bold">Loading../||\..</h5>
						) : (
							<ProductsList data={popularProducts} />
						)}
					</Row>
				</Container>
			</section>
		</Helmet>
	);
};

export default Home;
