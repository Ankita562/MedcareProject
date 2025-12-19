import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import "./Dashboard.css";
import AddReminderModal from "../components/AddReminderModal"; 
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
  
  // State
  const [medicines, setMedicines] = useState([]);
  const [reports, setReports] = useState([]);
  const [nextAppt, setNextAppt] = useState(null);
  const [healthSummary, setHealthSummary] = useState({
    bp: "No Data", heartRate: "No Data", weight: "No Data", temp: "No Data"
  });
   
  // Reminder States
  const [reminders, setReminders] = useState([]);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  // 1. Notification Permission
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // 2. Central Data Fetching Function
  const fetchData = useCallback(async () => {
    if (!user?._id) return;

    try {
      // Medicines
      const medRes = await axios.get(`http://localhost:5000/api/medicines/${user._id}`);
      setMedicines(medRes.data);

      // Appointments
      const apptRes = await axios.get(`http://localhost:5000/api/appointments/${user._id}`);
      
      // Reports 
      const reportRes = await axios.get(`http://localhost:5000/api/reports/${user._id}`);
      setReports(reportRes.data);

      // Reminders
      const remRes = await axios.get(`http://localhost:5000/api/reminders/${user._id}`);
      setReminders(remRes.data);

      // Health Analytics
      const analyticsRes = await axios.get(`http://localhost:5000/api/analytics/${user._id}`);
      const logs = analyticsRes.data;
      const getLatest = (category) => {
         const items = logs.filter(log => log.category === category);
         return items.length > 0 ? items[items.length - 1].value : "No Data";
      };
      setHealthSummary({
         bp: getLatest("Blood Pressure"),
         heartRate: getLatest("Heart Rate"),
         weight: getLatest("Weight"),
         temp: getLatest("Temperature")
      });

      // ⭐ NEXT APPOINTMENT LOGIC (Improved)
      const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
      
      const futureAppts = apptRes.data.filter(a => {
         // Ensure we compare compatible date strings
         return a.date >= todayStr; 
      });
      
      // Sort by earliest date first
      futureAppts.sort((a, b) => a.date.localeCompare(b.date));
      
      if (futureAppts.length > 0) {
        setNextAppt(futureAppts[0]);
      } else {
        setNextAppt(null);
      }

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 3. Notification Checker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      reminders.forEach(rem => {
        const remDate = new Date(rem.datetime);
        const isTimeMatch = 
           remDate.getHours() === now.getHours() && 
           remDate.getMinutes() === now.getMinutes();

        const notificationKey = `notified-${rem._id}-${now.toDateString()}-${now.getHours()}:${now.getMinutes()}`;
        const alreadyNotified = localStorage.getItem(notificationKey);

        if (isTimeMatch && !alreadyNotified) {
           new Notification(`⏰ Reminder: ${rem.title}`, {
             body: "It's time to take action!",
             icon: "/favicon.ico"
           });
           localStorage.setItem(notificationKey, "true");
        }
      });
    }, 5000); 

    return () => clearInterval(interval);
  }, [reminders]);

  // Delete Reminder Function
  const deleteReminder = async (id) => {
     if(window.confirm("Delete this reminder?")) {
        try {
           await axios.delete(`http://localhost:5000/api/reminders/${id}`);
           fetchData(); 
        } catch(err) { console.error(err); }
     }
  };

  // ⭐ NEW: Cancel Appointment Function
  const cancelAppointment = async (id) => {
    if (window.confirm("Cancel this appointment?")) {
      try {
        await axios.delete(`http://localhost:5000/api/appointments/${id}`);
        fetchData(); // Refresh to show next one or empty
      } catch (err) {
        console.error("Failed to cancel appointment", err);
      }
    }
  };
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user ? `${user.firstName} ${user.lastName}` : "Guest"}</h1>
        <p>Your health overview at a glance</p>
      </div>

      <div className="dashboard-grid">

        {/* ⭐ CARD 1: APPOINTMENTS (UPDATED WITH DELETE) */}
        <div 
           className="dashboard-card" 
           onClick={() => navigate("/appointments")} 
           style={{cursor: "pointer", borderLeft: nextAppt ? "5px solid #8B5E3C" : "none"}}
        >
          <div className="card-icon"><Calendar /></div>
          <h3>Next Appointment</h3>
          {nextAppt ? (
            <div className="fade-in" style={{position: "relative"}}>
               
               {/* DELETE BUTTON */}
               <button 
                 onClick={(e) => {
                    e.stopPropagation(); // Prevent navigating
                    cancelAppointment(nextAppt._id);
                 }}
                 style={{
                   position: "absolute", top: 0, right: 0,
                   background: "#FFF5F5", color: "red", border: "none",
                   borderRadius: "50%", width: "25px", height: "25px", cursor: "pointer"
                 }}
                 title="Cancel Appointment"
               >
                 ✖
               </button>

               <p style={{fontWeight: "bold", fontSize: "1.2rem", margin: "10px 0 5px", color: "#333"}}>
                 {nextAppt.doctorName}
               </p>
               <p style={{margin: 0, fontSize: "0.95rem", color: "#666"}}>
                 {nextAppt.specialty}
               </p>
               <div style={{marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed #e0e0e0", fontSize: "0.95rem", color: "#8B5E3C", fontWeight: "600"}}>
                 📅 {nextAppt.date} | 🕒 {nextAppt.time}
               </div>
            </div>
          ) : (
            <div style={{marginTop: "15px"}}>
                <p style={{color: "#888", marginBottom: "15px"}}>No upcoming appointments.</p>
                <button className="dash-btn" onClick={(e) => { e.stopPropagation(); navigate("/appointments"); }}>+ Book Now</button>
            </div>
          )}
        </div>

        {/* CARD 2: MEDICINES */}
        <div className="dashboard-card">
          <div className="card-icon"><Pill /></div>
          <h3>Medicines</h3>
          <p style={{fontWeight: "bold", fontSize: "1.2rem", color: "#8B5E3C", margin: "10px 0"}}>{medicines.length} Active</p>
          <div style={{fontSize: "0.85rem", color: "#666", marginBottom: "15px", minHeight: "40px"}}>
             {medicines.length > 0 ? medicines.slice(0, 2).map(med => (
                 <div key={med._id} style={{marginBottom:"4px"}}>• {med.name}</div>
             )) : <span>No medicines added.</span>}
          </div>
          <button className="dash-btn" onClick={() => navigate("/add-medicine")}>+ Add Medicine</button>
        </div>

        {/* CARD 3: REPORTS */}
        <div className="dashboard-card" onClick={() => navigate("/reports")} style={{cursor: "pointer"}}>
          <div className="card-icon"><FileText /></div>
          <h3>Reports</h3>
          <p style={{fontWeight: "bold", fontSize: "1.5rem", color: "#333", margin: "10px 0"}}>{reports.length}</p>
          <p style={{color: "#666", fontSize: "0.9rem"}}>Uploaded Files</p>
        </div>

        {/* CARD 4: REMINDERS */}
        <div className="dashboard-card" style={{position: "relative"}}>
          <div className="card-icon"><Bell /></div>
          <h3>Reminders</h3>
          
          <div style={{marginBottom: "15px", flexGrow: 1}}>
             {reminders.length > 0 ? (
                <div style={{maxHeight: "150px", overflowY: "auto", paddingRight: "5px"}}>
                  {reminders.map(r => (
                    <div key={r._id} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center", 
                        padding:"10px 0", borderBottom:"1px dashed #eee"
                    }}>
                       <div>
                         <span style={{display:"block", fontWeight:"600", color: "#5D4037", fontSize: "0.9rem"}}>{r.title}</span>
                         <span style={{fontSize:"0.75rem", color:"#888"}}>
                           {new Date(r.datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </span>
                       </div>
                       <button 
                         onClick={(e) => { e.stopPropagation(); deleteReminder(r._id); }} 
                         style={{border:"none", background:"#FFF5F5", color:"#E53E3E", cursor:"pointer", padding: "5px", borderRadius: "5px"}}
                       >
                         🗑️
                       </button>
                    </div>
                  ))}
                </div>
             ) : (
                <div style={{textAlign: "center", marginTop: "20px", color: "#999"}}>
                    <p style={{fontSize: "0.9rem"}}>No active reminders.</p>
                </div>
             )}
          </div>

          <button className="dash-btn" onClick={() => setIsReminderModalOpen(true)} style={{marginTop: "auto"}}>+ Set Reminder</button>
        </div>

        {/* CARD 5: DETAILS */}
        <div className="dashboard-card large-card">
          <div className="card-icon"><User /></div>
          <h3>Patient Details</h3>
          <div className="details-grid" style={{marginTop: "10px"}}>
             <div className="detail-item"><label>Age:</label><p>{user?.age || "--"}</p></div>
             <div className="detail-item"><label>Blood:</label><p>{user?.bloodGroup || "--"}</p></div>
             <div className="detail-item"><label>Gender:</label><p>{user?.gender || "--"}</p></div>
             <div className="detail-item"><label>Email:</label><p>{user?.email || "No Email"}</p></div>
          </div>
        </div>

        {/* CARD 6: HEALTH SUMMARY */}
        <div className="dashboard-card large-card">
          <div className="card-icon"><Activity /></div>
          <h3>Health Summary</h3>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "10px"}}>
             <div className="summary-item"><span>❤️</span><div><label>Heart Rate</label><p>{healthSummary.heartRate}</p></div></div>
             <div className="summary-item"><span>🩸</span><div><label>BP</label><p>{healthSummary.bp}</p></div></div>
             <div className="summary-item"><span>⚖️</span><div><label>Weight</label><p>{healthSummary.weight}</p></div></div>
             <div className="summary-item"><span>🌡️</span><div><label>Temp</label><p>{healthSummary.temp}</p></div></div>
          </div>
          
          <button 
             style={{background:"none", border:"none", color:"#8B5E3C", fontSize:"0.85rem", marginTop:"15px", cursor:"pointer"}}
             onClick={() => navigate("/analytics")}
          >
             View detailed analytics →
          </button>
        </div>

      </div>

      <AddReminderModal 
         isOpen={isReminderModalOpen}
         onClose={() => setIsReminderModalOpen(false)}
         userId={user?._id}
         onSuccess={fetchData} 
      />

    </div>
  );
};

export default Dashboard;