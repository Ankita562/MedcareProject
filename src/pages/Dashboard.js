// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { fakePatientDetails, fakeMedicines } from "../data/fakeData";
import "./Dashboard.css";

const Dashboard = () => {
  const [patient, setPatient] = useState(fakePatientDetails);
  const [meds, setMeds] = useState([]);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // Fetch medicines
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.medicines.list();
        setMeds(res.data || fakeMedicines);
      } catch (err) {
        console.error("Error loading medicines:", err);
      }
    };
    fetchData();
  }, []);

  // Apply dark mode
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Alerts
  const alerts = [];
  if (patient.age > 60)
    alerts.push("👵 Elderly Mode: Frequent reminders & emergency alerts.");
  alerts.push("⏰ It’s time for your next checkup (last: 2025-08-15)");
  if (meds.some((m) => m.name === "Vitamin D3"))
    alerts.push("⚠️ 1 medicine expiring soon.");

  return (
    <div className="dashboard-page fade-in">
      {/* ================= PATIENT INFO ================= */}
      <section className="section patient-info">
        <div className="patient-card">
          <div className="patient-header">
            <h2>Hello, {patient.name} 👋</h2>
            <p className="subtext">Stay on track with your health today</p>
          </div>
          <div className="patient-details">
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Phone:</strong> {patient.phone}</p>
            <p><strong>Age:</strong> {patient.age}</p>
          </div>
        </div>
      </section>

      {/* ================= ALERTS ================= */}
      <section className="section alerts-section">
        <h2>🚨 Health Alerts</h2>
        <div className="alerts-grid">
          {alerts.map((alert, i) => (
            <div key={i} className="alert-card">
              {alert}
            </div>
          ))}
        </div>
      </section>

      {/* ================= MEDICINE TEMPLATE ================= */}
      <section className="section medicines-section">
        <div className="section-header">
          <h2>💊 My Medicines</h2>
          <Link to="/medicines/new" className="add-btn">
            + Add New
          </Link>
        </div>

        <div className="medicine-template-grid">
          {meds.map((med) => (
            <div key={med.id} className="medicine-template-card">
              <div className="medicine-header">
                <h3>{med.name}</h3>
                <span className="dose">{med.dosage}</span>
              </div>
              <div className="medicine-body">
                <p><strong>Frequency:</strong> {med.frequency}</p>
                <p><strong>Notes:</strong> {med.notes || "None"}</p>
                <p><strong>Duration:</strong> {med.startDate} → {med.endDate}</p>
              </div>
              <div className="medicine-footer">
                <Link to={`/medicines/${med.id}`} className="edit-btn">
                  ✏️ Edit
                </Link>
                <button
                  className="reminder-btn"
                  onClick={() => alert(`Reminder set for ${med.name}`)}
                >
                  ⏰ Set Reminder
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= QUICK ACTIONS ================= */}
      <section className="section quick-actions">
        <h2>⚙️ Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/appointments" className="action-card">📅 Book Appointment</Link>
          <Link to="/scan-report" className="action-card">📄 Scan Report</Link>
          <Link to="/timeline" className="action-card">🕒 View Timeline</Link>
          <Link to="/analytics" className="action-card">📊 Analytics</Link>
          <Link to="/contacts" className="action-card">🚨 Emergency Contacts</Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;



