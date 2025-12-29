import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom"; 

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
import VerifyEmail from "./pages/VerifyEmail";
import VerifyGuardian from "./pages/VerifyGuardian";
import Activities from "./pages/Activities";
// Data
import { fakePatientDetails } from "./data/fakeData";

// Styles
import "./App.css";

// ⭐ INTERNAL LAYOUT COMPONENT
// This handles the "Show/Hide Sidebar" logic based on the URL
const Layout = ({ children, isLoggedIn, sidebarOpen, navbarProps }) => {
  const location = useLocation();

  // Define paths where the Sidebar/Navbar should NEVER appear
  const hideSidebarPaths = [
    "/login",
    "/register",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/verify-guardian"
  ];

  // Show sidebar ONLY if logged in AND we are NOT on a hidden path
  const showSidebar = isLoggedIn && !hideSidebarPaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      {/* 1. Navbar (Only if showSidebar is true) */}
      {showSidebar && <Navbar {...navbarProps} />}

      {/* 2. Main Content Wrapper */}
      <main
        className={`main-content fade-in ${showSidebar ? (sidebarOpen ? "expanded" : "collapsed") : ""}`}
        style={{
          minHeight: "100vh",
          paddingTop: showSidebar ? "80px" : "0px", 
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingBottom: "20px",
          transition: "margin-left 0.3s ease"
        }}
      >
        {children}
      </main>

      {/* 3. Footer (Only if showSidebar is true) */}
      {showSidebar && <Footer />}
    </>
  );
};

function App() {
  // State
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [patientInfo] = useState(fakePatientDetails);
  
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // Sidebar State
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Effects
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  // Props object to pass to the Layout -> Navbar
  const navbarProps = {
    onLogout: handleLogout,
    isLoggedIn: isLoggedIn,
    darkMode: darkMode,
    setDarkMode: setDarkMode,
    setSidebarOpen: setSidebarOpen
  };

  // ⭐ NO <Router> TAG HERE (It's already in index.js)
  return (
    <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        theme={darkMode ? "dark" : "light"}
      />
      
      {/* WRAP ROUTES IN OUR SMART LAYOUT */}
      <Layout isLoggedIn={isLoggedIn} sidebarOpen={sidebarOpen} navbarProps={navbarProps}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Auth onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<Auth onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />

          <Route
            path="/dashboard"
            element={isLoggedIn ? <Dashboard patient={patientInfo} darkMode={darkMode} /> : <Navigate to="/login" />}
          />

          <Route path="/details" element={isLoggedIn ? <PatientDetailsForm onSubmit={() => setDetailsSubmitted(true)} /> : <Navigate to="/login" />} />
          <Route path="/next-step" element={detailsSubmitted ? <AppointmentChoice /> : <Navigate to="/details" />} />
          <Route path="/activities" element={isLoggedIn ? <Activities /> : <Navigate to="/login" />} />
          <Route path="/timeline" element={isLoggedIn ? <ViewTimeline /> : <Navigate to="/login" />} />
          <Route path="/analytics" element={isLoggedIn ? <Analytics /> : <Navigate to="/login" />} />
          <Route path="/medical-history" element={isLoggedIn ? <MedicalHistory /> : <Navigate to="/login" />} />
          <Route path="/reports" element={isLoggedIn ? <MedicalReports /> : <Navigate to="/login" />} />
          <Route path="/contacts" element={isLoggedIn ? <EmergencyContacts /> : <Navigate to="/login" />} />
          <Route path="/doctors" element={isLoggedIn ? <FindDoctors /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/appointments" element={isLoggedIn ? <DoctorAppointment /> : <Navigate to="/login" />} />
          <Route path="/medicines/new" element={isLoggedIn ? <AddEditMedicine /> : <Navigate to="/login" />} />
          <Route path="/medicines/:id" element={isLoggedIn ? <AddEditMedicine /> : <Navigate to="/login" />} />
          <Route path="/verify-guardian/:token" element={<VerifyGuardian />} />
          <Route path="/scan-report" element={isLoggedIn ? <ScanReport /> : <Navigate to="/login" />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>

    </div>
  );
}

export default App;