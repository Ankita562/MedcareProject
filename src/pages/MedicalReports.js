import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css"; 

const MedicalReports = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [reports, setReports] = useState([]);
  const [isAdding, setIsAdding] = useState(false); 

  // Form State
  const [title, setTitle] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("Lab Report");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null); // 👈 Store the file

  // 1. FETCH REPORTS
  useEffect(() => {
    const fetchReports = async () => {
      if (user?._id) {
        try {
          const res = await axios.get(`http://localhost:5000/api/reports/${user._id}`);
          setReports(res.data);
        } catch (err) { console.error(err); }
      }
    };
    fetchReports();
  }, [user?._id]);

  // 2. SUBMIT FORM (Using FormData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login");

    // create FormData object to send file + text
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("title", title);
    formData.append("doctorName", doctorName);
    formData.append("date", date);
    formData.append("type", type);
    formData.append("notes", notes);
    if (file) {
      formData.append("file", file); // 👈 Attach file
    }

    try {
      // Must set header for file upload
      const res = await axios.post("http://localhost:5000/api/reports/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setReports([res.data, ...reports]); 
      setIsAdding(false); 
      // Reset Form
      setTitle(""); setDoctorName(""); setDate(""); setNotes(""); setFile(null);
      alert("Report Uploaded Successfully! 📄");
    } catch (err) {
      console.error(err);
      alert("Error uploading report");
    }
  };

  return (
    <div className="dashboard-container">
      
      <div className="dashboard-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
           <h1>📄 Medical Reports</h1>
           <p>Upload and view your medical documents.</p>
        </div>
        <button className="btn primary" onClick={() => setIsAdding(!isAdding)}>
           {isAdding ? "❌ Cancel" : "➕ Upload Report"}
        </button>
      </div>

      {/* === UPLOAD FORM === */}
      {isAdding && (
        <div className="dashboard-card large-card fade-in" style={{marginBottom: "30px"}}>
           <h3>Upload New Report</h3>
           <form onSubmit={handleSubmit} className="form-box">
              <label>Report Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Blood Test" />

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                 <div>
                    <label>Doctor / Lab</label>
                    <input value={doctorName} onChange={(e) => setDoctorName(e.target.value)} required placeholder="Lab Name" />
                 </div>
                 <div>
                    <label>Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                 </div>
              </div>

              <label>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} style={{width: "100%", padding: "10px", border:"1px solid #ccc", borderRadius:"8px"}}>
                 <option>Lab Report</option>
                 <option>Prescription</option>
                 <option>X-Ray / Scan</option>
                 <option>Discharge Summary</option>
              </select>
              
              {/* FILE INPUT */}
              <label>Attach File (PDF or Image)</label>
              <input 
                 type="file" 
                 accept="image/*,application/pdf"
                 onChange={(e) => setFile(e.target.files[0])}
                 style={{padding: "10px", background: "#f9f9f9", borderRadius: "8px"}}
              />

              <label>Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="2" style={{width: "100%", padding:"10px", border:"1px solid #ccc", borderRadius:"8px"}}></textarea>

              <button type="submit" className="btn primary" style={{marginTop: "15px"}}>💾 Upload Report</button>
           </form>
        </div>
      )}

      {/* === REPORTS LIST === */}
      <div className="reports-grid" style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px"}}>
         {reports.length === 0 ? <p style={{color: "#666", textAlign: "center"}}>No reports found.</p> : 
            reports.map((report) => (
               <div key={report._id} className="dashboard-card" style={{borderLeft: "5px solid #8B5E3C"}}>
                  <div style={{display: "flex", justifyContent: "space-between"}}>
                     <div>
                        <span style={{background: "#eee", padding: "2px 8px", borderRadius: "10px", fontSize: "0.8rem"}}>{report.type}</span>
                        <h3 style={{margin: "10px 0 5px"}}>{report.title}</h3>
                        <p style={{color: "#8B5E3C", fontWeight: "bold", fontSize: "0.9rem"}}>📅 {report.date}</p>
                     </div>
                     <div style={{fontSize: "2rem"}}>📄</div>
                  </div>
                  
                  <p style={{fontSize: "0.9rem", color: "#555"}}><strong>Doctor:</strong> {report.doctorName}</p>
                  {report.notes && <p style={{fontSize: "0.85rem", color: "#777", fontStyle: "italic"}}>"{report.notes}"</p>}

                  {/* VIEW BUTTON */}
                  {report.fileUrl && (
                    <a 
                      href={`http://localhost:5000/${report.fileUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn"
                      style={{display: "block", textAlign: "center", marginTop: "15px", background: "#333", color: "white", textDecoration: "none", padding: "8px"}}
                    >
                      👁️ View Document
                    </a>
                  )}
               </div>
            ))
         }
      </div>

    </div>
  );
};

export default MedicalReports;