import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DoctorAppointment.css"; // Keep your existing CSS file

const DoctorAppointment = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  
  // --- STATE: Apollo Popup ---
  const [showPopup, setShowPopup] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  // --- STATE: Manual Appointment Data ---
  const [appointments, setAppointments] = useState([]);
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [specialty, setSpecialty] = useState("General");
  const [location, setLocation] = useState("");

  // --- 1. Fetch Appointments ---
  const fetchAppointments = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`https://medcare-api-vw0f.onrender.com/api/appointments/${user._id}`);
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user?._id]);

  // --- 2. Handle Apollo Redirect ---
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

  // --- 3. Handle Manual Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://medcare-api-vw0f.onrender.com/api/appointments/add", {
        userId: user._id,
        doctorName,
        date,
        time,
        specialty,
        location
      });
      // Reset Form & Refresh
      setDoctorName(""); setDate(""); setTime(""); setLocation("");
      fetchAppointments();
    } catch (err) {
      alert("Error booking appointment");
    }
  };

  // --- 4. Handle Delete ---
  const handleDelete = async (id) => {
    if (window.confirm("Delete this appointment record?")) {
      try {
        await axios.delete(`https://medcare-api-vw0f.onrender.com/api/appointments/${id}`);
        fetchAppointments();
      } catch (err) {
        console.error("Failed to delete", err);
      }
    }
  };

  // --- 5. Filtering Logic ---
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingVisits = appointments.filter(appt => appt.date >= todayStr);
  upcomingVisits.sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="appointment-page-container">
      
      {/* HEADER SECTION */}
      <div className="appointment-card" style={{marginBottom: "20px"}}>
        <h1>📅 Doctor Appointment</h1>
        <p className="subtitle">Schedule your medical consultations via Apollo or track them manually.</p>
        
        {/* APOLLO BUTTON */}
        <div className="options" style={{marginTop: "20px"}}>
          <button className="primary-btn" onClick={handleApolloRedirect} style={{width: "100%", padding: "15px", fontSize: "1.1rem"}}>
            🩺 Book Online via Apollo 24/7
          </button>
        </div>
      </div>

      {/* MANUAL BOOKING SECTION (Split View) */}
      <div style={{display: "flex", flexWrap: "wrap", gap: "20px"}}>
        
        {/* LEFT: BOOKING FORM */}
        <div className="appointment-card" style={{flex: 1, minWidth: "300px", textAlign: "left"}}>
          <h3 style={{color: "#8B5E3C", borderBottom: "2px solid #eee", paddingBottom: "10px"}}>➕ Add Manual Record</h3>
          
          <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px"}}>
            <input type="text" placeholder="Doctor Name" value={doctorName} onChange={e => setDoctorName(e.target.value)} required style={inputStyle} />
            
            <div style={{display: "flex", gap: "10px"}}>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={inputStyle} />
              <input type="time" value={time} onChange={e => setTime(e.target.value)} required style={inputStyle} />
            </div>

            <select value={specialty} onChange={e => setSpecialty(e.target.value)} style={inputStyle}>
              <option>General Physician</option>
              <option>Cardiologist</option>
              <option>Dermatologist</option>
              <option>Neurologist</option>
              <option>Dentist</option>
            </select>

            <input type="text" placeholder="Clinic / Hospital Name" value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} />
            
            <button type="submit" className="secondary-btn" style={{marginTop: "10px"}}>💾 Save to History</button>
          </form>
        </div>

        {/* RIGHT: UPCOMING LIST */}
        <div className="appointment-card" style={{flex: 1, minWidth: "300px", textAlign: "left"}}>
          <h3 style={{color: "#5D4037", borderBottom: "2px solid #eee", paddingBottom: "10px"}}>🗓️ Upcoming Visits</h3>
          
          {upcomingVisits.length > 0 ? (
            <div style={{marginTop: "15px", maxHeight: "400px", overflowY: "auto"}}>
              {upcomingVisits.map(appt => (
                <div key={appt._id} style={cardStyle}>
                  <div style={{display: "flex", justifyContent: "space-between"}}>
                     <div>
                        <strong style={{fontSize: "1.1rem", color: "#333"}}>{appt.doctorName}</strong>
                        <div style={{fontSize: "0.85rem", color: "#666"}}>{appt.specialty} • {appt.location}</div>
                     </div>
                     <div style={{textAlign: "right", color: "#8B5E3C", fontWeight: "bold"}}>
                        <div>{appt.date}</div>
                        <div style={{fontSize: "0.9rem"}}>{appt.time}</div>
                     </div>
                  </div>
                  <button onClick={() => handleDelete(appt._id)} style={deleteBtnStyle}>
                    ✖ Cancel / Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{color: "#888", marginTop: "20px", textAlign: "center"}}>No upcoming appointments.</p>
          )}
        </div>

      </div>

      {/* ✅ Confirmation Popup (Your Existing Logic) */}
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

// --- Styles for Form & Cards ---
const inputStyle = { width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" };
const cardStyle = { background: "#FFF8E7", padding: "15px", borderRadius: "10px", marginBottom: "10px", borderLeft: "5px solid #8B5E3C", position: "relative" };
const deleteBtnStyle = { marginTop: "10px", background: "none", border: "none", color: "#E53E3E", cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline", width: "100%", textAlign: "right" };

export default DoctorAppointment;