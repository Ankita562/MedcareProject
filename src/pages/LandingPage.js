import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Pill, FileText, User, 
  Clock, Sparkles, ArrowRight, Activity, Bell, Shield, Mail, MapPin
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [completedSteps] = useState([]); // This would ideally be synced with backend data
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });

  const steps = [
    { id: 1, title: "Complete Your Profile", description: "Add personal info and history", icon: User, color: "bg-gradient-0", link: "/profile", time: "2 min" },
    { id: 2, title: "Add Your Medications", description: "Set up reminders", icon: Pill, color: "bg-gradient-1", link: "/medicines/new", time: "3 min" },
    { id: 3, title: "Book Appointment", description: "Schedule a visit", icon: Calendar, color: "bg-gradient-2", link: "/appointments", time: "5 min" },
    { id: 4, title: "Upload Records", description: "Securely store documents", icon: FileText, color: "bg-gradient-3", link: "/reports", time: "4 min" }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Logic to send to medcares832@gmail.com
    console.log("Feedback data:", contactData);
    alert("Thank you! Your feedback has been sent to our team.");
    setContactData({ name: '', email: '', message: '' });
  };

  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <div className="landing-page-container">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="welcome-pill">
            <Sparkles size={16} />
            <span>Welcome to MedCare+</span>
          </div>
          <h2 className="landing-title">Let's Get You Started!</h2>
          <p className="landing-subtitle">Complete your health profile to unlock all features.</p>
        </div>

        {/* Progress Card */}
        <div className="progress-card">
          <div className="progress-header">
            <h3>Your Setup Progress</h3>
            <div className="progress-percentage">{Math.round(progress)}%</div>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="steps-grid">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="step-card">
                <div className="step-content">
                  <div className={`step-icon-wrapper ${step.color}`}>
                    <Icon size={24} color="white" />
                  </div>
                  <div className="step-text">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                </div>
                <div className="step-footer">
                   <span className="step-time"><Clock size={12} /> {step.time}</span>
                   <button className="step-btn" onClick={() => navigate(step.link)}>
                     Start <ArrowRight size={14} />
                   </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded Final CTA */}
        <div className="final-cta-expanded">
          <h2 className="cta-title-large">Ready to Take Control?</h2>
          <p className="cta-description-large">
            Complete your setup today and experience smarter health management. 
            Join our community prioritizing their daily wellness.
          </p>
          <div className="cta-group-large">
            <button className="btn-main-large" onClick={() => navigate('/login')}>Get Started Now</button>
            <button className="btn-alt-large" onClick={() => navigate('/dashboard')}>View Dashboard</button>
          </div>
        </div>

        {/* Contact & Feedback Form */}
        <section className="contact-section" id="feedback">
          <div className="contact-card">
            <div className="contact-info">
              <h3>Get in Touch</h3>
              <p>Have questions or feedback? We'd love to hear from you.</p>
              <div className="contact-details">
                <div className="contact-item">
                  <Mail size={20} /> <span>medcares832@gmail.com</span>
                </div>
                <div className="contact-item">
                  <MapPin size={20} /> <span>Bengaluru, India</span>
                </div>
              </div>
            </div>
            
            <form className="contact-form" onSubmit={handleContactSubmit} style={{display:"flex" ,"flex-direction":"column",gap:"10px"}}>
              <input 
                type="text" placeholder="Your Name" required 
                value={contactData.name}
                onChange={(e) => setContactData({...contactData, name: e.target.value})}
              />
              
              <input 
                type="email" placeholder="Your Email" required 
                value={contactData.email}
                onChange={(e) => setContactData({...contactData, email: e.target.value})}
              />
              <textarea 
                placeholder="How can we help you?" rows="4" required
                value={contactData.message}
                onChange={(e) => setContactData({...contactData, message: e.target.value})}
              ></textarea>
              <button type="submit" className="btn-submit">Send Feedback</button>
            </form>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer-container">
        <div className="footer-content">
          <p>© MedCare — 2025</p>
          <div className="footer-links">
            <span>Contact: </span>
            <a href="mailto:medcares832@gmail.com">medcares832@gmail.com</a>
            <span className="separator">|</span>
            <a href="#feedback">Give Feedback</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;