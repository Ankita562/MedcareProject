import React, { useState, useEffect } from "react";
import "./MedicationTracker.css";

const initialSlots = [
  { time: "Morning", meds: "", dosage: "", timing: "", date: "", notes: "" },
  { time: "Afternoon", meds: "", dosage: "", timing: "", date: "", notes: "" },
  { time: "Evening", meds: "", dosage: "", timing: "", date: "", notes: "" },
  { time: "Night", meds: "", dosage: "", timing: "", date: "", notes: "" },
  { time: "As Needed", meds: "", dosage: "", timing: "", date: "", notes: "" },
];

const MedicationTracker = () => {
  const [rows, setRows] = useState(initialSlots);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("medTracker");
    if (saved) setRows(JSON.parse(saved));
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem("medTracker", JSON.stringify(rows));
  }, [rows]);

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const resetTracker = () => {
    if (window.confirm("Reset all entries?")) setRows(initialSlots);
  };

  return (
    <div className="tracker-page">
      <h1>💊 Medication Tracker</h1>
      <p>Keep track of your daily medicines, dosage, and timing easily.</p>

      <div className="tracker-grid">
        {rows.map((row, i) => (
          <div key={i} className="tracker-card">
            <h3>{row.time}</h3>

            <input
              type="text"
              placeholder="Medication name"
              value={row.meds}
              onChange={(e) => handleChange(i, "meds", e.target.value)}
            />

            <input
              type="text"
              placeholder="Dosage (e.g. 500mg)"
              value={row.dosage}
              onChange={(e) => handleChange(i, "dosage", e.target.value)}
            />

            <input
              type="time"
              value={row.timing}
              onChange={(e) => handleChange(i, "timing", e.target.value)}
            />

            <input
              type="date"
              value={row.date}
              onChange={(e) => handleChange(i, "date", e.target.value)}
            />

            <textarea
              placeholder="Notes (e.g. after meals)"
              value={row.notes}
              onChange={(e) => handleChange(i, "notes", e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="tracker-actions">
        <button className="btn-primary" onClick={resetTracker}>
          🔄 Reset All
        </button>

        <button
          className="btn-secondary"
          onClick={() => window.print()}
        >
          🖨️ Print / Save as PDF
        </button>
      </div>
    </div>
  );
};

export default MedicationTracker;
