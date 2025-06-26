import React from 'react';
import underTreeImg from '../assets/multiple people under tree.png';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-cyan-900 via-emerald-800 to-cyan-800 text-white py-10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-emerald-600/20"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-20 h-20 bg-teal-400/10 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl"></div>
        <div className="absolute  left-1/4 w-24 h-24 bg-cyan-400/10 rounded-full blur-xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-teal-700/30 backdrop-blur-sm border border-teal-400/30 rounded-full px-4 py-2 mb-6">
              <span className="text-teal-200 text-sm font-medium">✨ Trusted by 10,000+ donors</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold  leading-tight">
              <span className="bg-gradient-to-r from-teal-200 via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
               Hope Rests
              </span>
              <br />
              <span className="text-white">Here</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto lg:mx-0 text-teal-100 leading-relaxed">
              Join thousands of compassionate people who are changing lives through 
              <span className="text-emerald-300 font-semibold"> Chhaya</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* <a 
                href="/start-fundraiser"
                className="group bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-2xl hover:shadow-emerald-500/30 hover:scale-105 border border-emerald-400/30"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🚀 Start Your Fundraiser</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a> */}
              
              <a href="/campaigns" className="group border-2 border-teal-300/60 text-teal-100 hover:bg-gradient-to-r hover:from-teal-700/50 hover:to-emerald-700/50 hover:text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-teal-500/20 hover:border-teal-300">
                <span className="flex items-center justify-center space-x-2">
                  <span>Explore Campaigns</span>
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </a>
            </div>
            
           
            {/* <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-teal-600/30">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-emerald-300">₹2.5M+</div>
                <div className="text-teal-200 text-sm">Funds Raised</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-cyan-300">1,200+</div>
                <div className="text-teal-200 text-sm">Success Stories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-teal-300">50k+</div>
                <div className="text-teal-200 text-sm">Happy Donors</div>
              </div>
            </div> */}
          </div>
          
          {/* Right Image */}
          <div className="relative lg:block">
            <div className="relative mx-auto max-w-md lg:max-w-full">
              {/* Placeholder for your PNG image */}
              <div className="relative bg-gradient-to-br from-teal-400/20 to-emerald-400/20 backdrop-blur-sm rounded-3xl p-8 border border-teal-300/30 shadow-2xl">
                <div className="aspect-square bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                  {/* Replace this div with your actual image */}
                  <img 
                    src={underTreeImg}
                    alt="Fundraising illustration" 
                    className="w-full h-full object-contain rounded-2xl"
                    onError={(e) => {
                      // Fallback content if image doesn't load
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback content */}
                  <div className="flex flex-col items-center justify-center text-center p-8" style={{display: 'none'}}>
                    <div className="text-6xl mb-4">🤝</div>
                    <div className="text-xl font-semibold text-teal-100 mb-2">Community Support</div>
                    <div className="text-sm text-teal-200">Together we make dreams come true</div>
                  </div>
                </div>
                
                {/* Floating cards around the image
                <div className="absolute -top-4 -left-4 bg-emerald-500 text-white p-3 rounded-xl shadow-lg rotate-12 hover:rotate-0 transition-transform duration-300">
                  <div className="text-xs font-semibold">💝 Goal Achieved!</div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-cyan-500 text-white p-3 rounded-xl shadow-lg -rotate-12 hover:rotate-0 transition-transform duration-300">
                  <div className="text-xs font-semibold">🎯 100% Funded</div>
                </div>
                
                <div className="absolute top-1/2 -right-6 bg-teal-500 text-white p-3 rounded-xl shadow-lg rotate-6 hover:rotate-0 transition-transform duration-300">
                  <div className="text-xs font-semibold">❤️ 500+ Donors</div>
                </div> */}
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 top-4 left-4 w-full h-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl"></div>
              <div className="absolute -z-20 top-8 left-8 w-full h-full bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-3xl blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;