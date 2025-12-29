import React, { useState } from "react";
import { Search, MapPin, ExternalLink, Star, User } from "lucide-react";

// 1. DUMMY DATA (You can add more later)
const ALL_DOCTORS = [
  { id: 1, name: "Dr. Rohan Mehta", specialty: "Cardiologist", loc: "Bangalore", exp: "12 years", rating: 4.8 },
  { id: 2, name: "Dr. Anjali Rao", specialty: "Dentist", loc: "Bangalore", exp: "5 years", rating: 4.5 },
  { id: 3, name: "Dr. S. K. Gupta", specialty: "General Physician", loc: "Delhi", exp: "20 years", rating: 4.9 },
  { id: 4, name: "Dr. Priya Sharma", specialty: "Gynecologist", loc: "Mumbai", exp: "8 years", rating: 4.7 },
  { id: 5, name: "Dr. Vikram Singh", specialty: "Orthopedist", loc: "Bangalore", exp: "15 years", rating: 4.6 },
  { id: 6, name: "Dr. Neha Kapoor", specialty: "Dermatologist", loc: "Bangalore", exp: "6 years", rating: 4.4 },
];

const DoctorSearch = () => {
  const [specialty, setSpecialty] = useState("Cardiologist");
  const [city, setCity] = useState("Bangalore");
  const [filteredDocs, setFilteredDocs] = useState(
    ALL_DOCTORS.filter(doc => doc.specialty === "Cardiologist" && doc.loc === "Bangalore")
  );

  // 2. HANDLE SEARCH
  const handleSearch = () => {
    // A. Filter Local Data
    const results = ALL_DOCTORS.filter((doc) => 
      doc.specialty.toLowerCase() === specialty.toLowerCase() &&
      doc.loc.toLowerCase() === city.toLowerCase()
    );
    setFilteredDocs(results);
  };

  // 3. HANDLE EXTERNAL SEARCH (The "Real" Search)
  const openExternalSearch = (platform) => {
    let url = "";
    if (platform === "Google") {
      // Creates a smart Google Maps search URL
      url = `https://www.google.com/maps/search/Top+rated+${specialty}+in+${city}`;
    } else if (platform === "Apollo") {
      // Creates an Apollo 24/7 search URL
      url = `https://www.apollo247.com/doctors/doctors-in-${city.toLowerCase()}-${specialty.toLowerCase().replace(/ /g, '-')}`;
    }
    window.open(url, "_blank");
  };

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
      
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <h2 style={{ color: "#2d3748", marginBottom: "10px" }}>👨‍⚕️ Find Doctors</h2>
        <p style={{ color: "#718096" }}>Search doctors by name, specialty, or location.</p>
      </div>

      {/* SEARCH BAR */}
      <div style={{ 
        display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", 
        background: "#f7fafc", padding: "15px", borderRadius: "10px", border: "1px solid #edf2f7" 
      }}>
        
        {/* Specialty Select */}
        <div style={{ position: "relative" }}>
          <select 
            value={specialty} 
            onChange={(e) => setSpecialty(e.target.value)}
            style={{ padding: "10px 15px", borderRadius: "8px", border: "1px solid #cbd5e0", minWidth: "200px", appearance: "none" }}
          >
            <option>Cardiologist</option>
            <option>Dentist</option>
            <option>General Physician</option>
            <option>Dermatologist</option>
            <option>Gynecologist</option>
            <option>Orthopedist</option>
            <option>Pediatrician</option>
          </select>
          <div style={{ position: "absolute", right: "10px", top: "12px", pointerEvents: "none" }}>🔽</div>
        </div>

        {/* City Input */}
        <div style={{ position: "relative" }}>
           <MapPin size={18} style={{ position: "absolute", left: "10px", top: "12px", color: "#a0aec0" }} />
           <input 
             type="text" 
             value={city}
             onChange={(e) => setCity(e.target.value)}
             placeholder="City (e.g. Bangalore)"
             style={{ padding: "10px 10px 10px 35px", borderRadius: "8px", border: "1px solid #cbd5e0", width: "180px" }}
           />
        </div>

        <button 
          onClick={handleSearch}
          style={{ background: "#8B5E3C", color: "white", padding: "10px 25px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}
        >
          Search
        </button>
      </div>

      {/* RESULTS SECTION */}
      <div style={{ marginTop: "30px" }}>
        <h3 style={{ color: "#8B5E3C" }}>🌟 Top Doctors in {city}</h3>
        
        {/* EXTERNAL LINKS (Use these if no local data found) */}
        <div style={{ display: "flex", gap: "10px", margin: "15px 0" }}>
           <button onClick={() => openExternalSearch("Google")} style={extBtnStyle("blue")}>
              🌐 View on Google Maps
           </button>
           <button onClick={() => openExternalSearch("Apollo")} style={extBtnStyle("orange")}>
              💊 View on Apollo 24/7
           </button>
        </div>

        {/* LOCAL LIST GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", marginTop: "20px" }}>
           {filteredDocs.length > 0 ? (
             filteredDocs.map(doc => (
               <div key={doc.id} className="fade-in" style={{ border: "1px solid #eee", borderRadius: "10px", padding: "20px", background: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                     <div style={{ background: "#ebf8ff", padding: "10px", borderRadius: "50%", color: "#3182ce" }}><User size={24} /></div>
                     <div>
                       <h4 style={{ margin: 0, color: "#2d3748" }}>{doc.name}</h4>
                       <span style={{ fontSize: "0.85rem", color: "#718096" }}>{doc.specialty}</span>
                     </div>
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#4a5568", lineHeight: "1.6" }}>
                    <p><strong>Experience:</strong> {doc.exp}</p>
                    <p><strong>Location:</strong> {doc.loc}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#d69e2e", marginTop: "5px" }}>
                       <Star size={16} fill="#d69e2e" /> <strong>{doc.rating}</strong>
                    </div>
                  </div>
                  <button style={{ width: "100%", marginTop: "15px", padding: "8px", background: "#8B5E3C", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                     📅 Book Appointment
                  </button>
               </div>
             ))
           ) : (
             <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px", background: "#fff5f5", borderRadius: "8px", color: "#c53030" }}>
                <p>No doctors found in our local database for <strong>{specialty}</strong> in <strong>{city}</strong>.</p>
                <p style={{ fontSize: "0.9rem", marginTop: "5px" }}>Try clicking the "View on Google Maps" button above!</p>
             </div>
           )}
        </div>
      </div>

    </div>
  );
};

// Helper style for external buttons
const extBtnStyle = (color) => ({
  flex: 1,
  padding: "10px",
  border: `1px solid ${color === "blue" ? "#4299e1" : "#ed8936"}`,
  background: color === "blue" ? "#ebf8ff" : "#fffaf0",
  color: color === "blue" ? "#2b6cb0" : "#c05621",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  fontWeight: "600"
});

export default DoctorSearch;