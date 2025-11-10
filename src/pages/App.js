// src/App.js
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Auth from "./pages/Auth";
import PatientDetailsForm from "./pages/PatientDetailsForm";
import AppointmentChoice from "./pages/AppointmentChoice";
import DoctorAppointment from "./pages/DoctorAppointment";
import Dashboard from "./pages/Dashboard";
import AddEditMedicine from "./pages/AddEditMedicine";
import MedicalHistory from "./pages/MedicalHistory";
import MedicalReports from "./pages/MedicalReports";
import EmergencyContacts from "./pages/EmergencyContacts";
import ScanReport from "./pages/ScanReport";
import Analytics from "./pages/Analytics";

// Data
import { fakePatientDetails } from "./data/fakeData";

// Global Styles
import "./App.css";

function App() {
  // ------------------ STATE ------------------
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [patientInfo, setPatientInfo] = useState(fakePatientDetails);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const navigate = useNavigate();

  // ------------------ EFFECTS ------------------

  // ✅ Load login state on mount
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  // ✅ Persist login state
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  // ✅ Manage dark/light mode
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    document.body.classList.toggle("light", !darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // ------------------ RENDER ------------------
  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <Navbar
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main style={{ padding: "20px", minHeight: "80vh", overflowX: "hidden" }}>
        <Routes>
          {/* 🏠 Default Redirect */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 🔐 Authentication */}
          <Route
            path="/login"
            element={<Auth onLogin={() => setIsLoggedIn(true)} />}
          />
          <Route
            path="/register"
            element={<Auth onLogin={() => setIsLoggedIn(true)} />}
          />

          {/* 👤 Patient Details */}
          <Route
            path="/details"
            element={
              isLoggedIn ? (
                <PatientDetailsForm onSubmit={() => setDetailsSubmitted(true)} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 💬 Appointment Choice */}
          <Route
            path="/next-step"
            element={
              detailsSubmitted ? (
                <AppointmentChoice />
              ) : (
                <Navigate to="/details" replace />
              )
            }
          />

          {/* 🏥 Dashboard */}
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard patient={patientInfo} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 💊 Medicine Management */}
          <Route
            path="/medicines/new"
            element={
              isLoggedIn ? (
                <AddEditMedicine />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/medicines/:id"
            element={
              isLoggedIn ? (
                <AddEditMedicine />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 🩺 Doctor Appointment */}
          <Route
            path="/appointments"
            element={
              isLoggedIn ? (
                <DoctorAppointment />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 🧾 Medical Records */}
          <Route
            path="/medical-history"
            element={
              isLoggedIn ? (
                <MedicalHistory />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/reports"
            element={
              isLoggedIn ? (
                <MedicalReports />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/scan-report"
            element={
              isLoggedIn ? (
                <ScanReport />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 📊 Analytics Page */}
          <Route
            path="/analytics"
            element={
              isLoggedIn ? <Analytics /> : <Navigate to="/login" replace />
            }
          />

          {/* 🚨 Emergency Contacts */}
          <Route
            path="/contacts"
            element={
              isLoggedIn ? (
                <EmergencyContacts />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 🚫 Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
