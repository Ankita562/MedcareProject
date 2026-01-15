import React, { useState, useEffect } from "react";
import axios from "axios"; // 👈 IMPORT AXIOS
import "./ScanReport.css";
import { toast } from "react-toastify"; // Optional: For better alerts

const ScanReport = () => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Get User ID from LocalStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Sync dark/light mode
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    document.body.classList.toggle("light", !darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Handle file input
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  // Handle camera capture
  const handleCameraCapture = (e) => {
    const capturedFile = e.target.files[0];
    if (capturedFile) {
      setFiles((prev) => [...prev, capturedFile]);
    }
  };

  // Drag-and-drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  // ⭐ REAL UPLOAD FUNCTION
  const handleUpload = async () => {
    if (files.length === 0) return alert("Please select a file first.");
    
    setUploading(true);

    try {
      const file = files[0]; // Take the first file
      const formData = new FormData();
      
      // 1. Append the File
      formData.append("file", file);
      
      // 2. Append Required Metadata (Hardcoded for now to make it work instantly)
      formData.append("userId", user?._id || user?.userId); 
      formData.append("title", "Smart Scan Report");
      formData.append("doctorName", "Auto-Detected"); 
      formData.append("date", new Date().toISOString().split('T')[0]); // Today's date
      formData.append("type", "General");
      formData.append("notes", "Uploaded via Smart Scan");

      // 3. Send to the REPORT Route (Not Activity Route!)
      // Ensure this URL matches your backend
      const res = await axios.post("https://medcare-api-vw0f.onrender.com/api/reports/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload Success:", res.data);
      alert("✅ Report Uploaded! Processing for activities...");
      
      setFiles([]);
      
    } catch (err) {
      console.error("Upload Error:", err);
      alert("❌ Upload Failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`scan-report-page ${darkMode ? "dark" : "light"}`}>
      <div className="scan-report-container fade-in">
        <h1>📄 Scan Report Upload</h1>
        <p>Upload your medical report to auto-extract activities (Walk, Yoga, etc.)</p>
        
        <div
          className={`drop-zone ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p>
            {isDragging
              ? "📂 Drop files here"
              : "Drag & drop reports here or click to browse"}
          </p>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileSelect}
          />
        </div>

        {/* Capture from Camera */}
        <div className="camera-section">
          <p className="camera-text">Or capture a report directly using camera:</p>
          <label className="camera-btn">
            📷 Capture with Camera
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
            />
          </label>
        </div>

        {/* File Preview */}
        {files.length > 0 && (
          <div className="file-preview">
            {files.map((file, idx) => (
              <div key={idx} className="file-card">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="preview-img"
                  />
                ) : (
                  <div className="pdf-icon">📕</div>
                )}
                <p className="file-name">{file.name}</p>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "⏳ Analyzing..." : "🚀 Upload & Analyze"}
        </button>

        {/* Mode Toggle */}
        <button
          className="toggle-mode-btn"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </div>
  );
};

export default ScanReport;