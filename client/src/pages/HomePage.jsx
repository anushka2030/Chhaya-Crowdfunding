import React, { useState } from 'react';
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
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* <Header /> */}

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <UrgentBanner />
        </div>

        <HeroSection />

        {/* Pass setSearchResults to SearchBar */}
        <SearchBar onResults={setSearchResults} />

        {/* Render Search Results if present */}
        {searchResults.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Search Results:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {searchResults.map((campaign) => (
                <div key={campaign._id} className="bg-white p-4 rounded-lg shadow">
                  <h4 className="text-lg font-bold text-cyan-900 mb-1">{campaign.title}</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {campaign.location?.city}, {campaign.location?.state}
                  </p>
                  <p className="text-sm text-gray-500">
                    Goal: ₹{campaign.goalAmount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional: Show all other sections only when not searching */}
        {searchResults.length === 0 && (
          <>
            <CauseCards />
            <NoPlatformFee />
            <TopCampaigns />
            <HowItWorks />
            {/* <WhyChooseUs /> */}
            <Testimonials />
          </>
        )}
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default HomePage;
