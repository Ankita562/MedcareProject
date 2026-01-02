import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, FileText, Pill, Clock, Activity } from "lucide-react";

const Timeline = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`https://medcare-api-vw0f.onrender.com/api/timeline/${user._id}`);
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching timeline:", err);
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [user?._id]);

  // Helper to pick icon based on type
  const getIcon = (type) => {
    switch (type) {
      case "appointment": return <Calendar size={20} color="#fff" />;
      case "medicine": return <Pill size={20} color="#fff" />;
      case "report": return <FileText size={20} color="#fff" />;
      case "history": return <Activity size={20} color="#fff" />;
      default: return <Clock size={20} color="#fff" />;
    }
  };

  // Helper to pick color based on type
  const getColor = (type) => {
    switch (type) {
      case "appointment": return "#4A90E2";
      case "medicine": return "#E57373";   
      case "report": return "#8B5E3C";     
      case "history": return "#66BB6A";     
      default: return "#ccc";
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ color: "#5D4037", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
           🕒 Health Timeline
        </h1>
        <p style={{ color: "#888" }}>Track your medical journey — appointments, reports, and updates all in one place.</p>
      </div>

      {/* TIMELINE CONTAINER */}
      <div style={{ position: "relative", paddingLeft: "30px" }}>
        
        {/* VERTICAL LINE */}
        <div style={{
          position: "absolute", left: "14px", top: "10px", bottom: "0",
          width: "4px", background: "#EAD8B1", borderRadius: "2px"
        }}></div>

        {loading ? (
           <p style={{textAlign: "center", color: "#999"}}>Loading timeline...</p>
        ) : events.length > 0 ? (
           events.map((event, index) => (
            <div key={index} style={{ position: "relative", marginBottom: "40px" }}>
              
              {/* ICON BUBBLE */}
              <div style={{
                position: "absolute", left: "-32px", top: "0",
                width: "36px", height: "36px", borderRadius: "50%",
                background: getColor(event.type),
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)", zIndex: 2
              }}>
                {getIcon(event.type)}
              </div>

              {/* CARD */}
              <div style={{
                background: "white", padding: "20px", borderRadius: "15px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                borderLeft: `5px solid ${getColor(event.type)}`
              }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <h3 style={{ margin: 0, color: "#333", fontSize: "1.1rem" }}>{event.title}</h3>
                    <span style={{ fontSize: "0.85rem", color: "#999", display: "flex", alignItems: "center", gap: "5px" }}>
                       📅 {event.date}
                    </span>
                 </div>
                 <p style={{ margin: 0, color: "#666", lineHeight: "1.5" }}>
                    {event.description}
                 </p>
              </div>

            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", color: "#aaa", padding: "40px" }}>
             <p>No timeline events found yet. <br/> Add appointments, medicines, or reports to see them here!</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Timeline;