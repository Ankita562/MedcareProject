import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import axios from "axios";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; 
import "./Auth.css"; 

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token: id } = useParams(); 

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // VISIBILITY STATES
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await axios.post(`https://medcare-api-vw0f.onrender.com/api/auth/reset-password/${id}`, { password });
      
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000); 
    } catch (err) {
      console.error(err);
      setError("Failed to reset password. Link might be invalid or expired.");
    }
  };

  // Helper styles for the input wrapper
  const inputWrapperStyle = {
    position: "relative",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center"
  };

  const iconStyle = {
    position: "absolute",
    right: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#666",
    display: "flex",
    alignItems: "center"
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
        </div>

        {error && <div className="error-box">{error}</div>}
        
        {message ? (
          <div style={{color: "green", textAlign: "center", fontWeight: "bold", padding: "20px"}}>
              ✅ {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            
            {/* 1. New Password */}
            <label style={{fontWeight: "bold", display:"block", marginBottom:"5px"}}>New Password</label>
            <div style={inputWrapperStyle}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Enter new password"
                style={{
                    width: "100%", 
                    padding: "10px 40px 10px 10px", 
                    borderRadius: "8px", 
                    border: "1px solid #ccc",
                    outline: "none"
                }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={iconStyle}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* 2. Confirm Password */}
            <label style={{fontWeight: "bold", display:"block", marginBottom:"5px"}}>Confirm Password</label>
            <div style={inputWrapperStyle}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                placeholder="Confirm new password"
                style={{
                    width: "100%", 
                    padding: "10px 40px 10px 10px", 
                    borderRadius: "8px", 
                    border: "1px solid #ccc",
                    outline: "none"
                }}
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={iconStyle}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button type="submit" className="auth-btn" style={{width: "100%", marginTop: "10px"}}>Update Password</button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;