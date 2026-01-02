import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Phone, User, Trash2, Heart, ShieldAlert } from "lucide-react";
import "./EmergencyContacts.css";

const EmergencyContacts = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [contacts, setContacts] = useState([]);
  
  // Form State
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");

  // 1. Fetch Contacts
  useEffect(() => {
    const fetchContacts = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`https://medcare-api-vw0f.onrender.com/api/contacts/${user._id}`);
        setContacts(res.data);
      } catch (err) {
        console.error("Error fetching contacts", err);
      }
    };
    fetchContacts();
  }, [user?._id]);

  // 2. Add Contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Strict Check before sending
    if (!name) return toast.warning("Name is required!");
    if (phone.length !== 10) return toast.warning("Phone number must be exactly 10 digits!");

    try {
      // ✅ FIX: URL changed from ".../add" to just ".../contacts"
      const res = await axios.post("https://medcare-api-vw0f.onrender.com/api/contacts", {
        userId: user._id,
        name,
        relation,
        phone
      });
      setContacts([...contacts, res.data]);
      
      // Reset Form
      setName("");
      setRelation("");
      setPhone("");
      toast.success("Contact added successfully! 📞");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add contact. Please try again.");
    }
  };

  // 3. Delete Contact
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this contact?")) {
      try {
        await axios.delete(`https://medcare-api-vw0f.onrender.com/api/contacts/${id}`);
        setContacts(contacts.filter(c => c._id !== id));
        toast.info("Contact removed.");
      } catch (err) {
        toast.error("Error removing contact.");
      }
    }
  };

  return (
    <div className="contacts-page">
      <div className="contacts-container">
        
        {/* Header Section */}
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
           <ShieldAlert size={40} color="#8B5E3C" style={{marginBottom: '10px'}}/>
           <h2 className="contacts-title">Emergency Contacts</h2>
           <p className="contacts-subtitle">Keep your loved ones close for emergencies.</p>
        </div>

        {/* Input Form Card */}
        <div className="contact-form">
          <h3><Heart size={18} fill="#8B5E3C" style={{marginRight: '8px'}} /> Add New Contact</h3>
          <form onSubmit={handleSubmit}>
            
            <div className="input-group">
              <label>Full Name</label>
              <input 
                placeholder="e.g. Dr. Alya or Mom" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Relation</label>
              <input 
                placeholder="e.g. Cardiologist / Mother" 
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Phone Number (10 Digits)</label>
              <input 
                type="tel"
                placeholder="9876543210" 
                value={phone}
                onChange={(e) => {
                   // ⭐ Strict Validation: Only allow numbers
                   const val = e.target.value.replace(/\D/g, "");
                   if (val.length <= 10) setPhone(val);
                }}
                required
                pattern="\d{10}"
                title="Please enter exactly 10 digits"
              />
            </div>

            <button type="submit" className="btn-add">
              + Save Contact
            </button>
          </form>
        </div>

        {/* Contacts Grid Display */}
        <div className="contacts-list">
          <h3>My Trusted Contacts ({contacts.length})</h3>
          
          {contacts.length === 0 ? (
            <div className="empty-text">
               <p>No contacts added yet.</p>
            </div>
          ) : (
            <div className="contact-grid">
              {contacts.map((contact) => (
                <div key={contact._id} className="contact-card">
                  {/* Avatar Icon */}
                  <div className="contact-icon">
                    <User />
                  </div>

                  {/* Contact Details */}
                  <div className="contact-info">
                    <h4>{contact.name}</h4>
                    <p className="relation">{contact.relation || "Emergency Contact"}</p>
                    <div className="divider"></div>
                    <a href={`tel:${contact.phone}`} className="phone" style={{textDecoration: 'none'}}>
                      <Phone size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                      {contact.phone}
                    </a>
                  </div>

                  {/* Delete Button */}
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(contact._id)}
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EmergencyContacts;