import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const AddReminderModal = ({ isOpen, onClose, userId, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [datetime, setDatetime] = useState("");
  const [frequency, setFrequency] = useState("once");
  const [selectedDays, setSelectedDays] = useState([]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!isOpen) return null;

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/reminders/add", {
        userId, title, datetime, frequency, selectedDays
      });
      onSuccess();
      onClose();
      // Reset Form
      setTitle(""); setDatetime(""); setFrequency("once"); setSelectedDays([]);
    } catch (err) {
      alert("Error saving reminder");
    }
  };

  return (
    <div style={overlayStyle}>
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={modalStyle}>
        <div style={{display: "flex", justifyContent: "space-between", marginBottom: "15px"}}>
           <h3 style={{margin:0, color: "#8B5E3C"}}>⏰ Set Reminder</h3>
           <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", fontSize:"1.2rem"}}>✖️</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* TITLE */}
          <label style={labelStyle}>Reminder Title</label>
          <input type="text" placeholder="Take medicine..." value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />

          {/* TIME */}
          <label style={labelStyle}>Time & Date</label>
          <input type="datetime-local" value={datetime} onChange={e => setDatetime(e.target.value)} required style={inputStyle} />

          {/* FREQUENCY */}
          <label style={labelStyle}>Repeat</label>
          <select value={frequency} onChange={e => setFrequency(e.target.value)} style={inputStyle}>
             <option value="once">Once</option>
             <option value="daily">Daily</option>
             <option value="weekly">Weekly</option>
             <option value="custom">Custom Days</option>
          </select>

          {/* CUSTOM DAYS SELECTOR */}
          {frequency === "custom" && (
            <div style={{display: "flex", gap: "5px", marginTop: "10px", justifyContent: "center"}}>
               {daysOfWeek.map(day => (
                 <button 
                   key={day} 
                   type="button" 
                   onClick={() => toggleDay(day)}
                   style={{
                     padding: "5px 8px", borderRadius: "50%", border: "1px solid #8B5E3C",
                     backgroundColor: selectedDays.includes(day) ? "#8B5E3C" : "white",
                     color: selectedDays.includes(day) ? "white" : "#8B5E3C",
                     cursor: "pointer", fontSize: "0.8rem"
                   }}
                 >
                   {day[0]}
                 </button>
               ))}
            </div>
          )}

          <button type="submit" style={btnStyle}>Save Reminder</button>
        </form>
      </motion.div>
    </div>
  );
};

// Styles
const overlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalStyle = { background: "white", padding: "25px", borderRadius: "15px", width: "350px", borderTop: "5px solid #8B5E3C" };
const labelStyle = { display:"block", marginBottom:"5px", marginTop:"10px", fontWeight:"bold", fontSize:"0.9rem", color:"#555" };
const inputStyle = { width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", boxSizing:"border-box" };
const btnStyle = { width: "100%", padding: "12px", background: "#8B5E3C", color: "white", border: "none", borderRadius: "5px", marginTop: "20px", cursor: "pointer", fontWeight:"bold" };

export default AddReminderModal;