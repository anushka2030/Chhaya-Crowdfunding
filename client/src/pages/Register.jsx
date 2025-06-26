import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from '../store/auth';
import { useDispatch } from 'react-redux';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const validateInput = () => {
    if (values.name.trim().length < 2) {
      alert("Name must be at least 2 characters");
      return false;
    }
    if (!values.email.includes("@") || !values.email.includes(".")) {
      alert("Enter a valid email address");
      return false;
    }
    if (values.password.trim().length < 6) {
      alert("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleOtpRequest = async () => {
    if (!values.email.includes("@") || !values.email.includes(".")) {
      alert("Enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to send OTP');
      alert('OTP sent to your email!');
      setOtpSent(true);
    } catch (err) {
      alert(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (!otp || otp.length !== 6) {
      alert("Enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, otp })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Invalid OTP');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch(loginSuccess({ token: data.token, user: data.user }));

      alert('OTP Verified! Logged in.');
      navigate('/');
    } catch (err) {
      alert(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Registration failed');

      localStorage.setItem('id', data.user.id);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      alert(err.message || 'Registration error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Register</h1>
        <p className="text-sm text-gray-500 mb-6">Create your account</p>

        <div className="space-y-4">
          {!otpMode ? (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={values.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-teal-500 text-white py-3 rounded-md font-semibold hover:bg-teal-600 transition"
              >
                {loading ? "Creating Account..." : "Register"}
              </button>
            </>
          ) : (
            <>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange}
                disabled={otpSent}
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
              />

              {otpSent && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
                />
              )}

              <button
                onClick={otpSent ? handleOtpVerify : handleOtpRequest}
                disabled={loading}
                className="w-full bg-teal-500 text-white py-3 rounded-md font-semibold hover:bg-teal-600 transition"
              >
                {loading ? "Processing..." : otpSent ? "Verify OTP" : "Send OTP"}
              </button>

              <button
                onClick={() => {
                  setOtpMode(false);
                  setOtp("");
                  setOtpSent(false);
                }}
                className="w-full text-sm text-teal-500 mt-2 hover:underline"
              >
                Back to regular registration
              </button>
            </>
          )}
        </div>

        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-center text-gray-600 mb-2">Or use OTP</p>
          <button
            onClick={() => setOtpMode(true)}
            className="w-full border border-teal-400 text-teal-600 py-2 rounded-md font-medium hover:bg-teal-50"
          >
            Register with OTP
          </button>
        </div>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-teal-600 hover:underline font-semibold"
          >
            Log In here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
