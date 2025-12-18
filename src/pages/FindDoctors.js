import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // 👈 Import Link
import "./FindDoctors.css";

// expanded dummy data to test the "Top 5" feature
const doctorData = [
  { id: 1, name: "Dr. Rohan Mehta", specialty: "Cardiologist", location: "Bangalore", experience: "12 years", contact: "https://www.google.com/search?q=Dr.+Rohan+Mehta" },
  { id: 2, name: "Dr. Priya Nair", specialty: "Dermatologist", location: "Mumbai", experience: "8 years", contact: "https://www.google.com/search?q=Dr.+Priya+Nair" },
  { id: 3, name: "Dr. Arjun Sharma", specialty: "Orthopedic", location: "Delhi", experience: "15 years", contact: "https://www.google.com/search?q=Dr.+Arjun+Sharma" },
  { id: 4, name: "Dr. Kavita Reddy", specialty: "Pediatrician", location: "Hyderabad", experience: "10 years", contact: "https://www.google.com/search?q=Dr.+Kavita+Reddy" },
  { id: 5, name: "Dr. Manish Gupta", specialty: "General Physician", location: "Chennai", experience: "7 years", contact: "https://www.google.com/search?q=Dr.+Manish+Gupta" },
  { id: 6, name: "Dr. Anjali Rao", specialty: "Dentist", location: "Bangalore", experience: "5 years", contact: "https://www.google.com/search?q=Dr.+Anjali+Rao" },
  { id: 7, name: "Dr. Vikram Singh", specialty: "Neurologist", location: "Delhi", experience: "20 years", contact: "https://www.google.com/search?q=Dr.+Vikram+Singh" },
];

const FindDoctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState(doctorData);
  const navigate = useNavigate();
  
  // Get User Data
  const user = JSON.parse(localStorage.getItem("user"));
  const userCity = user?.address || ""; // We assume address contains the city

  // 👇 Filter "Top Doctors" based on City
  const recommendedDoctors = userCity 
    ? doctorData.filter(doc => userCity.toLowerCase().includes(doc.location.toLowerCase())).slice(0, 5)
    : [];

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
    const filtered = doctorData.filter(
      (doc) =>
        doc.name.toLowerCase().includes(query) ||
        doc.specialty.toLowerCase().includes(query) ||
        doc.location.toLowerCase().includes(query)
    );
    setFilteredDoctors(filtered);
  };

  const handleBookClick = (doctor) => {
    navigate("/appointments", { 
      state: { prefillDoctor: doctor.name, prefillSpecialty: doctor.specialty } 
    });
  };

  return (
    <div className="find-doctors-page">
      <h1>👨‍⚕️ Find Doctors</h1>
      <p className="subtitle">Search doctors by name, specialty, or location.</p>

      {/* === 1. PROFILE WARNING BANNER === */}
       {!userCity && (
        <div className="profile-warning">
           <span>⚠️ You haven't set your city yet.</span>
           <Link to="/profile" className="complete-link">Complete Profile</Link>
           <span>to see top doctors near you!</span>
        </div>
      )}     

      {/* === 2. TOP DOCTORS SECTION (Only if City exists) === */}
      {userCity && recommendedDoctors.length > 0 && (
        <div className="recommended-section">
            <h3 style={{color: "#8B5E3C", textAlign:"left", marginBottom:"15px"}}>
               🌟 Top Doctors in {userCity}
            </h3>
            <div className="doctor-list" style={{marginBottom: "40px"}}>
               {recommendedDoctors.map(doc => (
                  <DoctorCard key={doc.id} doc={doc} handleBookClick={handleBookClick} />
               ))}
            </div>
            <hr style={{border:"0", borderTop:"1px solid #ddd", marginBottom:"30px"}}/>
        </div>
      )}

      {/* === 3. MAIN SEARCH BAR === */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search for doctors or specialties..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button onClick={() => window.open("https://www.google.com/search?q=doctors+near+me", "_blank")} className="search-btn">
          🌐 Find Near Me on Google
        </button>
      </div>

      {/* === 4. ALL DOCTORS LIST === */}
      <h3 style={{textAlign:"left", marginBottom:"15px", color: "#555"}}>All Doctors</h3>
      <div className="doctor-list">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <DoctorCard key={doc.id} doc={doc} handleBookClick={handleBookClick} />
          ))
        ) : (
          <p className="no-results">No doctors found.</p>
        )}
      </div>
    </div>
  );
};

// Extracted Card Component for cleaner code
const DoctorCard = ({ doc, handleBookClick }) => (
  <div className="doctor-card">
    <h3>{doc.name}</h3>
    <p><strong>Specialty:</strong> {doc.specialty}</p>
    <p><strong>Experience:</strong> {doc.experience}</p>
    <p><strong>Location:</strong> {doc.location}</p>
    <div className="doctor-actions">
      <button className="google-btn" onClick={() => window.open(doc.contact, "_blank")}>
        🌐 View on Google
      </button>
      <button className="manual-btn" onClick={() => handleBookClick(doc)}>
        📅 Add Manually
      </button>
    </div>
  </div>
);

export default FindDoctors;