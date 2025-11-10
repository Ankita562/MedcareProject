import React from "react";
import "./ViewTimeline.css";
import { fakeTimeline } from "../data/fakeData";

const typeIcons = {
  appointment: "📅",
  report: "📄",
  medicine: "💊",
  update: "⚙️",
};

const ViewTimeline = () => {
  const sortedTimeline = [...fakeTimeline].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="timeline-page-container">
      <h1>🕒 Health Timeline</h1>
      <p className="subtitle">
        Track your medical journey — appointments, reports, and updates in one place.
      </p>

      <div className="timeline-container">
        {sortedTimeline.map((event, index) => (
          <div key={event.id} className="timeline-item">
            <div className="timeline-dot">{typeIcons[event.type] || "📌"}</div>
            <div className="timeline-content">
              <h3>{event.title}</h3>
              <p className="event-desc">{event.description}</p>
              <p className="event-date">
                🗓 {new Date(event.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewTimeline;
