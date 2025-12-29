import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; 

const Profile = () => {
  const navigate = useNavigate();
  // Load user from local storage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: storedUser?.firstName || "",
    lastName: storedUser?.lastName || "",
    age: storedUser?.age || "",
    bloodGroup: storedUser?.bloodGroup || "",
    gender: storedUser?.gender || "Female",
    email: storedUser?.email || "",
    address: storedUser?.address || "",
    guardianEmail: storedUser?.guardianEmail || "" 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // VALIDATION: Check if Guardian Email is same as User Email
    if (formData.guardianEmail && formData.guardianEmail.toLowerCase() === formData.email.toLowerCase()) {
       alert("⛔ Error: Guardian Email cannot be the same as your own Email.");
       return; 
    }

    try {
      // 1. Send update to Backend
      const res = await axios.put(`http://localhost:5000/api/auth/update/${storedUser._id}`, formData);

      // 2. Update LocalStorage
      localStorage.setItem("user", JSON.stringify(res.data));

      setIsEditing(false);
      alert("Profile Updated Successfully! ✅");
      
      window.location.reload(); 

    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn"); 
    navigate("/login");
  };

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "⚠ Are you sure you want to PERMANENTLY delete your account?\n\nThis action cannot be undone."
    );

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/delete-account/${storedUser._id}`);
        localStorage.clear();
        alert("Your account has been deleted.");
        window.location.href = "/register";
      } catch (err) {
        console.error(err);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <div className="dashboard-container" style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "90vh"}}>
      <div className="dashboard-card large-card" style={{maxWidth: "500px", width: "100%", padding: "40px", background: "white", borderRadius: "15px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)"}}>
        
        {/* AVATAR */}
        <div style={{textAlign: "center", marginBottom: "30px"}}>
            <div style={{
                width: "100px", height: "100px", background: "#d1e7dd", color: "#0f5132",
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "40px", margin: "0 auto 15px", border: "4px solid white",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
            }}>
                {formData.gender === "Female" ? "👩‍🦰" : "👨‍🦱"}
            </div>
            <h2 style={{color: "#8B5E3C"}}>{formData.firstName} {formData.lastName}</h2>
            <p style={{color: "#666"}}>{formData.email}</p>
        </div>

        {/* FORM FIELDS */}
        <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
            
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px"}}>
                <div>
                    <label style={{fontSize:"0.9rem", fontWeight:"bold", color:"#555"}}>First Name</label>
                    <input 
                        className="input-field" 
                        name="firstName" 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        disabled={!isEditing}
                        style={{width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc"}}
                    />
                </div>
                <div>
                    <label style={{fontSize:"0.9rem", fontWeight:"bold", color:"#555"}}>Last Name</label>
                    <input 
                        className="input-field" 
                        name="lastName" 
                        value={formData.lastName} 
                        onChange={handleChange} 
                        disabled={!isEditing}
                        style={{width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc"}}
                    />
                </div>
            </div>

            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px"}}>
                <div>
                    <label style={{fontSize:"0.9rem", fontWeight:"bold", color:"#555"}}>Age</label>
                    <input 
                        type="number"
                        name="age" 
                        value={formData.age} 
                        onChange={handleChange} 
                        disabled={!isEditing}
                        style={{width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc"}}
                    />
                </div>
                <div>
                    <label style={{fontSize:"0.9rem", fontWeight:"bold", color:"#555"}}>Blood Group</label>
                    <input 
                        name="bloodGroup" 
                        value={formData.bloodGroup} 
                        onChange={handleChange} 
                        disabled={!isEditing}
                        style={{width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc"}}
                    />
                </div>
            </div>

            {/* ⭐ NEW: Guardian Email Section with Verification Status */}
            <div style={{background: "#fdf2f2", padding: "15px", borderRadius: "10px", border: "1px solid #f8d7da"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px"}}>
                    <label style={{color: "#c53030", fontWeight: "bold", fontSize:"0.9rem"}}>
                       🛡️ Guardian Email
                    </label>
                    
                    {/* STATUS BADGE */}
                    {storedUser?.guardianEmail && (
                        <span style={{
                            fontSize: "0.75rem", 
                            padding: "4px 8px", 
                            borderRadius: "12px",
                            background: storedUser.isGuardianVerified ? "#C6F6D5" : "#FED7D7",
                            color: storedUser.isGuardianVerified ? "#22543D" : "#822727",
                            fontWeight: "bold",
                            border: storedUser.isGuardianVerified ? "1px solid #9AE6B4" : "1px solid #FEB2B2"
                        }}>
                            {storedUser.isGuardianVerified ? "✅ Verified" : "⏳ Pending"}
                        </span>
                    )}
                </div>
                
                <input 
                    type="email"
                    name="guardianEmail" 
                    value={formData.guardianEmail} 
                    onChange={handleChange} 
                    disabled={!isEditing}
                    placeholder="parent@example.com"
                    style={{width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #f5c6cb"}}
                />
                <p style={{fontSize: "0.8rem", color: "#c53030", marginTop: "5px", fontStyle: "italic"}}>
                   (Required if Age &lt; 18 or &gt; 60)
                </p>
            </div>

            <div>
                <label style={{fontSize:"0.9rem", fontWeight:"bold", color:"#555"}}>Gender</label>
                <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange} 
                    disabled={!isEditing}
                    style={{width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc"}}
                >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                </select>
            </div>

            <div>
                <label style={{color: "#8B5E3C", fontWeight: "bold", fontSize:"0.9rem"}}>City / Location</label>
                <input 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    disabled={!isEditing}
                    placeholder="e.g. Bangalore"
                    style={{width: "100%", padding: "10px", borderRadius: "8px", border: "2px solid #f0e0c8"}}
                />
            </div>

            <div>
                <label style={{fontSize:"0.9rem", fontWeight:"bold", color:"#555"}}>Email (Read Only)</label>
                <input 
                    value={formData.email} 
                    disabled 
                    style={{width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #eee", background: "#f9f9f9", color: "#999"}}
                />
            </div>

        </div>

        {/* BUTTONS */}
        <div style={{marginTop: "30px", display: "flex", gap: "15px"}}>
            {!isEditing ? (
                <button 
                    onClick={() => setIsEditing(true)}
                    style={{flex: 1, padding: "12px", background: "#8B5E3C", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem"}}
                >
                    ✏️ Edit Profile
                </button>
            ) : (
                <button 
                    onClick={handleSave}
                    style={{flex: 1, padding: "12px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem"}}
                >
                    💾 Save Changes
                </button>
            )}

            <button 
                onClick={handleLogout}
                style={{flex: 1, padding: "12px", background: "white", color: "#dc3545", border: "2px solid #dc3545", borderRadius: "8px", cursor: "pointer", fontSize: "1rem"}}
            >
                🚪 Logout
            </button>
        </div>
          
        {/* DELETE ACCOUNT SECTION */}
         <div style={{ marginTop: "40px", borderTop: "1px solid #eee", paddingTop: "20px", textAlign: "center" }}>
            <p style={{ color: "#999", fontSize: "0.9rem", marginBottom: "10px" }}>Danger Zone</p>
            <button 
               onClick={handleDeleteAccount}
               style={{ 
                  padding: "10px 20px", 
                  background: "#ffebee", 
                  color: "#d32f2f", 
                  border: "1px solid #ffcdd2", 
                  borderRadius: "5px", 
                  cursor: "pointer", 
                  fontSize: "0.9rem",
                  fontWeight: "bold"
               }}
            >
               🗑️ Delete Account Permanently
            </button>
         </div>
      </div>
    </div>
  );
};

export default Profile;