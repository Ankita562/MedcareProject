import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import "./Dashboard.css";
import AddReminderModal from "../components/AddReminderModal"; 
import { toast } from "react-toastify";
import emailjs from '@emailjs/browser'; 
import {
  Calendar, Pill, FileText, Bell, User, Activity, Trash2, CheckCircle
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  
  // Data State
  const [medicines, setMedicines] = useState([]);
  const [reports, setReports] = useState([]);
  const [nextAppt, setNextAppt] = useState(null);
  const [healthSummary, setHealthSummary] = useState({
    bp: "No Data", heartRate: "No Data", weight: "No Data", temp: "No Data"
  });
   
  // Reminder States
  const [reminders, setReminders] = useState([]);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [activeAlert, setActiveAlert] = useState(null);

  // ⭐ Smart Initialization of Checked Items
  // This reads from storage OR resets if it's a new day
  const [checkedItems, setCheckedItems] = useState(() => {
    if (!user?._id) return {};

    const storageKey = `daily_checks_${user._id}`;
    const savedData = localStorage.getItem(storageKey);
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

    if (savedData) {
        const parsed = JSON.parse(savedData);
        // If the saved date MATCHES today, keep the checks
        if (parsed.date === today) {
            return parsed.items || {};
        }
    }
    // If no data OR date is old, start fresh (reset for next day)
    return {};
  });

  // ⭐ FIX 2: Save to Storage whenever an item is checked
  const markAsChecked = (itemId) => {
    if (!user?._id) return;

    setCheckedItems(prev => {
        const newState = { ...prev, [itemId]: true };
        
        // Save to LocalStorage with TODAY'S DATE
        const storageKey = `daily_checks_${user._id}`;
        const today = new Date().toISOString().split('T')[0];
        
        localStorage.setItem(storageKey, JSON.stringify({
            date: today,
            items: newState
        }));

        return newState;
    });
  };

  // Helper: Fix Timezone
  const formatTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', timeZone: 'UTC'
    });
  };

  // 1. Fetch Data
  const fetchData = useCallback(async () => {
    if (!user?._id) return;
    try {
      const [medRes, apptRes, reportRes, remRes, analyticsRes] = await Promise.all([
        axios.get(`https://medcare-api-vw0f.onrender.com/api/medicines/${user._id}`),
        axios.get(`https://medcare-api-vw0f.onrender.com/api/appointments/${user._id}`),
        axios.get(`https://medcare-api-vw0f.onrender.com/api/reports/${user._id}`),
        axios.get(`https://medcare-api-vw0f.onrender.com/api/reminders/${user._id}`),
        axios.get(`https://medcare-api-vw0f.onrender.com/api/analytics/${user._id}`)
      ]);

      setMedicines(medRes.data);
      setReports(reportRes.data);
      setReminders(remRes.data);

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

      const todayStr = new Date().toISOString().split('T')[0];
      const futureAppts = apptRes.data.filter(a => a.date >= todayStr);
      futureAppts.sort((a, b) => a.date.localeCompare(b.date));
      setNextAppt(futureAppts.length > 0 ? futureAppts[0] : null);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  }, [user?._id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // 2. Open Reminder Modal
  const handleOpenReminderModal = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }
    if (Notification.permission === "granted") {
      setIsReminderModalOpen(true);
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        toast.success("Notifications enabled! 🔔");
        setIsReminderModalOpen(true);
      } else {
        toast.info("Reminders disabled.");
      }
    } else {
      alert("Notifications are blocked. Please enable them in settings.");
    }
  };
  
  // 3. Reminder Checker (Now with SOUND 🔊)
