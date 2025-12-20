import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// import "./MedicalHistory.css"; // Comment this out if you don't have this file

const MedicalHistory = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({
    condition: "",
    diagnosisDate: "",
    treatment: "",
    doctor: "",
    status: "Ongoing"
  });

  // 1. Fetch Data from Backend
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/history/${user._id}`);
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    fetchHistory();
  }, [user?._id]);

  // 2. Handle Input Change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 3. Submit New Record
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return toast.error("Please login first");

    try {
      const res = await axios.post("http://localhost:5000/api/history/add", {
        userId: user._id,
        ...form
      });
      setHistory([...history, res.data]); // Update UI instantly
      setForm({ condition: "", diagnosisDate: "", treatment: "", doctor: "", status: "Ongoing" }); // Reset Form
      toast.success("Record Added! 📜");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add record.");
    }
  };

  // 4. Delete Record
  const handleDelete = async (id) => {
    if(window.confirm("Delete this record?")) {
      try {
        await axios.delete(`http://localhost:5000/api/history/${id}`);
        setHistory(history.filter(item => item._id !== id));
        toast.info("Record Deleted.");
      } catch (err) {
        toast.error("Error deleting.");
      }
    }
  };

  return (
    <div className="dashboard-container" style={{padding: "40px"}}>
      <h2 style={{color: "#8B5E3C", marginBottom: "20px"}}>Medical History 📜</h2>

      {/* ADD FORM SECTION */}
      <div className="dashboard-card" style={{marginBottom: "30px", padding: "20px", background: "#fff", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)"}}>
        <h3 style={{marginBottom: "15px"}}>Add New Condition</h3>
        <form onSubmit={handleSubmit} style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px"}}>
          <input name="condition" placeholder="Condition (e.g. Asthma)" value={form.condition} onChange={handleChange} required style={{padding: "10px", borderRadius: "5px", border: "1px solid #ddd"}} />
          <input name="doctor" placeholder="Doctor Name" value={form.doctor} onChange={handleChange} required style={{padding: "10px", borderRadius: "5px", border: "1px solid #ddd"}} />
          <input name="treatment" placeholder="Treatment / Medication" value={form.treatment} onChange={handleChange} style={{padding: "10px", borderRadius: "5px", border: "1px solid #ddd"}} />
          <input name="diagnosisDate" type="date" value={form.diagnosisDate} onChange={handleChange} required style={{padding: "10px", borderRadius: "5px", border: "1px solid #ddd"}} />
          
          <select name="status" value={form.status} onChange={handleChange} style={{padding: "10px", borderRadius: "5px", border: "1px solid #ddd"}}>
            <option>Ongoing</option>
            <option>Cured</option>
            <option>Managed</option>
          </select>

          <button type="submit" style={{gridColumn: "span 2", padding: "12px", background: "#8B5E3C", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold"}}>
            + Add Record
          </button>
        </form>
      </div>

      {/* HISTORY LIST SECTION */}
      <div className="history-list">
        {history.length === 0 ? (
          <p style={{textAlign: "center", color: "#666"}}>No medical history records found. Add one above!</p>
        ) : (
          history.map((item) => (
            <div key={item._id} className="dashboard-card" style={{marginBottom: "15px", padding: "20px", background: "#fdf6ec", borderRadius: "10px", position: "relative", borderLeft: "5px solid #8B5E3C"}}>
               
               {/* Delete Button */}
               <button onClick={() => handleDelete(item._id)} style={{position: "absolute", top: "15px", right: "15px", background: "none", border: "none", color: "#d32f2f", cursor: "pointer", fontSize: "1.2rem"}}>
                 🗑️
               </button>

               <h3 style={{color: "#333", margin: "0 0 5px 0"}}>{item.condition}</h3>
               <p style={{color: "#666", fontSize: "0.9rem", margin: "0 0 10px 0"}}>
                 📅 Diagnosed: {item.diagnosisDate} &nbsp; | &nbsp; 👨‍⚕️ Dr. {item.doctor}
               </p>
               <p style={{margin: "0 0 10px 0"}}><strong>Treatment:</strong> {item.treatment}</p>
               
               <span style={{
                 background: item.status === "Cured" ? "#E8F5E9" : "#FFF3E0", 
                 color: item.status === "Cured" ? "green" : "orange",
                 padding: "4px 10px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "bold", display: "inline-block"
               }}>
                 {item.status}
               </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;