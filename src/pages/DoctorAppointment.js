import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./DoctorAppointment.css"; 

const DoctorAppointment = () => {
  const locationHook = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const [showPopup, setShowPopup] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const [form, setForm] = useState({
    doctorName: "",
    specialty: "General",
    date: "",
    time: "",
    location: "City Clinic",
  });

  // 1. CHECK FOR PRE-FILLED DATA
  useEffect(() => {
    if (locationHook.state) {
      const { prefillDoctor, prefillSpecialty } = locationHook.state;
      if (prefillDoctor) {
        setIsManualMode(true);
        setForm((prev) => ({
          ...prev,
          doctorName: prefillDoctor || "",
          specialty: prefillSpecialty || "General",
        }));
      }
    }
  }, [locationHook.state]);

  // 2. FETCH APPOINTMENTS
  useEffect(() => {
    const fetchAppointments = async () => {
      if (user?._id) {
        try {
          const res = await axios.get(`http://localhost:5000/api/appointments/${user._id}`);
          setAppointments(res.data);
        } catch (err) {
          console.error("Error fetching appointments:", err);
        }
      }
    };
    fetchAppointments();
  }, [user?._id]);

  // 3. HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login first");

    try {
      const res = await axios.post("http://localhost:5000/api/appointments/add", {
        userId: user._id,
        ...form,
      });

      setAppointments([...appointments, res.data]); 
      setForm({ doctorName: "", specialty: "General", date: "", time: "", location: "City Clinic" }); 
      setIsManualMode(false); 
      alert("Appointment Booked Successfully! ✅");
      
    } catch (err) {
      console.error(err);
      alert("Error booking appointment. Is Backend running?");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleApolloRedirect = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowCheck(true);
      setTimeout(() => {
        window.open("https://www.apollo247.com/doctors", "_blank", "noopener,noreferrer");
        setShowPopup(false);
        setShowCheck(false);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="appointment-page-container">
      
      {/* GRID CONTAINER FOR LAYOUT */}
      <div className="appointment-grid">
        
        {/* === LEFT CARD: ACTIONS === */}
        <div className="appointment-card">
          <h1>📅 Doctor Appointment</h1>
          
          {!isManualMode ? (
            <>
              <p className="subtitle">
                Schedule your medical consultations easily and conveniently.
              </p>

              <div className="options">
                <button className="primary-btn" onClick={handleApolloRedirect}>
                  🩺 Book via Apollo
                </button>

                <button className="secondary-btn" onClick={() => setIsManualMode(true)}>
                  💊 Add Appointment Manually
                </button>
              </div>

              <div className="coming-soon">
                <p>✨ Connect with top specialists near you.</p>
              </div>
            </>
          ) : (
            <div className="form-container" style={{ textAlign: "left", padding: "10px" }}>
              <h3 style={{ marginBottom: "15px", color: "#8B5E3C" }}>New Appointment</h3>
              <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
                
                <label>Doctor Name</label>
                <input name="doctorName" value={form.doctorName} onChange={handleChange} placeholder="Dr. Smith" required className="input-field" />

                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label>Date</label>
                    <input name="date" type="date" value={form.date} onChange={handleChange} required className="input-field" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Time</label>
                    <input name="time" type="time" value={form.time} onChange={handleChange} required className="input-field" />
                  </div>
                </div>

                <label>Specialty</label>
                <select name="specialty" value={form.specialty} onChange={handleChange} className="input-field">
                  <option>General</option>
                  <option>Cardiologist</option>
                  <option>Dentist</option>
                  <option>Dermatologist</option>
                  <option>Neurologist</option>
                  <option>Orthopedic</option>
                </select>

                <label>Location</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="Hospital Name" className="input-field" />

                <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                  <button type="submit" className="primary-btn" style={{ flex: 1 }}>Save</button>
                  <button type="button" className="secondary-btn" onClick={() => setIsManualMode(false)} style={{ flex: 1, background: "#eee", color: "#333", border: "none" }}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* === RIGHT CARD: UPCOMING VISITS (Only shows if appointments exist) === */}
        {appointments.length > 0 && (
          <div className="upcoming-container">
            <h3 style={{ color: "#8B5E3C", textAlign: "center", marginBottom: "20px" }}>🗓️ Upcoming Visits</h3>
            <div className="scrollable-list">
              {appointments.map((appt) => (
                <div key={appt._id} className="visit-card">
                  <div>
                    <h4 style={{ margin: 0, color: "#333" }}>{appt.doctorName}</h4>
                    <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "#666" }}>{appt.specialty} • {appt.location}</p>
                  </div>
                  <div style={{ textAlign: "right", minWidth: "80px" }}>
                    <p style={{ margin: 0, fontWeight: "bold", color: "#8B5E3C" }}>{appt.date}</p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#555" }}>{appt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            {!showCheck ? (
              <>
                <div className="spinner"></div>
                <p>Redirecting to Apollo...</p>
              </>
            ) : (
              <>
                <div className="checkmark">✅</div>
                <p>Opening Apollo 24/7...</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointment;