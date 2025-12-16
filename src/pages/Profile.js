import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios"; // 👈 IMPORT AXIOS
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // SAFE initial user shape
  const userTemplate = {
    _id: "",
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    email: "",
    bloodGroup: "", // 👈 Added Blood Group
    password: "",
    photo: "",
  };

  const [user, setUser] = useState(userTemplate);
  const [backup, setBackup] = useState(null);

  /* =====================================================
        SAFE USER LOADING
  ====================================================== */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) {
        navigate("/");
        return;
      }
      const parsed = JSON.parse(stored);
      // Merge with template to ensure all fields exist
      const fixedUser = { ...userTemplate, ...parsed };
      setUser(fixedUser);
    } catch (err) {
      console.error("Invalid user data:", err);
      navigate("/");
    }
  }, [navigate]);

  /* =====================================================
        FORM HANDLERS
  ====================================================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUser((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
    e.target.value = ""; 
  };

  /* =====================================================
        EDIT / SAVE / CANCEL
  ====================================================== */
  const startEditing = () => {
    setBackup({ ...user }); 
    setIsEditing(true);
  };

  // 👇 UPGRADED SAVE FUNCTION
  const handleSave = async () => {
    if (!user.firstName || !user.lastName || !user.email) {
      alert("First name, last name & email are required.");
      return;
    }

    try {
      // 1. Send Update to Database
      const res = await axios.put(`http://localhost:5000/api/users/${user._id}`, user);

      // 2. Update Browser Memory (for Dashboard)
      localStorage.setItem("user", JSON.stringify(res.data));
      
      setUser(res.data);
      setIsEditing(false);
      alert("Profile Updated Successfully! ✅");

    } catch (err) {
      console.error(err);
      alert("Failed to update profile. Is Backend running?");
    }
  };

  const handleCancel = () => {
    if (backup) setUser({ ...backup });
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  /* =====================================================
        UI RENDER
  ====================================================== */
  return (
    <motion.div className="profile-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="profile-card" initial={{ y: 40 }} animate={{ y: 0 }}>
        <h2 className="title">My Profile</h2>

        {/* PHOTO */}
        <div className="profile-photo-section">
          <motion.div className="photo-wrapper" whileHover={{ scale: 1.05 }}>
            <img src={user.photo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt="Profile" className="profile-photo" />
            {isEditing && (
              <>
                <label htmlFor="photo" className="photo-overlay">Change Photo</label>
                <input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} className="file-input" />
              </>
            )}
          </motion.div>
        </div>

        {/* INFO FORM */}
        <AnimatePresence mode="wait">
          <motion.div key={isEditing ? "edit" : "view"} className={`profile-info ${isEditing ? "editing" : ""}`}>
            
            <div className="row-group">
              <label>First Name <input type="text" name="firstName" value={user.firstName} onChange={handleChange} disabled={!isEditing} /></label>
              <label>Last Name <input type="text" name="lastName" value={user.lastName} onChange={handleChange} disabled={!isEditing} /></label>
            </div>

            <div className="row-group">
                <label>Age <input type="number" name="age" value={user.age} onChange={handleChange} disabled={!isEditing} placeholder="25" /></label>
                <label>Blood Group <input type="text" name="bloodGroup" value={user.bloodGroup} onChange={handleChange} disabled={!isEditing} placeholder="O+" /></label>
            </div>

            <label>Gender 
              <select name="gender" value={user.gender} onChange={handleChange} disabled={!isEditing}>
                <option value="">Select Gender</option>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </label>

            <label>Email <input type="email" name="email" value={user.email} disabled style={{ background: "#eee" }} /></label>

          </motion.div>
        </AnimatePresence>

        {/* BUTTONS */}
        <div className="profile-buttons">
          {!isEditing ? (
            <>
              <button className="edit-btn" onClick={startEditing}>Edit Profile</button>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            </>
          )}
        </div>
      </motion.div>

      <motion.button className="back-btn" onClick={() => navigate("/dashboard")}>⬅ Back to Dashboard</motion.button>
    </motion.div>
  );
};

export default Profile;