import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Accept the onLogin prop we added in App.js
const VerifyEmail = ({ onLogin }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your account...");

  useEffect(() => {
    const verify = async () => {
      try {
        // 1. Send token to backend
        const res = await axios.post(`https://medcare-api-vw0f.onrender.com/api/auth/verify-email/${token}`);
        
        // 2. ⭐ AUTO-LOGIN LOGIC
        // Save user data just like a normal login
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("isLoggedIn", "true");

        // Update App.js state so the sidebar appears immediately
        if (onLogin) onLogin();

        setStatus("✅ Verified! Redirecting to Dashboard...");
        
        // 3. Redirect to Dashboard immediately
        setTimeout(() => {
            navigate("/dashboard");
        }, 1500);

      } catch (err) {
        console.error(err);
        setStatus("❌ Verification failed. The link may be invalid or expired.");
      }
    };
    verify();
  }, [token, navigate, onLogin]);

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#FDF6E3" }}>
      <div style={{ padding: "40px", background: "white", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
        <h2 style={{ color: "#8B5E3C", fontSize: "1.5rem" }}>{status}</h2>
      </div>
    </div>
  );
};

export default VerifyEmail;