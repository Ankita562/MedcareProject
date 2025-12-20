import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verify = async () => {
      try {
        // Call backend to verify the token
        await axios.post(`http://localhost:5000/api/auth/verify-email/${token}`);
        setStatus("✅ Email Verified! Redirecting to login...");
        
        // Wait 3 seconds then go to login
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        console.error(err);
        setStatus("❌ Verification failed. The link may be invalid or expired.");
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#FDF6E3" }}>
      <div style={{ padding: "40px", background: "white", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
        <h2 style={{ color: "#8B5E3C" }}>{status}</h2>
      </div>
    </div>
  );
};

export default VerifyEmail;