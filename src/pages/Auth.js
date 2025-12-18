import axios from "axios";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import "./Auth.css";
import logo from '../assets/images/logo.png';
import { useNavigate } from "react-router-dom";

const Auth = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // LOGIN LOGIC
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("isLoggedIn", "true");

        if (onLogin) onLogin();
        navigate("/dashboard");

      } else {
        // REGISTER LOGIC
        if (!form.firstName || !form.lastName) {
          setError("Please fill in your first and last name.");
          return;
        }
        if (form.password.length < 4) {
          setError("Password must be at least 4 characters long.");
          return;
        }

        await axios.post("http://localhost:5000/api/auth/register", {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        });

        alert("Registration Successful! Please Login.");
        setIsLogin(true);
      }

    } catch (err) {
      console.error(err);
      const serverMessage = err.response?.data?.message || err.response?.data;
      setError(serverMessage || "Something went wrong!");
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT SIDE BRAND PANEL */}
      <motion.div
        className="auth-left"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <img src={logo} alt="MedCare" className="auth-illustration" />
        <h1 className="brand-title">MedCare</h1>
        <p className="auth-tagline">🌿 Your daily health assistant — simplified.</p>
      </motion.div>

      {/* RIGHT SIDE FORM */}
      <motion.div
        className="auth-right"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h2
          className="form-title"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {isLogin ? "Welcome Back 👋" : "Join MedCare 🎉"}
        </motion.h2>

        {error && <p className="error-box">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="two-input">
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label>First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
              </motion.div>

              <motion.div whileFocus={{ scale: 1.02 }}>
                <label>Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
              </motion.div>
            </div>
          )}

          <label>Email Address</label>
          <motion.input whileFocus={{ scale: 1.02 }} type="email" name="email" value={form.email} onChange={handleChange} required />

          <label>Password</label>
          <div className="password-field">
            <motion.input whileFocus={{ scale: 1.02 }} type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required />
            <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <motion.button whileTap={{ scale: 0.95 }} type="submit" className="auth-btn">
            {isLogin ? "Login" : "Create Account"}
          </motion.button>
        </form>

        {/* 👇 UPDATED FOOTER (Underlines Removed) */}
        <div className="toggle-auth" style={{ marginTop: "20px", fontSize: "0.95rem", color: "#666", textAlign: "center" }}>
          {isLogin ? (
            <>
              <span>Don't have an account? </span>
              <span onClick={() => setIsLogin(false)} style={{ color: "#8B5E3C", fontWeight: "bold", cursor: "pointer" }}>Sign Up</span>
              <span style={{ margin: "0 10px", color: "#ccc" }}>|</span>
              <span 
                onClick={() => navigate("/forgot-password")} 
                style={{ color: "#d9534f", fontWeight: "bold", cursor: "pointer" }}
              >
                Forgot Password?
              </span>
            </>
          ) : (
            <>
              <span>Already have an account? </span>
              <span onClick={() => setIsLogin(true)} style={{ color: "#8B5E3C", fontWeight: "bold", cursor: "pointer" }}>Login</span>
            </>
          )}
        </div>

      </motion.div>
    </div>
  );
};

export default Auth;