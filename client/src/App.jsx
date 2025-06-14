import React, { useState, useEffect } from 'react';
import {Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RequestOTP from './pages/RequestOTP';
import Register from './pages/Register';
import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from './store/auth';
import CauseCards from './components/CauseCards';
import CauseCampaigns from './pages/CauseCampaigns';
import TopCampaigns from './components/TopCampaigns';
import AllCampaigns from './pages/AllCampaigns';
import Pricing from './pages/Pricing';
import FAQs from './pages/FAQs';


function App() {

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
   const { user, isLoggedIn } = useSelector(state => state.auth);
  useEffect(() => {
    // Initialize auth on app start
    dispatch(authActions.initializeAuth());
    setLoading(false);
  }, [dispatch]);


  // const checkAuthStatus = async () => {
  //   try {
  //     // Check if user has valid token in localStorage
  //     const token = localStorage.getItem('authToken');
  //     if (!token) {
  //       setLoading(false);
  //       return;
  //     }

  //     // Validate token with backend
  //     const response = await fetch('/api/auth/validate', {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });

  //     if (response.ok) {
  //       const userData = await response.json();
  //       setUser(userData);
  //       setIsLoggedIn(true);
  //     } else {
  //       // Token is invalid, remove it
  //       localStorage.removeItem('authToken');
  //       localStorage.removeItem('user');
  //     }
  //   } catch (error) {
  //     console.error('Auth check failed:', error);
  //     // Clear potentially corrupted data
  //     localStorage.removeItem('authToken');
  //     localStorage.removeItem('user');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Handle successful login
  const handleLogin = (userData, token) => {
    // Store token and user data
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    dispatch(authActions.loginSuccess({ user: userData, token }));
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call logout endpoint to invalidate token on server
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      dispatch(authActions.logout());
    }
  };

  // Show loading spinner while checking auth
  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="App">
      <Header 
        isLoggedIn={isLoggedIn} 
        user={user}
        onLogout={handleLogout} 
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/request-otp" element={<RequestOTP />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/login" 
          element={<Login onLogin={handleLogin} />} 
        />
         <Route path="/" element={<CauseCards />} />
        <Route path="/cause/:id" element={<CauseCampaigns />} />
         <Route path="/" element={<><TopCampaigns /></>} />
        <Route path="/campaigns" element={<AllCampaigns />} />
                <Route path="/pricing" element={<Pricing />} />
                                <Route path="/faqs" element={<FAQs />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;