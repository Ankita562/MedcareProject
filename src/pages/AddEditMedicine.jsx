import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // 👈 IMPORT ADDED
import "./Dashboard.css"; 

const AddEditMedicine = () => {
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    time: "", 
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
      toast.error("Please login first!");
      navigate("/");
      return;
    }

    try {
      // 2. Send to Backend
      await axios.post("https://medcare-api-vw0f.onrender.com/api/medicines/add", {
        userId: user._id, // LINK TO USER
        name: form.name,
        dosage: form.dosage,
        time: form.time,
        instructions: form.notes, // Sending notes as 'instructions' to match model
      });
      
      // 3. Success Toast
      toast.success("Medicine added successfully! 💊", {
        position: "top-center",
        autoClose: 2000, 
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // 4. Navigate back
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err) {
      console.error(err);
      toast.error("Failed to add medicine. Please try again.");
    }
  };

  return (
    <div className="dashboard-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
      <div className="dashboard-card" style={{padding: '40px', width: '100%', maxWidth: '500px'}}>
        <h2 style={{color: '#8B5E3C', marginBottom: '20px'}}>Add New Medicine</h2>
        
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          
          <div>
            <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Medicine Name</label>
            <input
              name="name"
              placeholder="e.g. Paracetamol"
              value={form.name}
              onChange={handleChange}
              required
              style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc'}}
            />
          </div>
          
          <div>
            <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Dosage</label>
            <input
              name="dosage"
              placeholder="e.g. 500mg"
              value={form.dosage}
              onChange={handleChange}
              required
              style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc'}}
            />
          </div>
          
          <div>
            <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Time to Take</label>
            <input
              name="time"
              type="time" 
              value={form.time}
              onChange={handleChange}
              required
              style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc'}}
            />
          </div>

          <button type="submit" style={{marginTop: '20px', padding: '12px', background: '#8B5E3C', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer'}}>
            💾 Save Medicine
          </button>

          <button 
            type="button" 
            style={{marginTop: '10px', padding: '10px', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer'}}
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditMedicine;