import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Plus, Calendar, FileText } from "lucide-react"; // Icons

const History = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [historyList, setHistoryList] = useState([]);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  // 1. Fetch Data
  const fetchHistory = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`https://medcare-api-vw0f.onrender.com/api/history/${user._id}`);
      setHistoryList(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user?._id]);

  // 2. Add Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://medcare-api-vw0f.onrender.com/api/history/add", {
        userId: user._id,
        title,
        date,
        description
      });
      // Reset & Refresh
      setTitle(""); setDate(""); setDescription(""); setShowForm(false);
      fetchHistory();
    } catch (err) {
      alert("Failed to save record");
    }
  };

  // 3. Delete Data
  const handleDelete = async (id) => {
    if (window.confirm("Delete this record permanently?")) {
      try {
        await axios.delete(`https://medcare-api-vw0f.onrender.com/api/history/${id}`);
        fetchHistory();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ color: "#5D4037", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
           🩺 Medical History
        </h1>
        <p style={{ color: "#888" }}>View your previous diagnoses, treatments, and health notes.</p>
        
        {/* Toggle Form Button */}
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            marginTop: "20px", background: "#8B5E3C", color: "white", border: "none",
            padding: "10px 20px", borderRadius: "30px", cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "1rem"
          }}
        >
          <Plus size={18} /> {showForm ? "Close Form" : "Add New Record"}
        </button>
      </div>

      {/* ADD RECORD FORM (Collapsible) */}
      {showForm && (
        <div style={{ background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px auto" }}>
           <h3 style={{marginTop: 0, color: "#8B5E3C"}}>📝 New Entry</h3>
           <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "15px"}}>
              <input type="text" placeholder="Title (e.g. Annual Physical)" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={inputStyle} />
              <textarea placeholder="Doctor's notes, diagnosis, or prescriptions..." value={description} onChange={e => setDescription(e.target.value)} rows="3" style={{...inputStyle, resize:"vertical"}} />
              <button type="submit" style={btnStyle}>Save Record</button>
           </form>
        </div>
      )}

      {/* HISTORY CARDS GRID */}
      {historyList.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" }}>
          {historyList.map((item) => (
            <div key={item._id} style={{
               background: "white", padding: "25px", borderRadius: "15px",
               boxShadow: "0 4px 10px rgba(0,0,0,0.03)", position: "relative",
               borderTop: "5px solid #EAD8B1"
            }}>
               
               {/* Date Badge */}
               <div style={{
                  position: "absolute", top: "15px", right: "15px",
                  background: "#F5E6CA", color: "#8B5E3C", padding: "5px 10px",
                  borderRadius: "8px", fontSize: "0.85rem", fontWeight: "bold"
               }}>
                  {item.date}
               </div>

               <h3 style={{ margin: "10px 0", color: "#333", display: "flex", alignItems: "center", gap: "8px" }}>
                  {item.title}
               </h3>
               
               <p style={{ color: "#666", lineHeight: "1.5", fontSize: "0.95rem", minHeight: "60px" }}>
                  {item.description || "No details provided."}
               </p>

               {/* Delete Button */}
               <button 
                  onClick={() => handleDelete(item._id)}
                  style={{
                     background: "none", border: "none", color: "#E57373", 
                     cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
                     marginTop: "15px", fontSize: "0.9rem"
                  }}
               >
                  <Trash2 size={16} /> Delete
               </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", color: "#aaa", marginTop: "50px" }}>
           <FileText size={48} style={{ opacity: 0.3, marginBottom: "15px" }} />
           <p>No medical history found. Click "Add New Record" to start.</p>
        </div>
      )}

    </div>
  );
};

// Styles
const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #ddd", width: "100%", boxSizing: "border-box", fontSize: "1rem" };
const btnStyle = { padding: "12px", borderRadius: "8px", border: "none", background: "#8B5E3C", color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" };

export default History;