import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; 

const AddEditMedicine = () => {
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    time: "", // Changed 'frequency' to 'time' to match your Backend Model
    notes: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Get User ID from LocalStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first!");
      navigate("/");
      return;
    }

    try {
      // 2. Send to Backend
      await axios.post("http://localhost:5000/api/medicines/add", {
        userId: user._id, // LINK TO USER
        name: form.name,
        dosage: form.dosage,
        time: form.time,
        // We can add 'notes' to the backend model later if you want!
      });

      alert("Medicine added successfully! 💊");
      navigate("/dashboard"); // Go back to dashboard
      
    } catch (err) {
      console.error(err);
      alert("Error adding medicine. Check console.");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Add New Medicine</h2>
      <form onSubmit={handleSubmit} className="form-box">
        
        <label>Medicine Name</label>
        <input
          name="name"
          placeholder="e.g. Paracetamol"
          value={form.name}
          onChange={handleChange}
          required
        />
        
        <label>Dosage</label>
        <input
          name="dosage"
          placeholder="e.g. 500mg"
          value={form.dosage}
          onChange={handleChange}
          required
        />
        
        <label>Time to Take</label>
        <input
          name="time"
          type="time" // Special time picker input
          value={form.time}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn primary" style={{marginTop: '20px'}}>
          💾 Save Medicine
        </button>

        <button 
          type="button" 
          className="btn" 
          style={{marginTop: '10px', background: '#ccc'}}
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddEditMedicine;