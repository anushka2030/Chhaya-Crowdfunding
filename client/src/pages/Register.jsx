import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginSuccess } from '../store/auth';
import { useDispatch } from 'react-redux';


const Register = () => {

   const dispatch = useDispatch();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

   const navigate = useNavigate();
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  // Validate input
  const validateInput = () => {
    if (values.name.trim().length < 2) {
      alert("Name must be at least 2 characters long!");
      return false;
    }
    if (!values.email.includes("@") || !values.email.includes(".")) {
      alert("Please enter a valid email address!");
      return false;
    }
    if (values.password.trim().length < 6) {
      alert("Password must be at least 6 characters long!");
      return false;
    }
    return true;
  };

  // Handle OTP request
  const handleOtpRequest = async () => {
    if (!values.email.includes("@") || !values.email.includes(".")) {
      alert("Please enter a valid email address!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to send OTP');
      }

      alert('OTP sent to your email!');
      setOtpSent(true);
      
    } catch (error) {
      console.error('OTP request error:', error);
      alert(error.message || 'Failed to send OTP!');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification

const handleOtpVerify = async () => {
 
  if (!otp || otp.length !== 6) {
    alert("Please enter a valid 6-digit OTP!");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: values.email, otp })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Invalid OTP');
    }

    // ✅ Store to localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // ✅ Update Redux
    dispatch(loginSuccess({ token: data.token, user: data.user }));

    alert('OTP Verified! Logged in.');
    navigate('/dashboard'); // 🚀 Instant access

  } catch (error) {
    console.error('OTP verification error:', error);
    alert(error.message || 'OTP verification failed!');
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Registration failed');
      }

      // Store auth data in localStorage (if needed)
      localStorage.setItem('id', data.user.id);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);


      alert('Registration successful!');
      console.log('User registered:', data.user);
      navigate('/login');
      // In real app with routing: navigate("/profile");
      
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message || 'Something went wrong during registration!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen px-4 sm:px-12 py-8 flex items-center justify-center"
      style={{ backgroundColor: '#06202B' }}
    >
      <div 
        className="w-full max-w-md rounded-lg px-8 py-6 shadow-2xl"
        style={{ backgroundColor: '#077A7D' }}
      >
        <h1 
          className="text-2xl font-bold mb-2"
          style={{ color: '#F5EEDD' }}
        >
          Register
        </h1>
        <p 
          className="text-sm mb-6 opacity-90"
          style={{ color: '#F5EEDD' }}
        >
          Create your account with email and password
        </p>
        
        <div className="space-y-4">
          {!otpMode ? (
            // Regular Registration Form
            <>
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#7AE2CF' }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-2 outline-none focus:ring-2 transition-all duration-200"
                  style={{ 
                    backgroundColor: '#F5EEDD',
                    color: '#06202B',
                    borderColor: '#7AE2CF'
                  }}
                  placeholder="Enter your full name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#7AE2CF' }}
                >
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-3 rounded-lg border-2 outline-none focus:ring-2 transition-all duration-200"
                  style={{ 
                    backgroundColor: '#F5EEDD',
                    color: '#06202B',
                    borderColor: '#7AE2CF'
                  }}
                  placeholder="Enter your email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#7AE2CF' }}
                >
                  Password
                </label>
                <input
                  type="password"
                  className="w-full p-3 rounded-lg border-2 outline-none focus:ring-2 transition-all duration-200"
                  style={{ 
                    backgroundColor: '#F5EEDD',
                    color: '#06202B',
                    borderColor: '#7AE2CF'
                  }}
                  placeholder="Create a password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  required
                />
                <p 
                  className="text-xs mt-1 opacity-80"
                  style={{ color: '#F5EEDD' }}
                >
                  Password must be at least 6 characters long
                </p>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full font-semibold py-3 rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg mt-6"
                style={{ 
                  backgroundColor: '#7AE2CF',
                  color: '#06202B'
                }}
              >
                {loading ? "Creating Account..." : "Register"}
              </button>
            </>
          ) : (
            // OTP Registration Mode
            <>
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#7AE2CF' }}
                >
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-3 rounded-lg border-2 outline-none focus:ring-2 transition-all duration-200"
                  style={{ 
                    backgroundColor: '#F5EEDD',
                    color: '#06202B',
                    borderColor: '#7AE2CF'
                  }}
                  placeholder="Enter your email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  disabled={otpSent}
                  required
                />
              </div>

              {otpSent && (
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: '#7AE2CF' }}
                  >
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border-2 outline-none focus:ring-2 transition-all duration-200"
                    style={{ 
                      backgroundColor: '#F5EEDD',
                      color: '#06202B',
                      borderColor: '#7AE2CF'
                    }}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                  <p 
                    className="text-xs mt-1 opacity-80"
                    style={{ color: '#F5EEDD' }}
                  >
                    Check your email for the OTP code
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={otpSent ? handleOtpVerify : handleOtpRequest}
                disabled={loading}
                className="w-full font-semibold py-3 rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg mt-6"
                style={{ 
                  backgroundColor: '#7AE2CF',
                  color: '#06202B'
                }}
              >
                {loading ? "Processing..." : otpSent ? "Verify OTP" : "Send OTP"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtpMode(false);
                  setOtpSent(false);
                  setOtp("");
                }}
                className="w-full font-semibold py-2 rounded-lg transition-all duration-200 hover:opacity-80 text-sm"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#7AE2CF',
                  border: `1px solid #7AE2CF`
                }}
              >
                Back to Regular Registration
              </button>
            </>
          )}
        </div>

        <div className="mt-6 pt-4" style={{ borderTop: `1px solid #7AE2CF` }}>
          <p 
            className="text-sm text-center mb-3 opacity-90"
            style={{ color: '#F5EEDD' }}
          >
            Or register with OTP
          </p>
          <button
            onClick={() => setOtpMode(true)}
            className="w-full font-semibold py-3 rounded-lg transition-all duration-200 hover:opacity-80 shadow-md"
            style={{ 
              backgroundColor: '#06202B',
              color: '#F5EEDD'
            }}
          >
            Register with OTP
          </button>
        </div>

        <p 
          className="flex mt-6 items-center justify-center text-sm font-medium gap-2"
          style={{ color: '#F5EEDD' }}
        >
          Already have an account?
          <button 
            className="hover:underline transition-all duration-200 font-semibold"
            style={{ color: '#7AE2CF' }} onClick={() => navigate("/login")}
          >
            Log In Here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;