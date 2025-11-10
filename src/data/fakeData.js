// src/data/fakeData.js

// 👤 Patient Details
export const fakePatientDetails = {
  id: "P001",
  name: "Aarav Sharma",
  age: 62,
  gender: "Male",
  contact: "9876543210",
  email: "aarav.sharma@example.com",
  weight: 70,
  allergies: "None",
  emergencyContact: {
    name: "Riya Sharma",
    relation: "Daughter",
    phone: "9123456780"
  },
  conditions: ["Diabetes", "Hypertension"],
  lastCheckup: "2025-08-15"
};

// 💊 Medicines
export const fakeMedicines = [
  {
    id: "M001",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice a day",
    startDate: "2025-09-01",
    endDate: "2025-12-01",
    notes: "Take after meals",
    expiryDate: "2025-12-10",
    reminders: [
      { id: "R1", time: "08:00 AM", days: ["Mon", "Wed", "Fri"] },
      { id: "R2", time: "08:00 PM", days: ["Tue", "Thu", "Sat"] }
    ]
  },
  {
    id: "M002",
    name: "Amlodipine",
    dosage: "10mg",
    frequency: "Once a day",
    startDate: "2025-08-10",
    endDate: "2026-02-10",
    notes: "Monitor blood pressure weekly",
    expiryDate: "2026-03-01",
    reminders: [{ id: "R3", time: "09:00 AM", days: ["Daily"] }]
  },
  {
    id: "M003",
    name: "Vitamin D3",
    dosage: "1000 IU",
    frequency: "Once a day",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    notes: "Take with breakfast",
    expiryDate: "2025-11-15",
    reminders: [{ id: "R4", time: "07:00 AM", days: ["Daily"] }]
  }
];

// 🩺 Medical History
export const fakeHistory = [
  {
    id: "H001",
    title: "Diabetes Checkup",
    date: "2025-06-10",
    notes: "HbA1c levels slightly elevated. Advised dietary changes."
  },
  {
    id: "H002",
    title: "Annual Physical",
    date: "2025-03-02",
    notes: "All vitals normal. Recommended moderate exercise."
  },
  {
    id: "H003",
    title: "Blood Pressure Monitoring",
    date: "2024-12-15",
    notes: "BP stable, continue medication as prescribed."
  }
];

// 📄 Medical Reports
export const fakeReports = [
  {
    id: "R001",
    title: "Blood Test Report",
    url: "https://via.placeholder.com/250x150.png?text=Blood+Report",
    uploadedAt: "2025-07-12"
  },
  {
    id: "R002",
    title: "X-Ray Chest",
    url: "https://via.placeholder.com/250x150.png?text=X-Ray+Chest",
    uploadedAt: "2025-06-25"
  }
];

// ☎️ Emergency Contacts
export const fakeContacts = [
  {
    id: "C001",
    name: "Riya Sharma",
    relation: "Daughter",
    phone: "9123456780"
  },
  {
    id: "C002",
    name: "Dr. Sameer Patel",
    relation: "Family Doctor",
    phone: "9876501234"
  }
];

// 📅 Reminders
export const fakeReminders = [
  {
    id: "RM001",
    medicine: "Metformin",
    time: "08:00 AM",
    repeat: "Daily",
    alertType: "Popup"
  },
  {
    id: "RM002",
    medicine: "Amlodipine",
    time: "09:00 AM",
    repeat: "Daily",
    alertType: "Popup"
  }
];

// 📊 Analytics Data (for charts)
export const fakeAnalytics = {
  medicineAdherence: 88, // %
  missedDoses: 4,
  totalMedicines: 3,
  bloodPressureReadings: [
    { date: "2025-09-01", systolic: 125, diastolic: 80 },
    { date: "2025-09-10", systolic: 130, diastolic: 85 },
    { date: "2025-09-20", systolic: 128, diastolic: 82 },
    { date: "2025-10-01", systolic: 135, diastolic: 88 }
  ],
  sugarLevels: [
    { date: "2025-09-01", value: 120 },
    { date: "2025-09-10", value: 135 },
    { date: "2025-09-20", value: 140 },
    { date: "2025-10-01", value: 125 }
  ]
};
// ============================
// 🕒 FAKE TIMELINE DATA
// ============================
export const fakeTimeline = [
  {
    id: "T001",
    date: "2025-11-08",
    title: "Visited Dr. Mehta (Cardiologist)",
    description: "Routine checkup — blood pressure under control, no medication changes.",
    type: "appointment",
  },
  {
    id: "T002",
    date: "2025-11-01",
    title: "Uploaded Blood Test Report",
    description: "Lipid levels slightly elevated — advised diet modification.",
    type: "report",
  },
  {
    id: "T003",
    date: "2025-10-28",
    title: "Added new medicine: Atorvastatin",
    description: "10mg once daily after dinner.",
    type: "medicine",
  },
  {
    id: "T004",
    date: "2025-09-15",
    title: "Diabetes Checkup",
    description: "HbA1c test done. Levels improved since last quarter.",
    type: "appointment",
  },
  {
    id: "T005",
    date: "2025-08-20",
    title: "Emergency Contact Updated",
    description: "Added Riya Sharma as primary contact.",
    type: "update",
  },
];

