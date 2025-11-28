// src/pages/Dashboard.jsx
import React from "react";
import "./Dashboard.css";
import {
  Calendar,
  Pill,
  FileText,
  Bell,
  User,
  Activity,
} from "lucide-react";

const Dashboard = ({ patient, darkMode }) => {
  return (
    <div className="dashboard-container">
      
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Welcome, {patient.name}</h1>
        <p>Your health overview at a glance</p>
      </div>

      {/* GRID WRAPPER */}
      <div className="dashboard-grid">

        {/* CARD 1 */}
        <div className="dashboard-card">
          <div className="card-icon"><Calendar /></div>
          <h3>Next Appointment</h3>
          <p>{patient.nextAppointment || "No appointment scheduled"}</p>
        </div>

        {/* CARD 2 */}
        <div className="dashboard-card">
          <div className="card-icon"><Pill /></div>
          <h3>Medicines Tracking</h3>
          <p>{patient.medicines?.length || 0} active medicines</p>
        </div>

        {/* CARD 3 */}
        <div className="dashboard-card">
          <div className="card-icon"><FileText /></div>
          <h3>Medical Reports</h3>
          <p>{patient.reports?.length || 0} uploaded reports</p>
        </div>

        {/* CARD 4 */}
        <div className="dashboard-card">
          <div className="card-icon"><Bell /></div>
          <h3>Reminders</h3>
          <p>{patient.reminders?.length || 0} active reminders</p>
        </div>

        {/* CARD 5 */}
        <div className="dashboard-card large-card">
          <div className="card-icon"><User /></div>
          <h3>Patient Details</h3>

          <div className="details-grid">
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
          </div>
        </div>

        {/* CARD 6 – LAST CARD */}
        <div className="dashboard-card large-card">
          <div className="card-icon"><Activity /></div>
          <h3>Health Summary</h3>

          <ul className="summary-list">
            <li>
              <span>Heart Rate:</span> {patient.heartRate || "Normal"}
            </li>
            <li>
              <span>BP:</span> {patient.bp || "Normal"}
            </li>
            <li>
              <span>Sleep:</span> {patient.sleep || "7–8 hrs"}
            </li>
            <li>
              <span>Activity:</span> Good
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
