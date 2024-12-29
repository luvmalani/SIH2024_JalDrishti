import React from 'react'
import Header from '../components/common/Header'
import Carousel from './Carousel'
import AboutUs from './Aboutus';
import Footer from './Footer';
import Slider from './Slider';
// Confirm the file exists

// Home.jsx
const Home = () => {
    return <div>
        <Header/>
        <Carousel/>
        <AboutUs/>
        <Slider/>
        <Footer/>
    
    </div>;
  };
  
  export default Home;
  