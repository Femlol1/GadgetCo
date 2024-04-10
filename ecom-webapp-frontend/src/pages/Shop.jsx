import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Helmet from "../components/Helmet/helmet";
import CommonSection from "../components/UI/CommonSection";
import ProductsList from "../components/UI/ProductsList";
import "../styles/shop.css";

import useGetData from "../custom-hooks/useGetData";

const Shop = () => {
	const { data: products, loading } = useGetData("products");
	const [productsData, setProductsData] = useState([]);
	const [trendingProducts, setTrendingProducts] = useState([]);
	const [bestSalesProducts, setBestSalesProducts] = useState([]);
	const [mobileProducts, setMobileProducts] = useState([]);
	const [wirelessProducts, setWirelessProducts] = useState([]);
	const [popularProducts, setPopularProducts] = useState([]);

	// Function to show all products
	const showAllProducts = () => {
		setProductsData(products);
	};

	const handleFilter = (e) => {
		const filterValue = e.target.value;
		if (filterValue === "sofa") {
			const filteredProducts = products.filter(
				(item) => item.category === "sofa"
			);

			setProductsData(filteredProducts);
		}
		if (filterValue === "mobile") {
			const filteredProducts = products.filter(
				(item) => item.category === "mobile"
			);

			setProductsData(filteredProducts);
		}
		if (filterValue === "chair") {
			const filteredProducts = products.filter(
				(item) => item.category === "chair"
			);

			setProductsData(filteredProducts);
		}
		if (filterValue === "watch") {
			const filteredProducts = products.filter(
				(item) => item.category === "watch"
			);

			setProductsData(filteredProducts);
		}
		if (filterValue === "wireless") {
			const filteredProducts = products.filter(
				(item) => item.category === "wireless"
			);

			setProductsData(filteredProducts);
		}
	};

	const handleSearch = (e) => {
		const searchItems = e.target.value;

		const searchedProducts = products.filter((item) =>
			item.productName.toLowerCase().includes(searchItems.toLowerCase())
		);

		setProductsData(searchedProducts);
	};

	return (
		<Helmet title="Shop">
			<CommonSection title="Products" />
			<section>
				<Container>
					<Row>
						<Col lg="3" md="6">
							<div className="filter__widget">
								<select onChange={handleFilter}>
									<option>Filter By Category</option>
									<option value="sofa">Sofa</option>
									<option value="mobile">Mobile</option>
									<option value="chair">Chair</option>
									<option value="watch">Watch</option>
									<option value="wireless">Wireless</option>
								</select>
								<button
									onClick={showAllProducts}
									className="btn btn-primary mt-3"
								>
									Show All Products
								</button>
							</div>
						</Col>
						<Col lg="3" md="6" className="text-end">
							<div className="filter__widget">
								<select name="" id="">
									<option>Sort By</option>
									<option value="ascending">Ascending</option>
									<option value="descending">Descending</option>
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
						{productsData.length === 0 ? (
							<h1 className="text-center fs-4">The product is Unavailable!</h1>
						) : (
							<ProductsList data={productsData} />
						)}
					</Row>
				</Container>
			</section>
		</Helmet>
	);
};

export default Shop;
