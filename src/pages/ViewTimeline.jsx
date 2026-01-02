import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Calendar, 
  Pill, 
  FileText, 
  Activity, 
  Clock,
  Filter 
} from "lucide-react";
import "./ViewTimeline.css"; 

const ViewTimeline = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  //  1. Add Filter State
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    const fetchTimeline = async () => {
      if (!user?._id) return;

      try {
        const [apptRes, medRes, reportRes, historyRes] = await Promise.all([
          axios.get(`https://medcare-api-vw0f.onrender.com/api/appointments/${user._id}`),
          axios.get(`https://medcare-api-vw0f.onrender.com/api/medicines/${user._id}`),
          axios.get(`https://medcare-api-vw0f.onrender.com/api/reports/${user._id}`),
          axios.get(`https://medcare-api-vw0f.onrender.com/api/history/${user._id}`)
        ]);

        let events = [];

        // Appointments
        apptRes.data.forEach(item => {
          events.push({
            id: item._id,
            type: "Appointment",
            date: new Date(item.date),
            title: `Visited Dr. ${item.doctorName} (${item.specialty})`,
            desc: `Scheduled for ${item.time}. Status: ${item.status || "Upcoming"}`,
            icon: <Calendar size={20} color="#6366f1" />,
            bgColor: "#EEF2FF"
          });
        });

        // Medicines
        medRes.data.forEach(item => {
          events.push({
            id: item._id,
            type: "Medicine",
            date: new Date(item.createdAt), 
            title: `Started Medication: ${item.name}`,
            desc: `Dosage: ${item.dosage}. Frequency: ${item.time}`,
            icon: <Pill size={20} color="#ef4444" />,
            bgColor: "#FEF2F2"
          });
        });

        // Reports
        if (reportRes.data) {
          reportRes.data.forEach(item => {
            events.push({
              id: item._id,
              type: "Report", 
              date: new Date(item.createdAt),
              title: `Uploaded Report: ${item.title || "Medical Document"}`,
              desc: `Type: ${item.type || "Lab Report"}`,
              icon: <FileText size={20} color="#f59e0b" />,
              bgColor: "#FFFBEB"
            });
          });
        }

        // History / Diagnosis
        historyRes.data.forEach(item => {
          events.push({
            id: item._id,
            type: "Diagnosis", 
            date: new Date(item.diagnosisDate || item.createdAt),
            title: `Diagnosed: ${item.condition}`,
            desc: `Dr. ${item.doctor} | Treatment: ${item.treatment}`,
            icon: <Activity size={20} color="#10b981" />,
            bgColor: "#ECFDF5"
          });
        });

        events.sort((a, b) => b.date - a.date);
        setTimelineData(events);
        setLoading(false);

      } catch (err) {
        console.error("Error building timeline:", err);
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [user?._id]);

  // 2. Filter Logic
  const filteredData = filterType === "All" 
    ? timelineData 
    : timelineData.filter(item => item.type === filterType);

  const formatDate = (dateObj) => {
    if (!dateObj || isNaN(dateObj)) return "Recent";
    return dateObj.toLocaleDateString("en-US", { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  return (
    <div className="timeline-page-container">
      
      {/* Header Section */}
      <div className="timeline-header">
        <h1><Clock size={32} /> Health Timeline</h1>
        <p className="timeline-subtitle">
          Your complete medical journey, automatically tracking every appointment, prescription, and report.
        </p>

        {/* 3. The Filter Dropdown UI */}
        <div style={{marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px"}}>
          <Filter size={18} color="#8B5E3C" />
          <span style={{fontWeight: "600", color: "#555"}}>Filter by:</span>
          
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "white",
              color: "#333",
              fontSize: "0.95rem",
              cursor: "pointer",
              outline: "none",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
            }}
          >
            <option value="All">Show All</option>
            <option value="Appointment">📅 Appointments</option>
            <option value="Medicine">💊 Medicines</option>
            <option value="Diagnosis">🩺 Diagnoses</option>
            <option value="Report">📄 Reports</option>
          </select>
        </div>
      </div>

      {/* Timeline List */}
      <div className="timeline-wrapper">
        <div className="timeline-line"></div>

        {loading ? (
          <p style={{textAlign: "center", marginTop: "20px"}}>Loading your history...</p>
        ) : filteredData.length === 0 ? (
          <div className="empty-state-box">
             <p>No activity found for this filter.</p>
             <button 
               onClick={() => setFilterType("All")}
               style={{
                 marginTop: "10px", background: "none", border: "none", 
                 color: "#8B5E3C", textDecoration: "underline", cursor: "pointer"
               }}
             >
               Clear Filters
             </button>
          </div>
        ) : (
          filteredData.map((event, index) => (
            <div key={`${event.type}-${index}`} className="timeline-event">
              
              <div className="timeline-icon-box" style={{ background: event.bgColor }}>
                {event.icon}
              </div>

              <div 
                className="timeline-card" 
                style={{
                  borderLeft: `4px solid ${event.bgColor === "#EEF2FF" ? "#6366f1" : event.bgColor === "#FEF2F2" ? "#ef4444" : "#10b981"}`
                }}
              >
                <div className="timeline-title-row">
                   <h3>{event.title}</h3>
                   <span className="timeline-date">{formatDate(event.date)}</span>
                </div>
                <p className="timeline-desc">{event.desc}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewTimeline;