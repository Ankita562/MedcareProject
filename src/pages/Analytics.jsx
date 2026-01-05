import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Activity, Plus, X } from "lucide-react";

// ==========================================
// 🧠 MEDICAL LOGIC ENGINE (Standard Reference Ranges)
// ==========================================
const getHealthStatus = (category, value) => {
  if (!value) return { status: "", color: "#333" };
  const num = parseFloat(value);

  switch (category) {
    case "Blood Pressure":
      // Format expected: "120/80"
      const parts = value.toString().split("/");
      if (parts.length !== 2) return { status: "", color: "#333" };
      const sys = parseInt(parts[0]);
      const dia = parseInt(parts[1]);

      if (sys > 180 || dia > 120) return { status: "⚠️ Hypertensive Crisis", color: "#C53030" }; // Dark Red
      if (sys >= 140 || dia >= 90) return { status: "⚠️ High (Stage 2)", color: "#E53E3E" };     // Red
      if (sys >= 130 || dia >= 80) return { status: "⚠️ High (Stage 1)", color: "#DD6B20" };     // Orange
      if (sys >= 120 && dia < 80)  return { status: "⚠️ Elevated", color: "#D69E2E" };           // Gold
      if (sys < 90 || dia < 60)    return { status: "⚠️ Low BP", color: "#3182CE" };             // Blue
      return { status: "✅ Normal", color: "#38A169" };                                          // Green

    case "Heart Rate":
      if (num > 100) return { status: "⚠️ High (Tachycardia)", color: "#E53E3E" };
      if (num < 60)  return { status: "⚠️ Low (Bradycardia)", color: "#3182CE" };
      return { status: "✅ Normal", color: "#38A169" };

    case "Blood Sugar":
       // General guidelines (Fasting/Random mix safety check)
       if (num >= 200) return { status: "⚠️ High (Diabetes)", color: "#E53E3E" };
       if (num >= 140) return { status: "⚠️ High (Prediabetes)", color: "#DD6B20" };
       if (num < 70)   return { status: "⚠️ Low Sugar", color: "#3182CE" };
       return { status: "✅ Normal", color: "#38A169" };

    case "Temperature":
       if (num >= 100.4) return { status: "⚠️ Fever", color: "#E53E3E" };
       if (num < 95)     return { status: "⚠️ Hypothermia", color: "#3182CE" };
       return { status: "✅ Normal", color: "#38A169" };

    case "Weight":
       // Simple BMI estimation trigger if value is low/high for typical adults
       // (Real BMI requires height, so this is just a raw weight alert)
       if (num >= 100)  return { status: "⚠️ Check BMI", color: "#DD6B20" };
       if (num < 45)    return { status: "⚠️ Low Weight", color: "#3182CE" };
       return { status: "Recorded", color: "#38A169" };

    default:
      return { status: "", color: "#333" };
  }
};

