import React from 'react'
import { useParams } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import products from '../assets/data/products'
import Helmet from '../components/Helmet/helmet'
import CommonSection from '../components/UI/CommonSection'



const ProductDetails = () => {

  const {id} = useParams()
  const product =products.find(item=> item.id === id)
  const {imgUrl, productName, price, avgRating, review, description } = product
  return <Helmet>
    <CommonSection/>
    <section className='pt-0'>
      <Container>
        <Row>
          <Col lg='6'><img src={imgUrl} alt="" />
          </Col>
          <Col lg='6'></Col>
        </Row>
      </Container>
    </section>
  </Helmet>
}

export default ProductDetails