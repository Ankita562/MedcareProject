// ✅ src/App.js
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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
import EmergencyContacts from "./pages/EmergencyContacts";
import ScanReport from "./pages/ScanReport";
import MedicalReports from "./pages/MedicalReports";
import ViewTimeline from "./pages/ViewTimeline";
import Analytics from "./pages/Analytics";
import FindDoctors from "./pages/FindDoctors";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Data
import { fakePatientDetails } from "./data/fakeData";

// Styles
import "./App.css";

function App() {
  // State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [patientInfo] = useState(fakePatientDetails);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // ⭐ SIDEBAR STATE
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Effects
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  // ------------------ MAIN RETURN ------------------
  return (
    <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>

      {/* SHOW NAVBAR ONLY WHEN LOGGED IN */}
      {isLoggedIn && (
        <Navbar
          onLogout={handleLogout}
          isLoggedIn={isLoggedIn}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setSidebarOpen={setSidebarOpen}
        />
      )}

     {/* MAIN CONTENT */}
      <main
        // dynamic classes for CSS to handle
        className={`main-content fade-in ${isLoggedIn ? (sidebarOpen ? "expanded" : "collapsed") : ""}`}
        
        style={{
          minHeight: "100vh",
          overflowX: "hidden",
          
          paddingTop: isLoggedIn ? "80px" : "0px",
          
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingBottom: "20px",
        }}
      >
        
        <Routes>
          <Route path="/reset-password/*" element={<ResetPassword />} />
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/login"
            element={<Auth onLogin={() => setIsLoggedIn(true)} />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          

          <Route
            path="/register"
            element={<Auth onLogin={() => setIsLoggedIn(true)} />}
          />

          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
          />

          <Route
            path="/details"
            element={
              isLoggedIn ? (
                <PatientDetailsForm onSubmit={() => setDetailsSubmitted(true)} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/next-step"
            element={
              detailsSubmitted ? <AppointmentChoice /> : <Navigate to="/details" />
            }
          />

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard patient={patientInfo} darkMode={darkMode} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/add-medicine"
            element={isLoggedIn ? <AddEditMedicine /> : <Navigate to="/login" />}
          />
          
          <Route
            path="/medicines/new"
            element={isLoggedIn ? <AddEditMedicine /> : <Navigate to="/login" />}
          />

          <Route
            path="/medicines/:id"
            element={isLoggedIn ? <AddEditMedicine /> : <Navigate to="/login" />}
          />

          <Route
            path="/appointments"
            element={isLoggedIn ? <DoctorAppointment /> : <Navigate to="/login" />}
          />

          <Route
            path="/timeline"
            element={isLoggedIn ? <ViewTimeline /> : <Navigate to="/login" />}
          />

          <Route
            path="/analytics"
            element={isLoggedIn ? <Analytics /> : <Navigate to="/login" />}
          />

          <Route
            path="/medical-history"
            element={isLoggedIn ? <MedicalHistory /> : <Navigate to="/login" />}
          />

          <Route
            path="/reports"
            element={isLoggedIn ? <MedicalReports /> : <Navigate to="/login" />}
          />

          <Route
            path="/scan-report"
            element={isLoggedIn ? <ScanReport /> : <Navigate to="/login" />}
          />

          <Route
            path="/contacts"
            element={isLoggedIn ? <EmergencyContacts /> : <Navigate to="/login" />}
          />

          <Route
            path="/doctors"
            element={isLoggedIn ? <FindDoctors /> : <Navigate to="/login" />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* FOOTER ONLY WHEN LOGGED IN */}
      {isLoggedIn && <Footer />}
    </div>
  );
}

export default App;
