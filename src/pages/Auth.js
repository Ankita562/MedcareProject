// src/pages/Auth.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import "./Auth.css";

const Auth = ({ onLogin }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLogin) {
      if (!form.firstName || !form.lastName) {
        setError("Please fill in your first and last name.");
        return;
      }
    }

    if (!form.email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    if (form.password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(form));
    localStorage.setItem("isLoggedIn", true);

    if (onLogin) onLogin();
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
        <img
          src={require("../assets/images/logo.png")}
          alt="MedCare"
          className="auth-illustration"
        />

        <h1 className="brand-title">MedCare</h1>
        <p className="auth-tagline">
          🌿 Your daily health assistant — simplified.
        </p>
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

        {/* SHOW ERRORS */}
        {error && <p className="error-box">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="two-input">
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              <motion.div whileFocus={{ scale: 1.02 }}>
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </motion.div>
            </div>
          )}

          <label>Email Address</label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <div className="password-field">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="auth-btn"
          >
            {isLogin ? "Login" : "Create Account"}
          </motion.button>
        </form>

        <p className="toggle-auth">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Sign Up" : " Login"}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
