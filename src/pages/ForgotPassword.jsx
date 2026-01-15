import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios"; 
import emailjs from '@emailjs/browser'; // 👈 IMPORT THIS
import "./Auth.css"; 

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Call Backend to generate the Token
      const res = await axios.post("https://medcare-api-vw0f.onrender.com/api/auth/forgot-password", { email });
      
      // ⭐ DEBUG: Check if backend sent the token
      console.log("Backend Response:", res.data);

      // 2. Extract Token & Name (Assuming backend sends them)
      // Note: If  backend DOESN'T return 'resetToken', this part won't work
      // You might need to check your backend code to ensure it sends: res.json({ resetToken: "..." })
      const { resetToken, message } = res.data; 
      
      const tokenToUse = res.data.resetToken || res.data.token || res.data.userId; 

      if (tokenToUse) {
          // 3. Send Email via EmailJS (Frontend)
          const resetLink = `https://medcare-project-green.vercel.app/#/reset-password/${tokenToUse}`;
          
          await emailjs.send(
            "service_lt52jez",      // Your Service ID
            "template_rgln76n",     // Your Template ID (Reusing the verify one)
            {
              to_email: email,
              to_name: "User",      // Or res.data.firstName if available
              verify_link: resetLink, // We inject the reset link into the 'verify_link' variable
              message: "Click the link below to reset your password:"
            },
            "4row3jIQabLW4zaY2"     // Your Public Key
          );
          console.log("Email sent via EmailJS!");
      } else {
          console.warn("No token returned from backend. Relying on backend emailer.");
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <motion.div 
        className="forgot-password-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        
        {!submitted ? (
          <>
            <div style={{textAlign: "center", marginBottom: "20px"}}>
               <div style={{fontSize: "40px", marginBottom: "10px"}}>🔐</div>
               <h2 style={{color: "#8B5E3C", margin: 0}}>Reset Password</h2>
            </div>
            
            <p style={{marginBottom: "25px", color: "#666", textAlign: "center", lineHeight: "1.5"}}>
              Enter your registered email address. We'll send you a secure link to reset your password.
            </p>

            {/* ERROR MESSAGE DISPLAY */}
            {error && (
              <div style={{
                background: "#f8d7da", color: "#721c24", padding: "10px", 
                borderRadius: "5px", marginBottom: "15px", fontSize: "0.9rem", textAlign: "center"
              }}>
                {error} <br/>
                {error.includes("Create account") && (
                   <span 
                     onClick={() => navigate("/login")} 
                     style={{fontWeight: "bold", textDecoration: "none", cursor: "pointer"}}
                   >
                     Go to Sign Up
                   </span>
                )}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <label style={{fontWeight: "600", color: "#555", marginBottom: "8px", display: "block"}}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => { setEmail(e.target.value); setError(""); }} 
                required 
                placeholder="john@example.com"
                style={{
                    width: "100%", padding: "12px", borderRadius: "8px", 
                    border: "1px solid #ccc", marginBottom: "20px", fontSize: "1rem"
                }}
              />
              
              <motion.button 
                whileTap={{ scale: 0.95 }}
                type="submit" 
                className="auth-btn" 
                style={{width: "100%"}}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </motion.button>
            </form>

            <button 
                onClick={() => navigate("/login")} 
                style={{
                    background: "none", border: "none", color: "#8B5E3C", 
                    marginTop: "20px", cursor: "pointer", fontSize: "0.9rem", 
                    width: "100%", fontWeight: "bold"
                }}
            >
                ← Back to Login
            </button>
          </>
        ) : (
          <div style={{textAlign: "center", padding: "20px 0"}}>
            <motion.div 
               initial={{ scale: 0 }} 
               animate={{ scale: 1 }} 
               style={{fontSize: "60px", marginBottom: "15px", color: "#28a745"}}
            >
               ✅
            </motion.div>
            <h2 style={{color: "#28a745", marginBottom: "10px"}}>Check your Inbox!</h2>
            <p style={{color: "#555", marginBottom: "25px", lineHeight: "1.6"}}>
                We have sent a password reset link to:<br/>
                <strong style={{color: "#333"}}>{email}</strong>
            </p>
            <button 
                className="auth-btn" 
                onClick={() => navigate("/login")}
                style={{width: "100%"}}
            >
                Back to Login
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default ForgotPassword;