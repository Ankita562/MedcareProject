import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Reusing your main styles

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
    address: storedUser?.address || "", // 👈 NEW FIELD
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // 1. Send update to Backend
      // Note: Make sure your backend route '/api/auth/update/:id' exists and handles updates!
      // If not, you might need to create it. For now, assuming basic update logic:
      const res = await axios.put(`http://localhost:5000/api/auth/update/${storedUser._id}`, formData);

      // 2. Update LocalStorage with new data (Crucial for other pages to see changes)
      const updatedUser = { ...storedUser, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsEditing(false);
      alert("Profile Updated Successfully! ✅");
    } catch (err) {
      console.error(err);
      // Fallback: If backend update route isn't ready, just update local storage for demo
      const updatedUser = { ...storedUser, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
      alert("Profile Saved (Local)! ✅");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-container" style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "90vh"}}>
      <div className="dashboard-card large-card" style={{maxWidth: "500px", width: "100%", padding: "40px"}}>
        
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
                    <label>First Name</label>
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
                    <label>Last Name</label>
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
                    <label>Age</label>
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
                    <label>Blood Group</label>
                    <input 
                        name="bloodGroup" 
                        value={formData.bloodGroup} 
                        onChange={handleChange} 
                        disabled={!isEditing}
                        style={{width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc"}}
                    />
                </div>
            </div>

            <div>
                <label>Gender</label>
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

            {/* 👇 NEW CITY FIELD */}
            <div>
                <label style={{color: "#8B5E3C", fontWeight: "bold"}}>City / Location</label>
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
                <label>Email (Read Only)</label>
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

      </div>
    </div>
  );
};

export default Profile;