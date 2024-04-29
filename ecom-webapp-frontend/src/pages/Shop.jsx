import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Helmet from "../components/Helmet/helmet";
import CommonSection from "../components/UI/CommonSection";
import ProductsList from "../components/UI/ProductsList";
import "../styles/shop.css";

import useGetData from "../custom-hooks/useGetData";

const Shop = () => {
	const { data: products } = useGetData("products");
	const [activeFilter, setActiveFilter] = useState("all");
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortType, setSortType] = useState("default");
	const [sortRating, setSortRating] = useState("default");

	useEffect(() => {
		let processedProducts = products;
		processedProducts.forEach((product) => {
			// If avgRating is not present or not a number, set a default value (e.g., 0)
			product.avgRating =
				product.avgRating && !isNaN(product.avgRating) ? product.avgRating : 0;
		});

		// Filter
		if (activeFilter !== "all") {
			processedProducts = processedProducts.filter(
				(item) => item.category === activeFilter
			);
		}

		// Search
		if (searchTerm) {
			processedProducts = processedProducts.filter((item) =>
				item.productName.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Sort by price
		if (sortType === "ascending") {
			processedProducts.sort(
				(a, b) => parseFloat(a.price) - parseFloat(b.price)
			);
		} else if (sortType === "descending") {
			processedProducts.sort(
				(a, b) => parseFloat(b.price) - parseFloat(a.price)
			);
		}
		//sort by rating
		if (sortRating === "High - Low") {
			processedProducts.sort(
				(a, b) => parseFloat(a.avgRating) - parseFloat(b.avgRating)
			);
		} else if (sortRating === "Low - High") {
			processedProducts.sort(
				(a, b) => parseFloat(b.avgRating) - parseFloat(a.avgRating)
			);
		}

		setFilteredProducts(processedProducts);
	}, [products, activeFilter, searchTerm, sortType, sortRating]);

	const handleFilter = (e) => {
		setActiveFilter(e.target.value);
	};

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleSort = (e) => {
		setSortType(e.target.value);
	};
	const handleRating = (e) => {
		setSortRating(e.target.value);
	};

	return (
		<Helmet title="Shop">
			<CommonSection title="Products" />
			<section>
				<Container>
					<Row>
						<Col lg="2" md="6" className="text-end">
							<div className="filter__widget">
								<select onChange={handleFilter}>
									<option value="all">Filter By Category</option>
									<option value="sofa">Sofa</option>
									<option value="mobile">Mobile</option>
									<option value="chair">Chair</option>
									<option value="watch">Watch</option>
									<option value="wireless">Wireless</option>
								</select>
							</div>
						</Col>
						<Col lg="2" md="6" className="text-end">
							<div className="filter__widget">
								<select onChange={handleSort}>
									<option value="default">Sort By Price</option>
									<option value="ascending">Lowest</option>
									<option value="descending">Highest</option>
								</select>
							</div>
						</Col>
						<Col lg="2" md="6" className="text-end">
							<div className="filter__widget">
								<select onChange={handleRating}>
									<option value="default">Sort By Trending</option>
									<option value="High - Low">Lowest Trending</option>
									<option value="Low - High">Highest Trending</option>
								</select>
							</div>
						</Col>
						<Col lg="6" md="12">
							<div className="search__box">
								<input
									type="text"
									placeholder="Search "
									onChange={handleSearch}
								/>
								<span>
									<i class="ri-search-line"></i>
								</span>
							</div>
						</Col>
					</Row>
				</Container>
			</section>
			<section>
				<Container>
					<Row>
						{filteredProducts.length === 0 ? (
							<h1 className="text-center fs-4">The product is Unavailable!</h1>
						) : (
							<ProductsList data={filteredProducts} />
						)}
					</Row>
				</Container>
			</section>
		</Helmet>
	);
};

export default Shop;
