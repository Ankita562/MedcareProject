import React, { useState } from "react";
import "./FindDoctors.css";

const doctorData = [
  {
    id: 1,
    name: "Dr. Rohan Mehta",
    specialty: "Cardiologist",
    location: "Bangalore",
    experience: "12 years",
    contact: "https://www.google.com/search?q=Dr.+Rohan+Mehta+Cardiologist+Bangalore",
  },
  {
    id: 2,
    name: "Dr. Priya Nair",
    specialty: "Dermatologist",
    location: "Mumbai",
    experience: "8 years",
    contact: "https://www.google.com/search?q=Dr.+Priya+Nair+Dermatologist+Mumbai",
  },
  {
    id: 3,
    name: "Dr. Arjun Sharma",
    specialty: "Orthopedic",
    location: "Delhi",
    experience: "15 years",
    contact: "https://www.google.com/search?q=Dr.+Arjun+Sharma+Orthopedic+Delhi",
  },
  {
    id: 4,
    name: "Dr. Kavita Reddy",
    specialty: "Pediatrician",
    location: "Hyderabad",
    experience: "10 years",
    contact: "https://www.google.com/search?q=Dr.+Kavita+Reddy+Pediatrician+Hyderabad",
  },
  {
    id: 5,
    name: "Dr. Manish Gupta",
    specialty: "General Physician",
    location: "Chennai",
    experience: "7 years",
    contact: "https://www.google.com/search?q=Dr.+Manish+Gupta+General+Physician+Chennai",
  },
];

const FindDoctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState(doctorData);

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

  const handleFindOnline = () => {
    window.open("https://www.google.com/search?q=doctors+near+me", "_blank");
  };

  return (
    <div className="find-doctors-page">
      <h1>👨‍⚕️ Find Doctors</h1>
      <p className="subtitle">
        Search doctors by name, specialty, or location.  
        Click “Find Online” to look up real doctors nearby.
      </p>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search for doctors or specialties..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button onClick={handleFindOnline} className="search-btn">
          🌐 Find Online
        </button>
      </div>

      <div className="doctor-list">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <div className="doctor-card" key={doc.id}>
              <h3>{doc.name}</h3>
              <p>
                <strong>Specialty:</strong> {doc.specialty}
              </p>
              <p>
                <strong>Experience:</strong> {doc.experience}
              </p>
              <p>
                <strong>Location:</strong> {doc.location}
              </p>
              <button
                className="contact-btn"
                onClick={() => window.open(doc.contact, "_blank")}
              >
                🔗 View on Google
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">No doctors found. Try another search.</p>
        )}
      </div>
    </div>
  );
};

export default FindDoctors;

