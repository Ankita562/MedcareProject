import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ⭐ IMPORT ADDED HERE
import { api } from "../api";
import "./PatientDetailsForm.css";

const PatientDetailsForm = ({ onSubmit }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    dob: "", 
    age: "", 
    gender: "",
    weight: "",
    allergies: "",
    contact: "",
    email: "",
    guardianEmail: "" 
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [needsGuardian, setNeedsGuardian] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("patientDetails");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch {
        console.warn("Invalid patientDetails data in localStorage");
      }
    }
  }, []);

  // ⭐ AUTOMATIC AGE CALCULATION & HIDE LOGIC
  useEffect(() => {
    const currentAge = parseInt(formData.age);

    if (!isNaN(currentAge)) {
      // If Age is between 18 and 60...
      if (currentAge >= 18 && currentAge <= 60) {
        setNeedsGuardian(false);
        
        // Clear email if it exists (prevents loops)
        if (formData.guardianEmail !== "") {
          setFormData(prev => ({ ...prev, guardianEmail: "" }));
        }
      } 
      // If Age is < 18 or > 60...
      else {
        setNeedsGuardian(true);
      }
    }
  }, [formData.age]);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.dob || !formData.contact) {
      setMessage("⚠️ Please fill in all required fields.");
      return;
    }

    if (needsGuardian && !formData.guardianEmail) {
      setMessage("⚠️ Guardian Email is required for this age group.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      localStorage.setItem("patientDetails", JSON.stringify(formData));
      await api.patient.submit(formData);

      setMessage("✅ Details saved successfully!");
      if (onSubmit) onSubmit();

      setTimeout(() => navigate("/next-step"), 1000);
    } catch (error) {
      console.error("❌ Error submitting patient details:", error);
      setMessage("❌ Failed to save details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ⭐ RESEND LINK FUNCTION
  const resendGuardianLink = async () => {
    if (!formData.guardianEmail) return;
    try {
        await axios.post("https://medcare-api-vw0f.onrender.com/api/auth/resend-guardian-link", { 
            email: formData.guardianEmail 
        });
        alert("✅ Verification link resent! Check the inbox.");
    } catch (error) {
        console.error(error);
        alert("❌ Failed to resend link. Please check the email.");
    }
  };

  return (
    <main className="patient-form fade-in">
      <h1>🧑‍⚕️ Patient Information</h1>
      <p className="form-subtitle">Please enter your medical details carefully.</p>

      <form onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date of Birth
          <input
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </label>

        {/* Display Calculated Age */}
        {formData.age !== "" && (
            <p style={{ marginTop: "-10px", marginBottom: "15px", fontSize: "0.9rem", color: "#666" }}>
                Calculated Age: <strong>{formData.age} years</strong>
            </p>
        )}

        {/* ⭐ CONDITIONAL GUARDIAN BOX (Pink Box with Resend Button) ⭐ */}
        {needsGuardian && (
          <div className="guardian-alert-box" style={{ 
              background: "#FFF5F5", 
              border: "1px solid #FEB2B2", 
              padding: "15px", 
              borderRadius: "8px", 
              marginTop: "15px",
              marginBottom: "20px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <label style={{ color: "#C53030", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                    🛡️ Guardian Email
                </label>
                
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ 
                        background: "#FBD38D", color: "#744210", 
                        padding: "4px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "bold" 
                    }}>
                        ⏳ Pending
                    </span>
                    
                    <button 
                        type="button" 
                        onClick={resendGuardianLink}
                        style={{
                            fontSize: "0.8rem", textDecoration: "none", 
                            color: "#C05621", background: "none", border: "none", cursor: "pointer",
                            padding: 0
                        }}
                    >
                        Resend Link
                    </button>
                </div>
            </div>

            <input 
              type="email" 
              name="guardianEmail" 
              value={formData.guardianEmail} 
              onChange={handleChange} 
              placeholder="guardian@example.com"
              style={{ 
                  width: "100%", padding: "10px", 
                  border: "1px solid #FC8181", borderRadius: "6px", background: "#fff",
                  color: "#2D3748"
              }}
            />
            <p style={{ color: "#C53030", fontSize: "0.8rem", marginTop: "5px" }}>
              (Required if Age &lt; 18 or &gt; 60)
            </p>
          </div>
        )}

        <label>
          Gender
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Weight (kg)
          <input
            name="weight"
            type="number"
            placeholder="Weight"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Allergies (if any)
          <input
            name="allergies"
            placeholder="Allergies"
            value={formData.allergies}
            onChange={handleChange}
          />
        </label>

        <label>
          Contact Number
          <input
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email Address
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "⏳ Saving..." : "💾 Save & Continue"}
        </button>
      </form>

      {message && <p className="form-message">{message}</p>}
    </main>
  );
};

export default PatientDetailsForm;