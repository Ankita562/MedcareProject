import React, { useState, useEffect } from "react";
import axios from "axios";
import Tesseract from 'tesseract.js';
import { toast } from "react-toastify";
import * as pdfjsLib from "pdfjs-dist"; 
import "./Dashboard.css";

// ⭐ USE JSDELIVR (It is faster and fixes the CORS/404 issues)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
const MedicalReports = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [reports, setReports] = useState([]);
  const [isAdding, setIsAdding] = useState(false); 
  const [scanning, setScanning] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("Lab Report");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null); 

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login");

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("title", title);
    formData.append("doctorName", doctorName);
    formData.append("date", date);
    formData.append("type", type);
    formData.append("notes", notes);
    if (file) formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/reports/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setReports([res.data, ...reports]); 
      setIsAdding(false); 
      setTitle(""); setDoctorName(""); setDate(""); setNotes(""); setFile(null);
      toast.success("Report Uploaded Successfully! 📄");
    } catch (err) {
      console.error(err);
      toast.error("Error uploading report");
    }
  };

  // ⭐ HELPER: Convert PDF Page to Image Data URL
  const readPdfText = async (url) => {
    const pdf = await pdfjsLib.getDocument(url).promise;
    let fullText = "";

    // Loop through all pages (Limit to first 3 pages for speed)
    const maxPages = Math.min(pdf.numPages, 3);
    
    for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 }); // Higher scale = better OCR
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        
        // Convert page to image
        const imgUrl = canvas.toDataURL("image/png");
        
        // Scan this page
        const { data: { text } } = await Tesseract.recognize(imgUrl, 'eng');
        fullText += text + " ";
    }
    return fullText;
  };

  // ⭐ MAIN SCAN FUNCTION
  const handleScan = async (reportUrl) => {
    setScanning(true);
    toast.info("Scanning document... Please wait 🕵️");
    
    // Build full URL
    const fullUrl = `http://localhost:5000/${reportUrl}`;
    let extractedText = "";

    try {
      // A. IF PDF: Convert to images first
      if (reportUrl.toLowerCase().endsWith(".pdf")) {
         console.log("Detected PDF. Converting pages...");
         extractedText = await readPdfText(fullUrl);
      } 
      // B. IF IMAGE: Scan directly
      else {
         console.log("Detected Image. Scanning directly...");
         const { data: { text } } = await Tesseract.recognize(fullUrl, 'eng');
         extractedText = text;
      }

      console.log("Final Extracted Text:", extractedText);

      // Send to Backend
      const res = await axios.post("http://localhost:5000/api/activities/add", {
        userId: user._id,
        text: extractedText
      });

      if (res.data.length > 0) {
        toast.success(`Found ${res.data.length} new activities! 🎉`);
      } else {
        toast.info("Scan complete. No specific activities found.");
      }

    } catch (err) {
      console.error(err);
      toast.error("Failed to read document.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
           <h1>📄 Medical Reports</h1>
           <p>Upload and scan your medical documents.</p>
        </div>
        <button className="btn primary" onClick={() => setIsAdding(!isAdding)}>
           {isAdding ? "❌ Cancel" : "➕ Upload Report"}
        </button>
      </div>

      {isAdding && (
        <div className="dashboard-card large-card fade-in" style={{marginBottom: "30px"}}>
           <h3>Upload New Report</h3>
           <form onSubmit={handleSubmit} className="form-box">
              <label>Report Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Blood Test" />
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                 <div><label>Doctor / Lab</label><input value={doctorName} onChange={(e) => setDoctorName(e.target.value)} required /></div>
                 <div><label>Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></div>
              </div>
              <label>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} style={{width: "100%", padding: "10px", border:"1px solid #ccc", borderRadius:"8px"}}>
                 <option>Lab Report</option>
                 <option>Prescription</option>
                 <option>X-Ray / Scan</option>
              </select>
              <label>Attach File (PDF or Image)</label>
              <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files[0])} style={{padding: "10px", background: "#f9f9f9"}} />
              <button type="submit" className="btn primary" style={{marginTop: "15px"}}>💾 Upload Report</button>
           </form>
        </div>
      )}

      <div className="reports-grid" style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px"}}>
         {reports.length === 0 ? <p style={{color: "#666", textAlign: "center"}}>No reports found.</p> : 
            reports.map((report) => (
               <div key={report._id} className="dashboard-card" style={{borderLeft: "5px solid #8B5E3C"}}>
                  <div style={{display: "flex", justifyContent: "space-between"}}>
                     <div>
                        <span style={{background: "#eee", padding: "2px 8px", borderRadius: "10px", fontSize: "0.8rem"}}>{report.type}</span>
                        <h3 style={{margin: "10px 0 5px"}}>{report.title}</h3>
                     </div>
                     <div style={{fontSize: "2rem"}}>📄</div>
                  </div>
                  
                  {report.fileUrl && (
                    <div style={{marginTop: "15px", display: "flex", gap: "10px"}}>
                        <a href={`http://localhost:5000/${report.fileUrl}`} target="_blank" rel="noopener noreferrer" className="btn" style={{flex: 1, textAlign: "center", background: "#333", color: "white", textDecoration: "none", padding: "8px"}}>
                          👁️ View
                        </a>
                        <button onClick={() => handleScan(report.fileUrl)} disabled={scanning} className="btn" style={{flex: 1, background: "#6B46C1", color: "white", border: "none", cursor: "pointer"}}>
                           {scanning ? "..." : "🔍 Scan"}
                        </button>
                    </div>
                  )}
               </div>
            ))
         }
      </div>
    </div>
  );
};

export default MedicalReports;