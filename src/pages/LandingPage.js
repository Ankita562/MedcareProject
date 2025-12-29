import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Calendar, Pill, FileText, Activity, Bell, 
  CheckCircle, User, Shield, Clock,
  Sparkles, ArrowRight, Play
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    {
      id: 1,
      title: "Complete Your Profile",
      description: "Add your personal information, medical history, and emergency contacts",
      icon: User,
      color: "from-blue-500 to-indigo-600",
      action: "Set Up Profile",
      link: "/profile",
      time: "2 min"
    },
    {
      id: 2,
      title: "Add Your Medications",
      description: "Track your prescriptions and set up medication reminders",
      icon: Pill,
      color: "from-purple-500 to-pink-600",
      action: "Add Medicines",
      link: "/medicines/new",
      time: "3 min"
    },
    {
      id: 3,
      title: "Book Your First Appointment",
      description: "Schedule a visit with your preferred healthcare provider",
      icon: Calendar,
      color: "from-amber-500 to-orange-600",
      action: "Book Appointment",
      link: "/appointments",
      time: "5 min"
    },
    {
      id: 4,
      title: "Upload Medical Records",
      description: "Store your lab reports, prescriptions, and medical documents securely",
      icon: FileText,
      color: "from-green-500 to-emerald-600",
      action: "Upload Reports",
      link: "/reports",
      time: "4 min"
    }
  ];

  const features = [
    { icon: Activity, title: "Health Analytics", description: "Track vitals and get trends" },
    { icon: Bell, title: "Smart Reminders", description: "Never miss a dose" },
    { icon: Shield, title: "Secure & Private", description: "Encrypted health data" },
    { icon: Clock, title: "Health Timeline", description: "Your entire journey" }
  ];

  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <div className="landing-page-container" style={{ background: 'linear-gradient(to bottom right, #fffaf0, #fff5f0, #fff)' }}>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <div className="welcome-pill">
            <Sparkles size={16} />
            <span>Welcome to MedCare+</span>
          </div>
          <h2 className="landing-title">Let's Get You Started!</h2>
          <p className="landing-subtitle">
            Take a few minutes to set up your health profile and unlock all the features MedCare has to offer.
          </p>
        </div>

        {/* Progress Bar Component */}
        <div className="progress-card">
          <div className="progress-header">
            <div>
              <h3>Your Setup Progress</h3>
              <p>{completedSteps.length} of {steps.length} steps completed</p>
            </div>
            <div className="progress-percentage">{Math.round(progress)}%</div>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="steps-grid">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isDone = completedSteps.includes(index);
            return (
              <div key={step.id} className={`step-card ${isDone ? 'completed' : ''}`}>
                <div className="step-content">
                  <div className={`step-icon-wrapper bg-gradient-${index}`}>
                    <Icon size={24} color="white" />
                  </div>
                  <div className="step-text">
                    <h4>{step.title} {isDone && <CheckCircle size={16} color="#48bb78" />}</h4>
                    <p>{step.description}</p>
                  </div>
                </div>
                <div className="step-footer">
                   <span className="step-time"><Clock size={12} /> {step.time}</span>
                   <button 
                    className={`step-btn ${isDone ? 'done' : ''}`}
                    onClick={() => navigate(step.link)}
                   >
                     {isDone ? 'Done' : step.action} <ArrowRight size={14} />
                   </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final CTA */}
        <div className="final-cta">
          <h2>Ready to Take Control?</h2>
          <p>Complete your setup and start your journey to better health.</p>
          <div className="cta-group">
            <button className="btn-main" onClick={() => navigate('/login')}>Get Started Now</button>
            <button className="btn-alt" onClick={() => navigate('/dashboard')}>View Dashboard</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;