/* -------------------------------
   THEME VARIABLES
--------------------------------*/
// src/components/Navbar.jsx
// src/components/Navbar.jsx
// src/components/Navbar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

// Icons
import {
  Home,
  Calendar,
  BarChart3,
  History,
  FileChartColumn,
  Users,
  Plus,
  MessageCircle,
  User,
  LogOut,
  Moon,
  Sun,
  Baby,          // 👶 Age Group icon
} from "lucide-react";

const Navbar = ({
  onLogout,
  isLoggedIn,
  darkMode,
  setDarkMode,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [ageDropdown, setAgeDropdown] = useState(false); // 👶 age menu toggle

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

  return (
    <div className={`sidebar ${open ? "open" : "closed"}`}>
      {/* Sidebar Toggle */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {open ? "←" : "→"}
      </button>

      {/* Brand */}
      <div className="sidebar-brand" onClick={() => navigate("/")}>
        MedCare <span style={{ color: "#c8925c" }}>+</span>
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
        <NavItem to="/chatbot" icon={<MessageCircle />} text="Chatbot" open={open} />

        {/* 👶 AGE GROUP MAIN ITEM */}
        <div className="tooltip-wrapper">
          <button
            className="age-btn"
            onClick={() => setAgeDropdown(!ageDropdown)}
          >
            <Baby className="icon" />
            {open && <span>Age Groups</span>}
          </button>

          {!open && <div className="tooltip">Age Groups</div>}
        </div>

        {/* 👶 DROPDOWN OPTIONS */}
        {ageDropdown && (
          <div className="age-dropdown">
            <NavItem to="/age/2-5" text="2 - 5 Years" open={open} />
            <NavItem to="/age/6-19" text="6 - 19 Years" open={open} />
            <NavItem to="/age/20-50" text="20 - 50 Years" open={open} />
            <NavItem to="/age/50plus" text="50+ Years" open={open} />
          </div>
        )}

      </div>

      {/* BOTTOM SECTION */}
      <div className="sidebar-bottom">

        {/* Dark Mode Button */}
        <button className="mode-btn" onClick={toggleMode}>
          {darkMode ? <Sun className="icon" /> : <Moon className="icon" />}
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* USER BOX */}
        <div className="user-box">
          {isLoggedIn ? (
            <>
              <NavItem to="/profile" icon={<User />} text="Profile" open={open} />

              <button className="logout-btn" onClick={handleLogout}>
                <LogOut className="icon" />
                <span>Logout</span>
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
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "active" : "")}
    >
      {icon && <span className="icon">{icon}</span>}
      <span>{text}</span>
    </NavLink>

    {!open && <div className="tooltip">{text}</div>}
  </div>
);

export default Navbar;
