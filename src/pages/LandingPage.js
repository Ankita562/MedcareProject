import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Pill, FileText, User, 
  Clock, Sparkles, ArrowRight, Activity, Bell, Shield, Mail, MapPin
} from 'lucide-react';
import "./LandingPage.css"; 
const LandingPage = () => {
  const navigate = useNavigate();
  const [completedSteps] = useState([]); // This would ideally be synced with backend data
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });

  const steps = [
    { id: 1, title: "Complete Your Profile", description: "Tell us about yourself and your medical history", icon: User, color: "bg-gradient-0", link: "/profile", time: "2 min" },
    { id: 2, title: "Add Your Medications", description: "List your medicines and get automatic reminders", icon: Pill, color: "bg-gradient-1", link: "/medicines/new", time: "3 min" },
    { id: 3, title: "Book Appointment", description: "Schedule your next doctor visit easily", icon: Calendar, color: "bg-gradient-2", link: "/appointments", time: "5 min" },
    { id: 4, title: "Upload Records", description: "Store prescriptions, reports, and medical documents", icon: FileText, color: "bg-gradient-3", link: "/reports", time: "4 min" }
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
            <Sparkles size={18} />
            <span>Welcome to MedCare+</span>
          </div>
          <h2 className="landing-title">Your Personal Health Companion</h2>
          <p className="landing-subtitle">
            Track medications, manage appointments, store medical records, and take control of your health—all in one simple place.
          </p>
        </div>

        {/* What You Can Do Section */}
        <div className="features-overview">
          <h3 className="features-title">What Can You Do Here?</h3>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon-wrap bg-gradient-0">
                <Bell size={20} color="white" />
              </div>
              <h4>Never Miss a Dose</h4>
              <p>Get timely reminders for your medications and supplements</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrap bg-gradient-1">
                <Calendar size={20} color="white" />
              </div>
              <h4>Easy Appointments</h4>
              <p>Book and manage doctor visits without the hassle</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrap bg-gradient-2">
                <Shield size={20} color="white" />
              </div>
              <h4>Secure Records</h4>
              <p>Keep all your health documents safe and accessible anytime</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrap bg-gradient-3">
                <Activity size={20} color="white" />
              </div>
              <h4>Track Your Health</h4>
              <p>Monitor your wellness journey with easy-to-understand insights</p>
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="getting-started-section">
          <h3 className="section-heading">Quick Start Guide - Just 4 Simple Steps</h3>
          <p className="section-subheading">Set up your account in under 15 minutes</p>
          <div className="steps-grid">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="step-card">
                  <div className="step-number">Step {step.id}</div>
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
                     <span className="step-time"><Clock size={12} /> Takes only {step.time}</span>
                     <button className="step-btn" onClick={() => navigate(step.link)}>
                       Start <ArrowRight size={14} />
                     </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expanded Final CTA */}
        <div className="final-cta-expanded">
          <h2 className="cta-title-large">Ready to Take Control of Your Health?</h2>
          <p className="cta-description-large">
            Join thousands who are managing their health smarter. Whether you're tracking daily medications, 
            organizing medical records, or scheduling appointments, MedCare+ makes it simple and stress-free.
          </p>
          <div className="benefits-quick">
            <div className="benefit-badge">✓ Simple & Easy to Use</div>
            <div className="benefit-badge">✓ Safe & Private</div>
            <div className="benefit-badge">✓ Works on All Devices</div>
          </div>
          <div className="cta-group-large">
            <button className="btn-main-large" onClick={() => navigate('/login')}  >Get Started Now</button>
            <button className="btn-alt-large" onClick={() => navigate('/dashboard')}>View Dashboard</button>
          </div>
        </div>

        {/* Contact & Feedback Form */}
        <section className="contact-section" id="feedback">
          <div className="contact-card">
            <div className="contact-info">
              <h3 style={{color:"#6d4c32"}}>Get in Touch</h3>
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
            
            <form className="contact-form" onSubmit={handleContactSubmit} style={{display:"flex" ,"flexDirection":"column",gap:"10px"}}>
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