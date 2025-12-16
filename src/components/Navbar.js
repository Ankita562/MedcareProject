import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

// Icons
import {
  Home, Calendar, BarChart3, History, FileChartColumn,
  Users, Plus, User, LogOut, Moon, Sun,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Navbar = ({
  onLogout, isLoggedIn, darkMode, setDarkMode, setSidebarOpen,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [ageDropdown, setAgeDropdown] = useState(false);

  // Toggle Sidebar
  const toggleSidebar = () => {
    const newState = !open;
    setOpen(newState);
    setSidebarOpen(newState);
  };

  // Toggle Theme
  const toggleMode = () => {
    const newState = !darkMode;
    setDarkMode(newState);
    document.body.classList.toggle("dark-mode", newState);
    document.body.classList.toggle("light-mode", !newState);
    localStorage.setItem("darkMode", newState);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (<div className={`sidebar ${open ? "open" : "closed"}`}>
      
      {/* 1. NEW HEADER CONTAINER */}
      <div className="sidebar-header">
        
        {/* Brand Name - Only shows when Open */}
        {/* We use React conditional rendering here for safety */}
        <div className={`sidebar-brand ${!open && "hidden"}`} onClick={() => navigate("/")}>
          MedCare <span style={{ color: "#c8925c" }}>+</span>
        </div>

        {/* Toggle Button - Always shows */}
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      {/* NAVIGATION */}
      <div className="sidebar-links">
        <NavItem to="/dashboard" icon={<Home />} text="Dashboard" open={open} />
        <NavItem to="/timeline" icon={<Calendar />} text="Timeline" open={open} />
        <NavItem to="/analytics" icon={<BarChart3 />} text="Analytics" open={open} />
        <NavItem to="/medical-history" icon={<History />} text="History" open={open} />
        <NavItem to="/reports" icon={<FileChartColumn />} text="Reports" open={open} />
        <NavItem to="/contacts" icon={<Users />} text="Contacts" open={open} />
        <NavItem to="/doctors" icon={<Plus />} text="Doctors" open={open} />

        {/* Age Dropdown */}
        {ageDropdown && (
          <div className="age-dropdown">
            <NavItem to="/age/2-5" text="2 - 5 Years" open={open} />
            {/* ... other items ... */}
          </div>
        )}
      </div>

      {/* BOTTOM SECTION */}
      <div className="sidebar-bottom">
        {/* Dark Mode Button */}
        <button className="mode-btn" onClick={toggleMode}>
          {darkMode ? <Sun className="icon" /> : <Moon className="icon" />}
          {/* ADDED CLASS HERE */}
          <span className="nav-text">{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* USER BOX */}
        <div className="user-box">
          {isLoggedIn ? (
            <>
              <NavItem to="/profile" icon={<User />} text="Profile" open={open} />
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut className="icon" />
                {/* ADDED CLASS HERE */}
                <span className="nav-text">Logout</span>
              </button>
            </>
          ) : (
            <NavItem to="/login" icon={<User />} text="Login" open={open} />
          )}
        </div>
      </div>
    </div>
  );
};

/* Reusable Nav Item */
const NavItem = ({ to, icon, text, open }) => (
  <div className="tooltip-wrapper">
    <NavLink to={to} className={({ isActive }) => (isActive ? "active" : "")}>
      {icon && <span className="icon">{icon}</span>}
      {/* ADDED CLASS HERE */}
      <span className="nav-text">{text}</span>
    </NavLink>
    {!open && <div className="tooltip">{text}</div>}
  </div>
);

export default Navbar;