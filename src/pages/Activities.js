import React, { useEffect, useState } from "react";
import axios from "axios";
import confetti from "canvas-confetti"; 
import { toast } from "react-toastify"; 
import { CheckCircle, Activity as ActivityIcon, Sun, Moon, Award } from "lucide-react";
import "./Dashboard.css"; 

const Activities = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activities, setActivities] = useState({ db: [], system: [] });
  const [completedIds, setCompletedIds] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get(`https://medcare-api-vw0f.onrender.com/api/activities/${user._id}`);
        setActivities(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if(user?._id) fetchActivities();
  }, [user?._id]);

  // ⭐ THE CHEERFUL FUNCTION
  const markAsDone = async (act) => {
    // 1. Trigger Confetti Explosion 🎊
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38A169', '#6B46C1', '#D69E2E']
    });

    // 2. Optimistic UI update (Hide it immediately)
    setCompletedIds(prev => [...prev, act._id]);

    // 3. Show Cheer Message
    toast.success(`🎉 Awesome! marked "${act.title}" as done.`);

    // 4. Call Backend to Save & Notify Guardian
    try {
      const res = await axios.put("https://medcare-api-vw0f.onrender.com/api/activities/complete", {
        userId: user._id,
        title: act.title,
        category: act.category,
        source: act.source
      });
      
      if(res.data.includes("Guardian notified")) {
        toast.info("📧 Guardian has been notified of your progress!");
      }

    } catch (err) {
      console.error(err);
      toast.error("Saved locally, but failed to sync.");
    }
  };

  const allActivities = [...activities.db, ...activities.system].filter(a => !completedIds.includes(a._id) && !a.isCompleted);

  return (
    <div className="dashboard-container" style={{padding: "40px", minHeight: "100vh", background: "#fffaf0"}}>
      <div className="dashboard-header" style={{textAlign: "center", marginBottom: "40px"}}>
        <h1 style={{color: "#2D3748", fontSize: "2.5rem"}}>Your Wellness Plan 🌿</h1>
        <p style={{color: "#718096"}}>Small steps lead to big changes. Let's keep moving!</p>
      </div>

      <div className="dashboard-grid">
        {allActivities.length > 0 ? allActivities.map((act) => (
          <div key={act._id} className="dashboard-card" 
               style={{
                 borderLeft: `6px solid ${act.source === "Doctor" ? "#805AD5" : "#38A169"}`,
                 transform: "scale(1)", transition: "transform 0.2s",
                 boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
               }}
               onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
               onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
                <div>
                    <span style={{
                        fontSize: "0.7rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px",
                        color: act.source === "Doctor" ? "#6B46C1" : "#2F855A",
                        background: act.source === "Doctor" ? "#E9D8FD" : "#C6F6D5",
                        padding: "4px 10px", borderRadius: "12px"
                    }}>
                        {act.source === "Doctor" ? "👨‍⚕️ Doctor's Order" : "🤖 Smart Suggestion"}
                    </span>
                    <h3 style={{margin: "15px 0 8px", color: "#2D3748", fontSize: "1.2rem"}}>{act.title}</h3>
                    <p style={{color: "#718096", fontSize: "0.9rem"}}>{act.category}</p>
                </div>
                {act.category === "Mental Health" ? <Moon size={28} color="#805AD5" /> : 
                 act.category === "Exercise" ? <ActivityIcon size={28} color="#E53E3E" /> : 
                 act.category === "Diet" ? <Award size={28} color="#3182CE" /> :
                 <Sun size={28} color="#D69E2E" />}
            </div>
            
            <button 
              onClick={() => markAsDone(act)}
              style={{
                marginTop: "20px", width: "100%", padding: "12px",
                background: "linear-gradient(to right, #48BB78, #38A169)", 
                border: "none", borderRadius: "10px",
                color: "white", fontWeight: "bold", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                fontSize: "1rem", boxShadow: "0 4px 6px rgba(56, 161, 105, 0.3)"
            }}>
                <CheckCircle size={20} /> I Did This!
            </button>
          </div>
        )) : (
          <div style={{gridColumn: "1 / -1", textAlign: "center", padding: "50px", color: "#A0AEC0"}}>
             <Award size={64} style={{marginBottom: "20px", opacity: 0.5}}/>
             <h2>All caught up!</h2>
             <p>You've completed all your activities. Amazing work! 🌟</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;