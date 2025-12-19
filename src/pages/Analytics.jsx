import React, { useState, useEffect } from "react";
import axios from "axios";
import LogHealthModal from "../components/LogHealthModal"; // 👈 Import the Modal
import HealthCharts from "../components/HealthCharts";     // 👈 Import the Charts
import "./Analytics.css"; 

const Analytics = () => {
  // 1. Get the current user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  
  // 2. State to hold real data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bpLogs, setBpLogs] = useState([]);
  const [sugarLogs, setSugarLogs] = useState([]);
  const [heartLogs, setHeartLogs] = useState([]);
  const [weightLogs, setWeightLogs] = useState([]);
  const [tempLogs, setTempLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. Function to Fetch Data from Backend
  const fetchHealthData = async () => {
    try {
      if (!user) return;
      
      // Call your API
      const res = await axios.get(`http://localhost:5000/api/analytics/${user._id}`);
      const allLogs = res.data;

      // Filter the data into two categories for the charts
      setBpLogs(allLogs.filter(log => log.category === "Blood Pressure"));
      setSugarLogs(allLogs.filter(log => log.category === "Blood Sugar"));
      setHeartLogs(allLogs.filter(log => log.category === "Heart Rate"));
      setWeightLogs(allLogs.filter(log => log.category === "Weight"));
      setTempLogs(allLogs.filter(log => log.category === "Temperature"));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setLoading(false);
    }
  };

  // 4. Run fetch on page load
  useEffect(() => {
    fetchHealthData();
  }, []);

  return (
    <div className="analytics-page-container">
      
      {/* HEADER SECTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h1>📊 Health Analytics</h1>
          <p className="subtitle">Track your vitals with real-time insights.</p>
        </div>
        
        {/* BUTTON TO OPEN MODAL */}
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: "#8B5E3C", color: "white", padding: "12px 24px", 
            border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", 
            display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(139, 94, 60, 0.3)"
          }}
        >
          ➕ Log Vitals
        </button>
      </div>

      {/* SUMMARY CARDS (Calculated from Real Data) */}
      <div className="summary-cards">
        <div className="summary-card total-meds">
           <h3>Total Readings</h3>
           <p>{bpLogs.length + sugarLogs.length}</p>
        </div>
        <div className="summary-card adherence">
           <h3>Avg. Systolic BP</h3>
           <p>
             {bpLogs.length > 0 
               ? Math.round(bpLogs.reduce((acc, curr) => acc + Number(curr.value.split('/')[0]), 0) / bpLogs.length) 
               : "--"}
           </p>
        </div>
        <div className="summary-card missed">
           <h3>Latest Sugar</h3>
           <p>{sugarLogs.length > 0 ? sugarLogs[sugarLogs.length - 1].value + " mg/dL" : "--"}</p>
        </div>
      </div>

      {/* CHARTS COMPONENT */}
      <div className="charts-container">
        {loading ? (
          <p style={{textAlign: "center", padding: "40px"}}>Loading your health data...</p>
        ) : (
          <HealthCharts 
              bpLogs={bpLogs} 
              sugarLogs={sugarLogs} 
              heartLogs={heartLogs}
              weightLogs={weightLogs}
              tempLogs={tempLogs}
           />
        )}
      </div>

      {/* POPUP MODAL */}
      <LogHealthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userId={user?._id}
        onSuccess={fetchHealthData} // 👈 This ensures the graph updates instantly after you save!
      />

    </div>
  );
};

export default Analytics;