import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import emailjs from '@emailjs/browser'; // ⭐ IMPORT EMAILJS
import { ShieldCheck, XCircle, RefreshCw } from "lucide-react"; 

const VerifyGuardian = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [errorMessage, setErrorMessage] = useState("");
  
  // Resend States
  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState("idle"); // idle, sending, success, error

  // 1. Initial Verification on Load
  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.post("https://medcare-api-vw0f.onrender.com/api/auth/verify-guardian", { token });
        setStatus("success");
        // Optional: Redirect to landing page instead of login since guardians don't login
        setTimeout(() => navigate("/"), 4000);
      } catch (err) {
        setStatus("error");
        setErrorMessage(err.response?.data?.message || "Link expired or invalid.");
      }
    };

    if (token) verifyToken();
    else {
        setStatus("error");
        setErrorMessage("Invalid Link");
    }
  }, [token, navigate]);

  // 2. Resend Function (Uses EmailJS)
  const handleResend = async () => {
    if (!resendEmail) return;
    setResendStatus("sending");
    
    try {
      // Step A: Ask Backend for new token
      const res = await axios.post("https://medcare-api-vw0f.onrender.com/api/auth/resend-guardian-link", { email: resendEmail });
      
      // Step B: Get Token & Name from response
      const { guardianToken, firstName } = res.data;

      // Step C: Create the Link
      const verifyLink = `https://medcare-project-green.vercel.app/#/verify-guardian/${guardianToken}`;

      // Step D: Send Email via EmailJS
      await emailjs.send(
        "service_lt52jez",       // Your Service ID
        "template_rgln76n",      // Your Template ID
        {
            to_email: resendEmail,
            to_name: "Guardian",
            verify_link: verifyLink,
            message: `${firstName} has requested you to verify your email as their guardian.`
        },
        "4row3jIQabLW4zaY2"      // Your Public Key
      );

      setResendStatus("success");
    } catch (err) {
      console.error(err);
      setResendStatus("error");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#FFF5F0", fontFamily: "Poppins, sans-serif" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", textAlign: "center", maxWidth: "400px", width: "90%" }}>
        
        {/* LOADING STATE */}
        {status === "loading" && (
           <div>
             <div className="spinner" style={{margin: "0 auto 20px"}}></div>
             <h2 style={{color: "#8B5E3C"}}>Verifying...</h2>
           </div>
        )}

        {/* SUCCESS STATE */}
        {status === "success" && (
           <div>
             <ShieldCheck size={64} color="#48BB78" style={{margin: "0 auto 20px"}} />
             <h2 style={{color: "#2F855A"}}>Verified!</h2>
             <p>Thank you! You have successfully confirmed your status as a Guardian.</p>
             <p style={{fontSize: "0.8rem", color: "#A0AEC0", marginTop: "20px"}}>You can close this page now.</p>
           </div>
        )}

        {/* ERROR STATE + RESEND OPTION */}
        {status === "error" && (
           <div>
             <XCircle size={64} color="#E53E3E" style={{margin: "0 auto 20px"}} />
             <h2 style={{color: "#C53030", marginBottom: "10px"}}>Verification Failed</h2>
             <p style={{color: "#E53E3E", marginBottom: "20px"}}>{errorMessage}</p>
             
             {/* ⭐ RESEND SECTION */}
             <div style={{ borderTop: "1px solid #eee", paddingTop: "20px", textAlign: "left" }}>
                <p style={{marginBottom: "10px", fontWeight: "bold", color: "#4A5568", fontSize: "0.95rem"}}>Need a new link?</p>
                
                {resendStatus === "success" ? (
                    <div style={{ background: "#F0FFF4", padding: "10px", borderRadius: "8px", border: "1px solid #C6F6D5" }}>
                        <p style={{color: "#2F855A", margin: 0, fontSize: "0.9rem"}}>✅ New link sent! Check your inbox.</p>
                    </div>
                ) : (
                    <>
                        <input 
                            type="email" 
                            placeholder="Enter Guardian Email" 
                            value={resendEmail}
                            onChange={(e) => setResendEmail(e.target.value)}
                            style={{ 
                                width: "100%", padding: "10px", marginBottom: "10px", 
                                borderRadius: "8px", border: "1px solid #CBD5E0", boxSizing: "border-box" 
                            }}
                        />
                        <button 
                            onClick={handleResend}
                            disabled={resendStatus === "sending" || !resendEmail}
                            style={{
                                width: "100%", padding: "10px", 
                                background: resendStatus === "sending" ? "#CBD5E0" : "#C05621", 
                                color: "white", border: "none", borderRadius: "8px", 
                                cursor: resendStatus === "sending" ? "not-allowed" : "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: "bold"
                            }}
                        >
                            {resendStatus === "sending" ? "Sending..." : <><RefreshCw size={18}/> Resend Link</>}
                        </button>
                        
                        {resendStatus === "error" && (
                            <p style={{color: "#E53E3E", fontSize: "0.8rem", marginTop: "8px"}}>
                                ❌ Failed to resend. Ensure the email is correct.
                            </p>
                        )}
                    </>
                )}
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default VerifyGuardian;