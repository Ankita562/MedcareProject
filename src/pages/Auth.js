/* ===============================
   🚨 Health Alerts – Light Mode
   =============================== */
.alerts-section h2 {
  color: var(--accent-color);
  margin-bottom: 1rem;
}

.alerts-grid {
  display: grid;
  gap: 1rem;
}

.alert-card {
  background: #fff0f3; /* light pink base */
  padding: 1rem 1.2rem;
  border-left: 4px solid var(--accent-color);
  border-radius: 10px;
  color: #2b1b1d; /* readable dark text */
  transition: all 0.3s ease;
}

.alert-card:hover {
  transform: translateX(5px);
  box-shadow: 0 6px 14px rgba(255, 107, 107, 0.15);
}

/* ===============================
   🌙 Health Alerts – Dark Mode Fix
   =============================== */
body.dark .alert-card {
  background: #3a1f26; /* deeper muted rose background */
  border-left-color: #ff8a80; /* soft glowing coral */
  color: #ffe9ef; /* readable text on dark bg */
  box-shadow: 0 4px 10px rgba(255, 182, 193, 0.15);
}

body.dark .alert-card:hover {
  background: #4b242e; /* slightly lighter on hover */
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.25);
  transform: translateX(5px);
}
