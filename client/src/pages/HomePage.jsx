import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UrgentBanner from '../components/UrgentBanner';
import HeroSection from '../components/HeroSection';
import NoPlatformFee from '../components/NoPlatformFee';
import SearchBar from '../components/SearchBar';
import CauseCards from '../components/CauseCards';
import TopCampaigns from '../components/TopCampaigns';
import HowItWorks from '../components/HowItWorks';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';


const HomePage = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // const toggleLogin = () => {
  //   setIsLoggedIn(!isLoggedIn);
  // };

  return (
    <div className="min-h-screen bg-slate-100">
      
      
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <UrgentBanner />
        </div>
        
        <HeroSection />
        
        <SearchBar />
        
        <CauseCards />
        <NoPlatformFee />
        <TopCampaigns />
        <HowItWorks />
        <WhyChooseUs />
        <Testimonials />
      </main>
      
      {/* <Footer /> */}
    </div>
  );
};

export default HomePage;