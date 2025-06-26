import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authActions } from "../store/auth";
import axios from "axios";
import { useDispatch } from "react-redux";

const RequestOTP = () => {
  const [step, setStep] = useState(1); // 1 = request OTP, 2 = verify OTP
  const [values, setValues] = useState({
    email: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  // Validate email
  const validateEmail = () => {
    if (!values.email.trim()) {
      alert("Email is required!");
      return false;
    }
    if (!values.email.includes("@") || !values.email.includes(".")) {
      alert("Please enter a valid email address!");
      return false;
    }
    return true;
  };

  // Validate OTP
  const validateOTP = () => {
    if (values.otp.trim().length !== 6) {
      alert("OTP must be 6 digits long!");
      return false;
    }
    if (!/^\d+$/.test(values.otp)) {
      alert("OTP must contain only numbers!");
      return false;
    }
    return true;
  };

  // Handle request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    try {
      const response = await axios.post(
  `${process.env.REACT_APP_API_URL}/auth/request-otp`,
        { email: values.email }
      );
      alert(response.data.msg || "OTP sent to your email!");
      setStep(2); // Move to OTP verification step
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Handle verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!validateOTP()) return;

    setLoading(true);
    try {
      const response = await axios.post(
  `${process.env.REACT_APP_API_URL}/auth/verify-otp`,
        { email: values.email, otp: values.otp }
      );

      // Store auth data
      dispatch(authActions.login());
      dispatch(authActions.changeRole(response.data.user.role));

      localStorage.setItem("id", response.data.user.id);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);

      alert("Login successful!");
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
  `${process.env.REACT_APP_API_URL}/auth/request-otp`,
        { email: values.email }
      );
      alert(response.data.msg || "New OTP sent to your email!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Failed to resend OTP!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-zinc-900 px-12 py-8 flex items-center justify-center">
      <div className="mb-14 bg-neutral-950 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6">
        {step === 1 ? (
          <>
            <p className="text-zinc-200 text-xl">Login with OTP</p>
            <p className="text-zinc-400 text-sm mt-2">
              Enter your email to receive a one-time password
            </p>
            <div className="mt-4">
              <form onSubmit={handleRequestOTP}>
                <div>
                  <label htmlFor="email" className="text-zinc-400">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-1"
                    placeholder="Enter your email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-700 text-white font-semibold py-2 rounded hover:bg-yellow-500 disabled:bg-yellow-800 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <>
            <p className="text-zinc-200 text-xl">Verify OTP</p>
            <p className="text-zinc-400 text-sm mt-2">
              Enter the 6-digit code sent to {values.email}
            </p>
            <div className="mt-4">
              <form onSubmit={handleVerifyOTP}>
                <div>
                  <label htmlFor="otp" className="text-zinc-400">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-1 text-center text-lg tracking-widest"
                    placeholder="Enter 6-digit OTP"
                    name="otp"
                    value={values.otp}
                    onChange={handleChange}
                    maxLength="6"
                    required
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-700 text-white font-semibold py-2 rounded hover:bg-yellow-500 disabled:bg-yellow-800 disabled:cursor-not-allowed"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </form>

              <div className="mt-4">
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="w-full bg-zinc-700 text-white font-semibold py-2 rounded hover:bg-zinc-600 disabled:bg-zinc-800 disabled:cursor-not-allowed"
                >
                  {loading ? "Resending..." : "Resend OTP"}
                </button>
              </div>

              <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold gap-2">
                Want to change email?
                <button
                  onClick={() => setStep(1)}
                  className="text-zinc-500 hover:underline bg-transparent border-none cursor-pointer"
                >
                  Go Back
                </button>
              </p>
            </div>
          </>
        )}

        <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold gap-2">
          Have a password?
          <Link className="text-zinc-500 hover:underline" to="/login">
            Log In Here
          </Link>
        </p>

        <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold gap-2">
          Don't have an account?
          <Link className="text-zinc-500 hover:underline" to="/signup">
            Sign Up Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RequestOTP;