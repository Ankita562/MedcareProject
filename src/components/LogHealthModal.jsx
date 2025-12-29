import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const LogHealthModal = ({ isOpen, onClose, userId, onSuccess }) => {
  const [category, setCategory] = useState("Blood Pressure");
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sending data to the backend route
      await axios.post("http://localhost:5000/api/analytics/log", {
        userId,
        category,
        value,
        note
      });
      
      setLoading(false);
      onSuccess(); // Tells the parent page to refresh the graph!
      onClose();   // Close the modal
      
      // Reset form
      setValue("");
      setNote("");
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to save log. Make sure backend is running!");
    }
  };

  return (
    <div style={overlayStyle}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={modalStyle}
      >
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
            <h3 style={{color: "#8B5E3C", margin: 0}}>📝 Log Daily Vitals</h3>
            <button onClick={onClose} style={{background: "none", border: "none", fontSize: "20px", cursor: "pointer"}}>✖️</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "15px"}}>
          
          {/* 1. Category Selector */}
          <div>
            <label style={labelStyle}>Vital Type</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              style={inputStyle}
            >
              <option>Blood Pressure</option>
              <option>Blood Sugar</option>
              <option>Heart Rate</option>
              <option>Weight</option>
              <option>Temperature</option>
            </select>
          </div>

          {/* 2. Value Input */}
          <div>
            <label style={labelStyle}>
                Value {category === "Blood Pressure" ? "(e.g. 120/80)" : category === "Blood Sugar" ? "(mg/dL)" : ""}
            </label>
            <input 
              type="text" 
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              placeholder={category === "Blood Pressure" ? "120/80" : "98"}
              style={inputStyle}
            />
          </div>

          {/* 3. Note Input */}
          <div>
            <label style={labelStyle}>Note (Optional)</label>
            <input 
              type="text" 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. After breakfast"
              style={inputStyle}
            />
          </div>

          {/* Buttons */}
          <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
             <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
             <button type="submit" style={saveBtnStyle} disabled={loading}>
               {loading ? "Saving..." : "Save Log"}
             </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

//STYLES 
const overlayStyle = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)", 
  display: "flex", justifyContent: "center", alignItems: "center", 
  zIndex: 1000,
  backdropFilter: "blur(3px)"
};

const modalStyle = {
  backgroundColor: "white", 
  padding: "25px", 
  borderRadius: "15px", 
  width: "90%", 
  maxWidth: "400px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  borderTop: "5px solid #8B5E3C"
};

const labelStyle = {
    display: "block", marginBottom: "5px", fontWeight: "bold", color: "#5D4037", fontSize: "14px"
};

const inputStyle = {
  width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", marginTop: "2px", fontSize: "16px"
};

const saveBtnStyle = {
  flex: 1, padding: "12px", backgroundColor: "#8B5E3C", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold"
};

const cancelBtnStyle = {
  flex: 1, padding: "12px", backgroundColor: "#EFEFEF", color: "#333", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold"
};

export default LogHealthModal;