// src/pages/DoctorAppointment.js
import React, { useState } from "react";
import "./DoctorAppointment.css";
import DoctorSearch from "../components/DoctorSearch";

const DoctorAppointment = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  // 🧠 Handles Apollo redirect with confirmation popup
  const handleApolloRedirect = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowCheck(true);
      setTimeout(() => {
        window.open(
          "https://www.apollo247.com/book-appointment",
          "_blank",
          "noopener,noreferrer"
        );
        setShowPopup(false);
        setShowCheck(false);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="appointment-page-container">
      
      {/* SECTION 1: Top Card with Buttons */}
      <div className="appointment-card" style={{ marginBottom: "30px" }}>
        <h1>📅 Doctor Appointment</h1>
        <p className="subtitle">
          Schedule your medical consultations easily and conveniently.
        </p>

        <div className="options">
          <button className="primary-btn" onClick={handleApolloRedirect}>
            🩺 Book via Apollo
          </button>

          <button
            className="secondary-btn"
            onClick={() => alert("Manual booking feature coming soon!")}
          >
            💊 Add Appointment Manually
          </button>
        </div>
      </div>
  
      {/* SECTION 2: Doctor Search (Now sits cleanly below the top card) */}
      <div style={{ marginTop: "20px" }}>
         <DoctorSearch />
      </div>
      
      {/* ✅ Confirmation Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            {!showCheck ? (
              <>
                <div className="spinner"></div>
                <p>Redirecting to Apollo Booking Portal...</p>
              </>
            ) : (
              <>
                <div className="checkmark">✅</div>
                <p>All set! Opening Apollo...</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointment;