import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, XCircle } from "lucide-react"; // Make sure you have lucide-react or use text

const VerifyGuardian = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Call the backend route we just created in Step 1
        await axios.post("http://localhost:5000/api/guardian/verify-email", { token });
        setStatus("success");
        
        // Redirect to login after 3 seconds
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        setStatus("error");
      }
    };

    if (token) verifyToken();
  }, [token, navigate]);

  return (
    <div style={{ 
      height: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      background: "#FFF5F0",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{ 
        background: "white", 
        padding: "40px", 
        borderRadius: "15px", 
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)", 
        textAlign: "center",
        maxWidth: "400px"
      }}>
        
        {status === "loading" && (
           <div>
             <h2 style={{color: "#8B5E3C"}}>Verifying...</h2>
             <p>Please wait while we confirm your email.</p>
           </div>
        )}

        {status === "success" && (
           <div>
             <ShieldCheck size={64} color="#48BB78" style={{margin: "0 auto 20px"}} />
             <h2 style={{color: "#2F855A"}}>Verified Successfully!</h2>
             <p>You are now a confirmed Guardian.</p>
             <p style={{fontSize: "0.8rem", color: "#666", marginTop: "15px"}}>Redirecting...</p>
           </div>
        )}

        {status === "error" && (
           <div>
             <XCircle size={64} color="#E53E3E" style={{margin: "0 auto 20px"}} />
             <h2 style={{color: "#C53030"}}>Verification Failed</h2>
             <p>This link is invalid or has expired.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default VerifyGuardian;