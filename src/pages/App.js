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
import Profile from "./pages/Profile";
import Activities from "./pages/Activities";
// Data
import { fakePatientDetails } from "./data/fakeData";

// Styles
import "./App.css";

<Route path="/profile" element={<Profile />} />

function App() {
  // ---------------- STATE ----------------
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [patientInfo] = useState(fakePatientDetails);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const [sidebarOpen, setSidebarOpen] = useState(true); // 👉 Sidebar State

  const navigate = useNavigate();

  // ---------------- EFFECTS ----------------

  // Load login state once
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  // Save login state
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);


  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // ---------------- RENDER ----------------
  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      
      {/* ===== Sidebar Navbar ===== */}
      <Navbar
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setSidebarOpen={setSidebarOpen}     
      />

      {/* ===== Main Content (auto-shifts) ===== */}
      <main
        style={{
          padding: "22px",
          minHeight: "80vh",
          overflowX: "hidden",
          marginLeft: sidebarOpen ? "240px" : "70px", 
          transition: "margin-left 0.3s ease",
        }}
      >
        <Routes>
          {/* Default redirect */}
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

          {/* Auth pages */}
          {/* PREVENT LOGGED-IN USERS FROM SEEING LOGIN PAGE */}
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <Auth onLogin={() => setIsLoggedIn(true)} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/register"
          element={
            !isLoggedIn ? (
              <Auth onLogin={() => setIsLoggedIn(true)} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

          {/* Patient Details */}
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

          {/* Appointment step */}
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

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? <Dashboard patient={patientInfo} /> : <Navigate to="/login" replace />
            }
          />

          {/* Medicine pages */}
          <Route
            path="/medicines/new"
            element={isLoggedIn ? <AddEditMedicine /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/medicines/:id"
            element={isLoggedIn ? <AddEditMedicine /> : <Navigate to="/login" replace />}
          />

          {/* Appointment */}
          <Route
            path="/appointments"
            element={isLoggedIn ? <DoctorAppointment /> : <Navigate to="/login" replace />}
          />

          {/* Medical history & reports */}
          <Route
            path="/medical-history"
            element={isLoggedIn ? <MedicalHistory /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/reports"
            element={isLoggedIn ? <MedicalReports /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/scan-report"
            element={isLoggedIn ? <ScanReport /> : <Navigate to="/login" replace />}
          />

          {/* Analytics */}
          <Route
            path="/analytics"
            element={isLoggedIn ? <Analytics /> : <Navigate to="/login" replace />}
          />

          {/* Contacts */}
          <Route
            path="/contacts"
            element={isLoggedIn ? <EmergencyContacts /> : <Navigate to="/login" replace />}
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/activities" element={isLoggedIn ? <Activities /> : <Navigate to="/login" />} />
        </Routes>
      </main>

      {/* ===== Footer ===== */}
      <Footer />
    </div>
  );
}

export default App;

