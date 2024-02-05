import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import products from '../assets/data/products'
import counterImg from '../assets/images/counter-timer-img.png'
import heroImg from '../assets/images/hero-img.png'
import Helmet from '../components/Helmet/helmet'
import Clock from '../components/UI/Clock'
import ProductsList from '../components/UI/ProductsList'
import Services from '../services/Services'
import '../styles/home.css'
const Home = () => {

    const   [trendingProducts,setTrendingProducts] = useState([])
    const   [bestSalesProducts,setBestSalesProducts] = useState([])
    const year = new Date().getFullYear()

    useEffect(()=>{
        const filteredTrendingProducts = products.filter(
            (item) => item.category==='chair');

        const filteredBestSalesProducts = products.filter(
                (item) => item.category==='sofa');


        setTrendingProducts(filteredTrendingProducts);
        setBestSalesProducts(filteredBestSalesProducts)


},[]);
    return (
    <Helmet title={'Home'}>
        <section className="hero__section">
            <Container>
                <Row>
                    <Col lg='6' md= '6'>
                        <div className="hero__content">
                            <p className="hero_subtitle">Trending product in {year}</p>
                            <h2>Make Your Interior More Minimalist & Mordern</h2>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci, magni! Veritatis reiciendis impedit corporis, quasi autem error voluptatem voluptatum id!</p>
                            <motion.button whileTap={{scale:1.2}}
                            className="buy__btn"><Link to='/shop'>SHOP NOW</Link></motion.button>
                        </div>
                    </Col>
                    <Col lg='6' md='6'>
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
                    <Col lg='12' className='text-center'>
                        <h2 className='section__title'>Trending Products</h2>
                    </Col>
                    <ProductsList data={trendingProducts} />
                </Row>
            </Container>
        </section>
        <section className="best__sales">
            <Container>
                <Row>
                    <Col lg='12' className='text-center'>
                        <h2 className='section__title'>Best Sales</h2>
                    </Col>
                    <ProductsList data={bestSalesProducts} />
                </Row>
            </Container>
        </section>
        <section className="timer__count">
            <Container>
                <Row>
                    <Col lg='6' md='6'>
                        <div className="clock__top-content">
                            <h4 className='text-white fs-6 mb-2'>Limited Offers</h4>
                            <h3 className='text-white fs-5 mb-3'>Quality Armchair</h3>
                        </div>
                        <Clock />
                        <motion.button whileTap={{scale: 1.2}} className="buy__btn store__btn"><Link to='/shop'>Visit Store</Link></motion.button>
                    </Col>
                    <Col lg='6' md='6' className='text-end'>
                        <img src={counterImg} alt="" />
                    </Col>
                </Row>
            </Container>
        </section>
    </Helmet>
  )
}

export default Home