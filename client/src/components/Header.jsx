import React, { useState } from 'react';
import { Search, Heart, Users, GraduationCap, Home, Car, TreePine, Star, ArrowRight, Check, Shield, Clock, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Menu } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/auth';

const Header = () => {
  const [mobileNav, setMobileNav] = useState("hidden");
  const { isLoggedIn, user, loading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const links = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "Donate",
      link: "/campaigns",
    },
    {
      title: "Pricing",
      link: "/pricing",
    },
    {
      title: "FAQs",
      link: "/faqs",
    },
  ];

  // Add authenticated user links only when logged in
  const authenticatedLinks = isLoggedIn ? [
    {
      title: "Dashboard",
      link: "/dashboard",
    },
    {
      title: "Profile",
      link: "/profile",
    },
  ] : [];

  const displayLinks = [...links, ...authenticatedLinks];

  return (
    <>
      <header className="bg-gradient-to-r from-slate-950 via-slate-500 to-slate-950 shadow-xl sticky top-0 z-50 border-b-2 border-slate-700/30 rounded-bl-3xl rounded-br-3xl backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 py-2">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <a href="/" className="flex items-center group">
                  {/* <div className="bg-gradient-to-r from-teal-400 to-emerald-400 p-2 rounded-xl shadow-lg group-hover:shadow-teal-400/30 transition-all duration-300 group-hover:scale-105"> */}
                    <h1 className="text-2xl  text-teal-100 drop-shadow-sm font-extralight">Chhaya</h1>
                  {/* </div> */}
                </a>
              </div>
              
              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex space-x-1">
                {links.map((item, i) => (
                  <a
                    href={item.link}
                    className="text-teal-200 hover:text-white px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl hover:bg-cyan-900/50 hover:shadow-lg hover:shadow-teal-500/20 relative group"
                    key={i}
                  >
                    <span className="relative z-10">{item.title}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 to-emerald-500/0 group-hover:from-teal-500/20 group-hover:to-emerald-500/20 rounded-xl transition-all duration-300"></div>
                  </a>
                ))}
              </nav>
            </div>
            
            {/* Right side - Auth Buttons and User Links */}
            <div className="flex items-center space-x-3">
              {/* Authenticated user links */}
              {isLoggedIn && authenticatedLinks.map((item, i) => (
                <a
                  href={item.link}
                  className="hidden md:block text-white hover:text-teal-200 border-2 border-teal-400/60 hover:border-teal-300 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-teal-700/30 hover:shadow-lg backdrop-blur-sm"
                  key={`auth-${i}`}
                >
                  {item.title}
                </a>
              ))}

              {!isLoggedIn ? (
                <div className="hidden md:flex items-center space-x-3">
                  <a 
                    href="/start-fundraiser"
                    className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 hover:scale-105 border border-emerald-400/30"
                  >
                    🚀 Start Fundraiser
                  </a>
                  <a 
                    href="/login"
                    className="text-teal-200 hover:text-white px-4 py-2.5 text-sm font-medium border-2 border-teal-400/60 hover:border-teal-300 rounded-xl hover:bg-teal-700/30 transition-all duration-300 backdrop-blur-sm hover:shadow-lg"
                  >
                    Login
                  </a>
                  <a 
                    href="/register"
                    className="text-slate-200 hover:text-white px-4 py-2.5 text-sm font-medium border-2 border-slate-400/60 hover:border-slate-300 rounded-xl hover:bg-slate-700/30 transition-all duration-300 backdrop-blur-sm hover:shadow-lg"
                  >
                    Signup
                  </a>
                </div>
              ) : (
               <div>
                 <button 
                  onClick={handleLogout}
                  className="hidden md:block text-teal-200 hover:text-white px-4 py-2.5 text-sm font-medium border-2 border-cyan-400/60 hover:border-cyan-500 rounded-2xl hover:bg-teal-600/30 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/20"
                >
                  Logout
                </button>
                <a 
                    href="/start-fundraiser"
                    className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 hover:scale-105 border border-emerald-400/30"
                  >
                    🚀 Start Fundraiser
                  </a>
                </div>
              )}

              {/* Mobile Hamburger Menu */}
              <button
                className="flex md:hidden text-teal-200 text-2xl hover:text-white ml-4 p-2 rounded-xl hover:bg-teal-700/50 transition-all duration-300"
                onClick={() =>
                  setMobileNav(mobileNav === "hidden" ? "block" : "hidden")
                }
              >
                <Menu />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div
        className={`${mobileNav} fixed inset-0 z-40 md:hidden`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setMobileNav("hidden")}
        ></div>
        
        {/* Menu Content */}
        <div className="relative bg-gradient-to-br from-white via-slate-50 to-teal-50 h-full w-80 ml-auto shadow-2xl border-l-2 border-teal-200/50 rounded-tl-3xl">
          {/* Header with Logo and Close */}
          <div className="flex items-center justify-between p-6 border-b-2 border-teal-200/50 bg-gradient-to-r from-teal-100 to-emerald-100 rounded-tl-3xl">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-2 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-white">Chhaya</h2>
              </div>
            </div>
            <button
              onClick={() => setMobileNav("hidden")}
              className="text-slate-500 hover:text-slate-700 p-2 rounded-full hover:bg-white/70 transition-all duration-300 hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Navigation Links */}
          <div className="py-6 space-y-2">
            {displayLinks.map((item, i) => (
              <a
                href={item.link}
                className={`block mx-4 px-4 py-3 text-slate-700 hover:text-teal-700 font-medium transition-all duration-300 rounded-xl hover:shadow-md ${
                  item.title === "Profile" || item.title === "Dashboard" 
                    ? "border-l-4 border-teal-500 bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 shadow-sm" 
                    : "hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50"
                }`}
                key={i}
                onClick={() => setMobileNav("hidden")}
              >
                <span className="flex items-center">
                  {item.title === "Profile" && "👤 "}
                  {item.title === "Dashboard" && "📊 "}
                  {item.title}
                </span>
              </a>
            ))}
          </div>
          
          {/* Mobile Auth Buttons */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-r from-slate-100 via-teal-50 to-emerald-50 border-t-2 border-teal-200/50 rounded-br-3xl">
            {!isLoggedIn ? (
              <div className="space-y-4">
                <a 
                  href="/start-fundraiser"
                  className="block text-center bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white px-6 py-3 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 hover:scale-105"
                  onClick={() => setMobileNav("hidden")}
                >
                  🚀 Start Fundraiser
                </a>
                <a 
                  href="/login"
                  className="block text-center text-teal-700 px-4 py-3 font-medium border-2 border-teal-500 rounded-xl hover:bg-teal-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => setMobileNav("hidden")}
                >
                  Login
                </a>
                <a 
                  href="/signup"
                  className="block text-center text-slate-600 px-4 py-3 font-medium border-2 border-slate-400 rounded-xl hover:bg-slate-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => setMobileNav("hidden")}
                >
                  Signup
                </a>
              </div>
            ) : (
              <button 
                onClick={() => {
                  handleLogout();
                  setMobileNav("hidden");
                }}
                className="w-full text-center text-red-600 px-4 py-3 font-medium border-2 border-red-400 rounded-xl hover:bg-red-50 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;