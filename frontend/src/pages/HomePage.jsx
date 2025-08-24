import React from 'react';
import Header from '../components/common/Header';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Stats from '../components/home/Stats';
import Testimonials from '../components/home/Testimonials';
import Pricing from '../components/home/Pricing';
import Footer from '../components/common/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  );
};

export default HomePage;