useEffect(() => {
  const interval = setInterval(() => {
    if (Notification.permission !== "granted") return;
    const now = new Date();

    reminders.forEach(rem => {
      const remDate = new Date(rem.datetime);
      
      // Compare UTC hours to Local hours
      const isTimeMatch = 
         remDate.getUTCHours() === now.getHours() && 
         remDate.getUTCMinutes() === now.getMinutes();

      const notificationKey = `notified-${rem._id}-${now.toDateString()}-${now.getHours()}:${now.getMinutes()}`;
      const alreadyNotified = localStorage.getItem(notificationKey);

      if (isTimeMatch && !alreadyNotified) {
           console.log("✅ Triggering Reminder:", rem.title); 
           
           // Mark as notified FIRST (before showing alerts)
           localStorage.setItem(notificationKey, "true");
           
           // 1. Play Sound 🔊
           const audio = new Audio("/alarm.mp3.wav"); 
           audio.play().catch(e => console.log("Audio blocked by browser:", e));

           // 2. Show Visual Alerts
           setActiveAlert(rem);
           new Notification(`⏰ Reminder: ${rem.title}`, {
             body: "It's time to take action!",
             icon: "/favicon.ico"
           });
      }
    });
  }, 2000); 

  return () => clearInterval(interval);
}, [reminders]);

  // ⭐ 4. UPDATED: Notify Guardian & Persist Checkmark
  const notifyGuardian = async (type, itemId, itemName) => {
    if (!user?._id) return;
    
    // ⭐ Save to persistent storage immediately
    markAsChecked(itemId);

    // A. Send Email to Guardian
    if (user.guardianEmail && user.isGuardianVerified) {
        try {
            await emailjs.send(
                "service_lt52jez",     
                "template_rgln76n", 
                {
                    to_email: user.guardianEmail,
                    patient_name: user.firstName,
                    notification_type: type, 
                    message: `${type} Completed: ${itemName}`,
                    time: new Date().toLocaleString()
                },
                "4row3jIQabLW4zaY2"   
            );
            toast.success("Guardian notified via Email! 📧");
        } catch (e) {
            console.error("EmailJS Error:", e);
        }
    } else {
        toast.success(`${itemName} marked as done! 👍`);
    }

    // B. Sync with Backend (Optional Log)
    try {
      await axios.post("https://medcare-api-vw0f.onrender.com/api/guardian/notify", {
        userId: user._id, type: type, itemName: itemName 
      });
    } catch (err) {
      console.error("Backend sync error:", err);
    }
  };

  const deleteMedicine = async (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      try { await axios.delete(`https://medcare-api-vw0f.onrender.com/api/medicines/${id}`); toast.success("Deleted"); fetchData(); } 
      catch (err) { toast.error("Failed"); }
    }
  };

  const deleteReminder = async (id) => {
     if(window.confirm("Delete reminder?")) {
        try { await axios.delete(`https://medcare-api-vw0f.onrender.com/api/reminders/${id}`); fetchData(); } 
        catch(err) { console.error(err); }
     }
  };

  const cancelAppointment = async (id) => {
    if (window.confirm("Cancel appointment?")) {
      try { await axios.delete(`https://medcare-api-vw0f.onrender.com/api/appointments/${id}`); fetchData(); } 
      catch (err) { console.error(err); }
    }
  };

  return (
    <div className="dashboard-container">
      
      {activeAlert && (
        <div className="alert-overlay">
           <div className="alert-box">
              <span className="alert-icon-large">⏰</span>
              <h2 className="alert-title">Reminder!</h2>
              <p style={{color: "#666", marginBottom: "5px"}}>It's time for:</p>
              <h3 className="alert-message">{activeAlert.title}</h3>
              <button className="alert-dismiss-btn" onClick={() => setActiveAlert(null)}>✅ Okay, Got it!</button>
           </div>
        </div>
      )}

      <div className="dashboard-header">
        <h1>Welcome, {user ? `${user.firstName} ${user.lastName}` : "Guest"}</h1>
        <p>Your health overview at a glance</p>
      </div>

      <div className="dashboard-grid">

        {/* CARD 1: APPOINTMENTS */}
        <div className="dashboard-card" onClick={() => navigate("/appointments")} style={{cursor: "pointer", borderLeft: nextAppt ? "5px solid #8B5E3C" : "none"}}>
          <div className="card-icon"><Calendar /></div>
          <h3>Next Appointment</h3>
          {nextAppt ? (
            <div className="fade-in" style={{position: "relative"}}>
               <button onClick={(e) => { e.stopPropagation(); cancelAppointment(nextAppt._id); }}
                style={{position: "absolute", top: 0, right: 0, background: "#FFF5F5", color: "red", border: "none", borderRadius: "50%", width: "25px", height: "25px", cursor: "pointer"}}>✖</button>

               <p style={{fontWeight: "bold", fontSize: "1.2rem", margin: "10px 0 5px", color: "#333"}}>{nextAppt.doctorName}</p>
               <p style={{margin: 0, fontSize: "0.95rem", color: "#666"}}>{nextAppt.specialty}</p>
               <div style={{marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed #e0e0e0", fontSize: "0.95rem", color: "#8B5E3C", fontWeight: "600"}}>
                 📅 {nextAppt.date} | 🕒 {nextAppt.time}
               </div>

               {checkedItems[nextAppt._id] ? (
                   <button disabled style={{marginTop: "15px", width: "100%", padding: "8px", background: "#E2E8F0", color: "#718096", border: "none", borderRadius: "5px", cursor: "not-allowed", fontWeight: "bold"}}>✅ Visited</button>
               ) : (
                   <button onClick={(e) => { e.stopPropagation(); notifyGuardian("Appointment", nextAppt._id, nextAppt.doctorName); }}
                      style={{marginTop: "15px", width: "100%", padding: "8px", background: "#48BB78", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px"}}>
                      <CheckCircle size={16} /> Mark as Visited
                   </button>
               )}
            </div>
          ) : (
            <div style={{marginTop: "auto"}}>
                <p style={{color: "#888", marginBottom: "15px", padding: "6px"}}>No upcoming appointments.</p>
                <button className="dash-btn" onClick={(e) => { e.stopPropagation(); navigate("/appointments"); }} style={{marginTop: "auto"}}>+ Book Now</button>
            </div>
          )}
        </div>

        {/* CARD 2: MEDICINES */}
        <div className="dashboard-card" style={{display: 'flex', flexDirection: 'column'}}>
          <div className="card-header"><div className="card-icon"><Pill /></div><h3>Medicines</h3></div>
          <p style={{fontWeight: "bold", fontSize: "1.2rem", color: "#8B5E3C", margin: "10px 0"}}>{medicines.length} Active</p>
          
          <div style={{flexGrow: 1, overflowY: "auto", maxHeight: "150px", paddingRight: "5px", marginBottom: "15px"}}>
             {medicines.length > 0 ? medicines.map(med => (
                 <div key={med._id} style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", padding: "8px", borderBottom: "1px dashed #eee", background: "#fafafa", borderRadius: "6px"}}>
                     <div>
                        <div style={{fontWeight: "600", fontSize: "0.95rem"}}>{med.name}</div>
                        <div style={{fontSize: "0.8rem", color: "#666"}}>{med.dosage || "No dosage"}</div>
                     </div>
                     <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
                        {checkedItems[med._id] ? (
                            <span style={{fontSize: "0.75rem", background: "#C6F6D5", color: "#22543D", padding: "4px 8px", borderRadius: "12px", fontWeight: "bold"}}>Taken</span>
                        ) : (
                            <button onClick={(e) => { e.stopPropagation(); notifyGuardian("Medicine", med._id, med.name); }} title="I took this"
                              style={{border: "none", background: "#EDF2F7", color: "#48BB78", cursor: "pointer", padding: "6px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                              <CheckCircle size={18} />
                            </button>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); deleteMedicine(med._id, med.name); }} style={{border: "none", background: "none", color: "#E53E3E", cursor: "pointer", padding: "6px"}}><Trash2 size={16} /></button>
                     </div>
                 </div>
             )) : <span style={{color: "#888", fontStyle: "italic"}}>No medicines added.</span>}
          </div>
          <button className="dash-btn" onClick={() => navigate("/medicines/new")} style={{marginTop: "auto"}}>+ Add Medicine</button>
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
                    <div key={r._id} style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding:"10px 0", borderBottom:"1px dashed #eee"}}>
                       <div>
                           <span style={{display:"block", fontWeight:"600", fontSize: "0.9rem"}}>{r.title}</span>
                           <span style={{fontSize:"0.75rem", color:"#888"}}>{formatTime(r.datetime)}</span>
                       </div>
                       <button onClick={(e) => { e.stopPropagation(); deleteReminder(r._id); }} style={{border:"none", background:"#FFF5F5", color:"#E53E3E", cursor:"pointer", padding: "5px", borderRadius: "5px"}}>🗑️</button>
                    </div>
                  ))}
                </div>
             ) : <div style={{textAlign: "center", marginTop: "20px", color: "#999"}}><p style={{fontSize: "0.9rem"}}>No active reminders.</p></div>}
          </div>
          
          <button className="dash-btn" onClick={handleOpenReminderModal} style={{marginTop: "auto"}}>+ Set Reminder</button>
        </div>

        {/* CARD 5: PATIENT DETAILS */}
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
          <button style={{background:"none", border:"none", color:"#8B5E3C", fontSize:"0.85rem", marginTop:"15px", cursor:"pointer"}} onClick={() => navigate("/analytics")}>View detailed analytics →</button>
        </div>

      </div>

      <AddReminderModal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} userId={user?._id} onSuccess={fetchData} />
    </div>
  );
};

export default Dashboard;