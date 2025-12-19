import React from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { format } from "date-fns";

const HealthCharts = ({ bpLogs, sugarLogs, heartLogs, weightLogs }) => {
  
  // Helpers to format data
  const formatData = (logs) => logs.map(log => ({
    date: format(new Date(log.date), "MMM d"),
    value: Number(log.value) || 0
  }));

  const bpData = bpLogs.map(log => {
    const parts = log.value.split("/");
    return {
      date: format(new Date(log.date), "MMM d"),
      systolic: Number(parts[0]) || 0,
      diastolic: Number(parts[1]) || 0,
    };
  });

  const sugarData = formatData(sugarLogs);
  const heartData = formatData(heartLogs);
  const weightData = formatData(weightLogs);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      
      {/* 1. BLOOD PRESSURE */}
      <div className="chart-card" style={cardStyle}>
        <h3 style={{ color: "#8B5E3C" }}>🩺 Blood Pressure</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={bpData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="systolic" stroke="#FF6B6B" name="Systolic" />
            <Line type="monotone" dataKey="diastolic" stroke="#4ECDC4" name="Diastolic" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 2. HEART RATE (New!) */}
      {heartData.length > 0 && (
        <div className="chart-card" style={cardStyle}>
          <h3 style={{ color: "#e74c3c" }}>❤️ Heart Rate (bpm)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={heartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#e74c3c" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 3. WEIGHT (New!) */}
      {weightData.length > 0 && (
        <div className="chart-card" style={cardStyle}>
          <h3 style={{ color: "#2ecc71" }}>⚖️ Weight (kg)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip />
              <Bar dataKey="value" fill="#2ecc71" name="Weight" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 4. BLOOD SUGAR */}
      {sugarData.length > 0 && (
        <div className="chart-card" style={cardStyle}>
          <h3 style={{ color: "#f1c40f" }}>🍬 Blood Sugar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={sugarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#f1c40f" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
};

const cardStyle = {
  backgroundColor: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
};

export default HealthCharts;