const Analytics = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [logs, setLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newLog, setNewLog] = useState({ category: "Blood Pressure", value: "" });

  // Fetch Data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`https://medcare-api-vw0f.onrender.com/api/analytics/${user._id}`);
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user?._id) fetchAnalytics();
  }, [user?._id]);

  // Handle Submit
  const handleLogVital = async (e) => {
    e.preventDefault();
    if (!newLog.value) return;

    try {
      const res = await axios.post("https://medcare-api-vw0f.onrender.com/api/analytics/add", {
        userId: user._id,
        category: newLog.category,
        value: newLog.value
      });
      setLogs([res.data, ...logs]); // Add to list instantly
      setIsModalOpen(false);        // Close modal
      setNewLog({ category: "Blood Pressure", value: "" }); // Reset form
    } catch (err) {
      alert("Failed to save log");
    }
  };

  // Filter Data for Chart
  const [activeTab, setActiveTab] = useState("Blood Pressure");
  
  const chartData = logs
    .filter(l => l.category === activeTab)
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort purely for chart line
    .map(l => ({
        date: new Date(l.date).toLocaleDateString(),
        // For BP, we graph the Systolic (top number)
        value: activeTab === "Blood Pressure" ? parseInt(l.value.split("/")[0]) : parseFloat(l.value),
        originalValue: l.value,
        statusObj: getHealthStatus(activeTab, l.value)
    }));

  return (
    <div className="page-container" style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h1 style={{ color: "#2D3748", margin: 0 }}>Health Analytics</h1>
          <p style={{ color: "#718096" }}>Track your vitals with medical insights.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            background: "#8B5E3C", color: "white", border: "none", 
            padding: "12px 20px", borderRadius: "8px", cursor: "pointer", 
            display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold",
            boxShadow: "0 4px 6px rgba(139, 94, 60, 0.2)"
          }}
        >
          <Plus size={18} /> Log Vitals
        </button>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", overflowX: "auto", paddingBottom: "5px" }}>
        {["Blood Pressure", "Heart Rate", "Blood Sugar", "Weight", "Temperature"].map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveTab(cat)}
            style={{
              padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer",
              background: activeTab === cat ? "#8B5E3C" : "#EDF2F7",
              color: activeTab === cat ? "white" : "#4A5568", fontWeight: "500", whiteSpace: "nowrap",
              transition: "all 0.2s"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRAPH SECTION */}
      <div style={{ background: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", height: "300px", marginBottom: "30px" }}>
        <h3 style={{ marginBottom: "20px", color: "#2D3748" }}>{activeTab} Trends</h3>
        
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#A0AEC0" fontSize={12} tickLine={false} />
              <YAxis stroke="#A0AEC0" fontSize={12} tickLine={false} />
              <Tooltip 
                 content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={{ background: "white", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                          <p style={{ fontWeight: "bold", margin: "0 0 5px", color: "#555" }}>{data.date}</p>
                          <p style={{ margin: "0 0 5px", fontSize: "1.2rem", fontWeight: "bold" }}>{data.originalValue}</p>
                          <p style={{ color: data.statusObj.color, fontWeight: "bold", margin: 0, fontSize: "0.9rem" }}>
                             {data.statusObj.status}
                          </p>
                        </div>
                      );
                    }
                    return null;
                 }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8B5E3C" 
                strokeWidth={3} 
                dot={{ r: 4, fill: "#8B5E3C" }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#A0AEC0" }}>
             No data recorded yet. Log your first reading!
          </div>
        )}
      </div>

      {/* HISTORY LIST */}
      <h3 style={{ marginBottom: "15px", color: "#2D3748" }}>Recent History</h3>
      <div style={{ display: "grid", gap: "12px" }}>
        {logs.filter(l => l.category === activeTab).map(log => {
           const health = getHealthStatus(log.category, log.value);
           return (
            <div key={log._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: "15px", borderRadius: "10px", borderLeft: `6px solid ${health.color}`, boxShadow: "0 2px 4px rgba(0,0,0,0.03)" }}>
              <div>
                <span style={{ fontSize: "0.85rem", color: "#718096" }}>{new Date(log.date).toLocaleDateString()}</span>
                <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#2D3748", marginTop: "4px" }}>{log.value}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                 <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "12px", background: `${health.color}15`, fontSize: "0.85rem", fontWeight: "bold", color: health.color }}>
                    {health.status}
                 </span>
              </div>
            </div>
           );
        })}
        {logs.filter(l => l.category === activeTab).length === 0 && (
            <p style={{textAlign: "center", color: "#a0aec0", marginTop: "20px"}}>No history found for this category.</p>
        )}
      </div>

      {/* ==========================================
          ⭐ CENTERED MODAL OVERLAY
      ========================================== */}
      {isModalOpen && (
        <div style={{
           position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
           background: "rgba(0,0,0,0.6)", zIndex: 9999,
           display: "flex", justifyContent: "center", alignItems: "center",
           backdropFilter: "blur(4px)" // Nice modern touch
        }}>
           <div className="fade-in" style={{
              background: "white", padding: "30px", borderRadius: "16px",
              width: "90%", maxWidth: "420px", 
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              position: "relative"
           }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={24} color="#718096" />
              </button>

              <div style={{ textAlign: "center", marginBottom: "25px" }}>
                 <div style={{ background: "#FEFCBF", width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 15px" }}>
                    <Activity color="#D69E2E" size={30} />
                 </div>
                 <h2 style={{ margin: "0 0 5px", color: "#2D3748" }}>Log Vitals</h2>
                 <p style={{ color: "#718096", fontSize: "0.95rem", margin: 0 }}>Record your latest health metrics</p>
              </div>

              <form onSubmit={handleLogVital}>
                 <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#4A5568" }}>Category</label>
                 <select 
                   value={newLog.category}
                   onChange={(e) => setNewLog({ ...newLog, category: e.target.value })}
                   style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0", marginBottom: "20px", fontSize: "1rem", outline: "none" }}
                 >
                    <option>Blood Pressure</option>
                    <option>Heart Rate</option>
                    <option>Blood Sugar</option>
                    <option>Weight</option>
                    <option>Temperature</option>
                 </select>

                 <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#4A5568" }}>
                    Value {newLog.category === "Blood Pressure" ? "(e.g., 120/80)" : ""}
                 </label>
                 <input 
                   type="text" 
                   value={newLog.value}
                   onChange={(e) => setNewLog({ ...newLog, value: e.target.value })}
                   placeholder={newLog.category === "Blood Pressure" ? "120/80" : "Enter value..."}
                   style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0", marginBottom: "25px", fontSize: "1rem", outline: "none" }}
                   required
                 />

                 <button 
                   type="submit"
                   style={{ width: "100%", padding: "14px", background: "#8B5E3C", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", transition: "background 0.2s" }}
                   onMouseOver={(e) => e.target.style.background = "#6B462C"}
                   onMouseOut={(e) => e.target.style.background = "#8B5E3C"}
                 >
                   Save Reading
                 </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default Analytics;