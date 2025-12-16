import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import "./Dashboard.css";
import {
  Calendar,
  Pill,
  FileText,
  Bell,
  User,
  Activity,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [medicines, setMedicines] = useState([]);
  const [reports, setReports] = useState([]);
  const [nextAppt, setNextAppt] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      try {
        // 1. Get Medicines
        const medRes = await axios.get(`http://localhost:5000/api/medicines/${user._id}`);
        setMedicines(medRes.data);

        // 2. Get Appointments
        const apptRes = await axios.get(`http://localhost:5000/api/appointments/${user._id}`);
        
        // 3. Get Reports 
        const reportRes = await axios.get(`http://localhost:5000/api/reports/${user._id}`);
        setReports(reportRes.data); // 👈 We store them here

        // 4. ROBUST DATE FILTERING
        const todayStr = new Date().toISOString().split('T')[0];

        const futureAppts = apptRes.data.filter(a => {
            return a.date >= todayStr;
        });
        
        futureAppts.sort((a, b) => a.date.localeCompare(b.date));

        if (futureAppts.length > 0) {
          setNextAppt(futureAppts[0]);
        } else if (apptRes.data.length > 0) {
             const allSorted = apptRes.data.sort((a,b) => b.date.localeCompare(a.date));
             setNextAppt(allSorted[0]); 
        }

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, [user?._id]);

  return (
    <div className="dashboard-container">
      
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Welcome, {user ? `${user.firstName} ${user.lastName}` : "Guest"}</h1>
        <p>Your health overview at a glance</p>
      </div>

      {/* GRID WRAPPER */}
      <div className="dashboard-grid">

        {/* === CARD 1: NEXT APPOINTMENT === */}
        <div 
           className="dashboard-card" 
           onClick={() => navigate("/appointments")} 
           style={{cursor: "pointer", borderLeft: nextAppt ? "5px solid #8B5E3C" : "none"}}
        >
          <div className="card-icon"><Calendar /></div>

          <h3>Next Appointment</h3>
          
          {nextAppt ? (
            <div className="fade-in">
               <p style={{fontWeight: "bold", fontSize: "1.2rem", margin: "10px 0 5px", color: "#333"}}>
                 {nextAppt.doctorName}
               </p>
               <p style={{margin: 0, fontSize: "0.95rem", color: "#666"}}>
                 {nextAppt.specialty}
               </p>
               <div style={{marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed #e0e0e0", fontSize: "0.95rem", color: "#8B5E3C", fontWeight: "600"}}>
                 📅 {nextAppt.date} <span style={{color:"#ccc"}}>|</span> 🕒 {nextAppt.time}
               </div>
            </div>
          ) : (
            <div style={{marginTop: "15px"}}>
                <p style={{color: "#888", marginBottom: "15px"}}>No upcoming appointments.</p>
                <button 
                    onClick={(e) => { e.stopPropagation(); navigate("/appointments"); }}
                    style={{
                        background: "#8B5E3C", color: "white", border: "none", 
                        padding: "8px 15px", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem", width: "100%"
                    }}
                >
                    + Book Now
                </button>
            </div>
          )}
        </div>

        {/* === CARD 2: MEDICINES === */}
        <div className="dashboard-card">
          <div className="card-icon"><Pill /></div>
          
          <h3>Medicines Tracking</h3>
          
          <p style={{fontWeight: "bold", fontSize: "1.2rem", color: "#8B5E3C", margin: "10px 0"}}>
            {medicines.length} Active Medicines
          </p>
          
          <div style={{fontSize: "0.85rem", color: "#666", marginBottom: "15px", minHeight: "40px"}}>
             {medicines.length > 0 ? (
               medicines.slice(0, 2).map(med => (
                 <div key={med._id} style={{marginBottom:"4px"}}>• {med.name} ({med.time})</div>
               ))
             ) : (
               <span>No medicines added yet.</span>
             )}
          </div>

          <button 
               onClick={() => navigate("/add-medicine")}
               style={{
                   background: "#8B5E3C", color: "white", border: "none", 
                   padding: "8px 15px", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem", width: "100%"
               }}
            >
               + Add Medicine
          </button>
        </div>

        {/* === CARD 3: REPORTS (Fixed!) 👈 === */}
        <div 
            className="dashboard-card" 
            onClick={() => navigate("/reports")} // Now Clickable!
            style={{cursor: "pointer"}}
        >
          <div className="card-icon"><FileText /></div>
          <h3>Medical Reports</h3>
          
          {/* 👇 NOW SHOWS REAL COUNT */}
          <p style={{fontWeight: "bold", fontSize: "1.5rem", color: "#333", margin: "10px 0"}}>
            {reports.length}
          </p>
          <p style={{color: "#666", fontSize: "0.9rem"}}>
            Uploaded Documents
          </p>
          <p style={{fontSize: "0.8rem", color: "#8B5E3C", marginTop: "10px"}}>
             Click to view files →
          </p>
        </div>

        {/* CARD 4 - REMINDERS */}
        <div className="dashboard-card">
          <div className="card-icon"><Bell /></div>
          <h3>Reminders</h3>
          <p>0 active reminders</p>
        </div>

        {/* CARD 5 - PATIENT DETAILS */}
        <div className="dashboard-card large-card">
          <div className="card-icon"><User /></div>
          <div className="patient-details-section">
            <h3>Patient Details</h3>
            <div className="details-grid">
              <div className="detail-item"><label>Age:</label><p>{user?.age || "--"}</p></div>
              <div className="detail-item"><label>Gender:</label><p>{user?.gender || "--"}</p></div>
              <div className="detail-item"><label>Email:</label><p>{user?.email || "No Email"}</p></div>
              <div className="detail-item"><label>Blood Group:</label><p>{user?.bloodGroup || "--"}</p></div>
            </div>
          </div>
        </div>

        {/* CARD 6 – HEALTH SUMMARY */}
        <div className="dashboard-card large-card">
          <div className="card-icon"><Activity /></div>
          <h3>Health Summary</h3>
          <ul className="summary-list">
            <li><span>Heart Rate:</span> Normal</li>
            <li><span>BP:</span> Normal</li>
            <li><span>Sleep:</span> 7–8 hrs</li>
            <li><span>Activity:</span> Good</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;