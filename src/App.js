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
import LandingPage from "./pages/LandingPage";

// Data
import { fakePatientDetails } from "./data/fakeData";

// Styles
import "./App.css";

// ⭐ INTERNAL LAYOUT COMPONENT
const Layout = ({ children, isLoggedIn, sidebarOpen, navbarProps }) => {
  const location = useLocation();

  const hideSidebarPaths = [
    "/",  // Landing Page
    "/login",
    "/register",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/verify-guardian"
  ];

  const showSidebar = isLoggedIn && !hideSidebarPaths.some(hidePath => {
    if (hidePath === "/") {
      return location.pathname === "/"; 
    }
    return location.pathname.startsWith(hidePath);
  });

  return (
    <>
      {showSidebar && <Navbar {...navbarProps} />}

      <main
        className={`main-content fade-in ${showSidebar ? (sidebarOpen ? "expanded" : "collapsed") : ""}`}
        style={{
          minHeight: "100vh",
          paddingTop: "20px",
          paddingBottom: "0px",
          paddingLeft: "0px",
          paddingRight: "0px"
        }}
      >
        {children}
      </main>

      {showSidebar && <Footer />}
    </>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [patientInfo] = useState(fakePatientDetails);
  
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  const navbarProps = {
    onLogout: handleLogout,
    isLoggedIn: isLoggedIn,
    darkMode: darkMode,
    setDarkMode: setDarkMode,
    setSidebarOpen: setSidebarOpen
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        theme={darkMode ? "dark" : "light"}
      />
      
      <Layout isLoggedIn={isLoggedIn} sidebarOpen={sidebarOpen} navbarProps={navbarProps}>
        <Routes>
          {/* =========================================================
              ⭐ PUBLIC ROUTES (Accessible by everyone)
          ========================================================= */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Auth onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<Auth onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/verify-guardian/:token" element={<VerifyGuardian />} />


          {/* =========================================================
              🔒 PROTECTED ROUTES (Login Required)
          ========================================================= */}
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
          <Route path="/scan-report" element={isLoggedIn ? <ScanReport /> : <Navigate to="/login" />} />

          {/* Fallback - Redirects unknown links to Landing Page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>

    </div>
  );
}

export default App;