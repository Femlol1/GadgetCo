import { motion } from 'framer-motion'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { Container, Row } from 'reactstrap'
import logo from '../../assets/images/eco-logo.png'
import userIcon from '../../assets/images/user-icon.png'
import './header.css'


const nav__links = [
    {
        path: 'home',
        display: 'Home'
    },
    {
        path: 'shop',
        display: 'Shop'
    },
    {
        path: 'cart',
        display: 'Cart'
    },
]


const Header = () => {
    const headerRef = useRef(null)
    const totalQuantity = useSelector(state => state.cart.totalQuantity)
    const menuRef =useRef(null)
    const navigate = useNavigate()
    const stickyHeaderFunction = () => {
        window.addEventListener('scroll', () => {
            if(document.body.scrollTop >80 || document.documentElement.scrollTop > 80){
                headerRef.current.classList.add('sticky__header')
            } else {
                headerRef.current.classList.remove('sticky__header')
            }
        })
    }
    useEffect(() => {
        stickyHeaderFunction()
        return () => window.removeEventListener('scroll', stickyHeaderFunction)
    });
    const menuToggle = () => menuRef.current.classList.toggle('active__menu');

    const navToCart  =()=>{
        navigate('/cart')
    }
    return <header className='header' ref={headerRef}>
        <Container>
            <Row>
                <div className="nav__wrapper">
                    <div className="logo">
                        <img src={logo} alt='logo' />
                        <div>
                            <h1>GadgetCo</h1>
                        </div>
                    </div>
                    <div className='navigation' ref={menuRef} onClick={menuToggle}>
                        <ul className="menu">
                            {nav__links.map((item, index)=> (
                                <li className="nav__item" key={index}>
                                    <NavLink to = {item.path} className={(navClass)=> navClass.isActive ? 'nav_Active':''}>{item.display}</NavLink>
                                    </li>
                            ))}
                        </ul>
                    </div>
                    <div className="nav__icons">
                        <span className='fav__icon'>
                            <i class="ri-heart-line"></i>
                            <span className="badge">1</span>
                            </span>
                        <span className='cart__icon' onClick={navToCart}>
                            <i class="ri-shopping-bag-line"></i>
                            <span className="badge">{totalQuantity}</span>
                            </span>
                        <span>
                            <div className="center__div">
                                <motion.img whileTap={{ scale: 1.2}} src={userIcon} alt=''/>
                            </div>
                            </span>
                            <div className="mobile__menu">
                        <span onClick={menuToggle}>
                            <i class="ri-menu-line"></i>
                        </span>
                    </div>
                    </div>
                    
                </div>
            </Row>
        </Container>
    </header>
}

export default Header