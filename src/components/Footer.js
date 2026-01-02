import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>© MedCare — 2025</p>
        <div className="footer-links">
          <span>Contact us at: </span>
          <a href="mailto:medcares832@gmail.com" className="footer-email">
            medcares832@gmail.com
          </a>
          <span className="separator">|</span>
          <a href="mailto:medcares832@gmail.com?subject=Feedback" className="footer-feedback">
            Give Feedback
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;