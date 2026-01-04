import emailjs from '@emailjs/browser';
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
  const [loading, setLoading] = useState(false); // New loading state

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(""); // New success message state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccessMsg("");
  };

  // ⭐ NEW FUNCTION: Handle Resend Email
  const handleResendEmail = async () => {
    if (!form.email) {
      setError("Please enter your email address to resend the link.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      // 1. Ask Backend for a new token
      const res = await axios.post("https://medcare-api-vw0f.onrender.com/api/auth/resend-verification", {
        email: form.email
      });

      // 2. Get the token from response
      const { verificationToken, firstName } = res.data;

      // 3. Create the Link 
    const verifyLink = `https://medcare-project-green.vercel.app/#/verify-email/${verificationToken}`;

      // 4. Send Email via EmailJS
      await emailjs.send(
        "service_lt52jez",     
        "template_rgln76n",     
        {
          to_email: form.email,
          to_name: firstName,
          verify_link: verifyLink
        },
        "4row3jIQabLW4zaY2"      
      );

      setSuccessMsg("Verification link sent! Check your email.");

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to resend email.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      if (isLogin) {
        // --- LOGIN LOGIC (No changes) ---
        const res = await axios.post("https://medcare-api-vw0f.onrender.com/api/auth/login", {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("isLoggedIn", "true");
        if (onLogin) onLogin();
        navigate("/dashboard");

      } else {
        // --- REGISTER LOGIC (Updated for EmailJS) ---
        if (!form.firstName || !form.lastName) setError("Please fill name.");
        if (form.password.length < 4) setError("Password too short.");

        // 1. Call Backend to create user
        const res = await axios.post("https://medcare-api-vw0f.onrender.com/api/auth/register", {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        });

        // 2. Get the token from the backend response
        const { verificationToken, firstName } = res.data;

        // 3. Create the Verify Link
        const verifyLink = `https://medcare-project-green.vercel.app/#/verify-email/${verificationToken}`;

        // 4. Send Email via EmailJS
        await emailjs.send(
          "service_lt52jez",     
          "template_rgln76n",   
          {
            to_email: form.email,   
            to_name: firstName,      
            verify_link: verifyLink 
          },
          "4row3jIQabLW4zaY2"      
        );

        setSuccessMsg("Registration successful! Check your email to verify.");
        setIsLogin(true);
        setForm({ ...form, password: "" });
      }

    } catch (err) {
      console.error(err);
      const serverMessage = err.response?.data?.message || "Something went wrong!";
      setError(serverMessage);
    }
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-left" initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
        <img src={logo} alt="MedCare" className="auth-illustration" />
        <h1 className="brand-title">MedCare</h1>
        <p className="auth-tagline">🌿 Your daily health assistant — simplified.</p>
      </motion.div>

      <motion.div className="auth-right" initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
        <motion.h2 className="form-title" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          {isLogin ? "Welcome Back 👋" : "Join MedCare 🎉"}
        </motion.h2>

        {error && <p className="error-box">{error}</p>}
        {successMsg && <p className="success-box" style={{ background: "#d4edda", color: "#155724", padding: "10px", borderRadius: "5px", fontSize: "0.9rem", textAlign: "center" }}>{successMsg}</p>}

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

        {/* RESEND LINK & FOOTER */}
        <div className="toggle-auth" style={{ marginTop: "20px", fontSize: "0.95rem", color: "#666", textAlign: "center" }}>
          
          {/* Only show "Resend" if on Login screen */}
          {isLogin && (
            <div style={{ marginBottom: "15px" }}>
              <span style={{ fontSize: "0.85rem", color: "#888" }}>Did not receive verification email? </span>
              <button 
                onClick={handleResendEmail} 
                disabled={loading}
                style={{ 
                  background: "none", border: "none", padding: 0, 
                  color: loading ? "#ccc" : "#4A90E2", 
                  fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", 
                  textDecoration: "underline", fontSize: "0.85rem"
                }}
              >
                {loading ? "Sending..." : "Resend Link"}
              </button>
            </div>
          )}

          {isLogin ? (
            <>
              <span>Don't have an account? </span>
              <span onClick={() => setIsLogin(false)} style={{ color: "#8B5E3C", fontWeight: "bold", cursor: "pointer" }}>Sign Up</span>
              <span style={{ margin: "0 10px", color: "#ccc" }}>|</span>
              <span onClick={() => navigate("/forgot-password")} style={{ color: "#d9534f", fontWeight: "bold", cursor: "pointer" }}>Forgot Password?</span>
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