import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 We don't need useParams anymore
import axios from "axios";
import { motion } from "framer-motion";
import "./Auth.css"; 

const ResetPassword = () => {
  const navigate = useNavigate();
  
  // ✅ FIX: Manually grab the ID from the URL
  // This works even if the router is confused by extra slashes
  const urlPath = window.location.pathname;
  const id = urlPath.split("/").filter(Boolean).pop(); 

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Send new password to backend using the extracted ID
      await axios.post(`http://localhost:5000/api/auth/reset-password/${id}`, { password });
      
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000); 
    } catch (err) {
      console.error(err);
      setError("Failed to reset password. Link might be invalid.");
    }
  };

  return (
    <div className="forgot-password-container">
      <motion.div 
        className="forgot-password-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div style={{textAlign: "center", marginBottom: "20px"}}>
           <div style={{fontSize: "40px", marginBottom: "10px"}}>🔑</div>
           <h2 style={{color: "#8B5E3C", margin: 0}}>New Password</h2>
           {/* Debugging: Show the ID to prove we found it */}
           <p style={{fontSize: "12px", color: "#ccc", marginTop: "5px"}}>ID: {id}</p>
        </div>

        {error && <div className="error-box">{error}</div>}
        
        {message ? (
          <div style={{color: "green", textAlign: "center", fontWeight: "bold", padding: "20px"}}>
             ✅ {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>New Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Enter new password"
              style={{width: "100%", padding: "10px", margin: "5px 0 15px", borderRadius: "8px", border: "1px solid #ccc"}}
            />

            <label>Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              placeholder="Confirm new password"
              style={{width: "100%", padding: "10px", margin: "5px 0 20px", borderRadius: "8px", border: "1px solid #ccc"}}
            />

            <button type="submit" className="auth-btn" style={{width: "100%"}}>Update Password</button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;