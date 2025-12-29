const router = require("express").Router();
const Appointment = require("../models/Appointment");
const Medicine = require("../models/Medicine");
const Report = require("../models/Report");     
const History = require("../models/History");

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // 1. Fetch data from all sources in parallel
    const [appointments, medicines, reports, histories] = await Promise.all([
      Appointment.find({ userId }),
      Medicine.find({ userId }),    
      Report.find({ userId }),
      History.find({ userId })
    ]);

    const timelineEvents = [];

    // Process Appointments
    appointments.forEach(appt => {
      timelineEvents.push({
        _id: appt._id,
        type: "appointment",
        title: `Visited ${appt.doctorName} (${appt.specialty})`,
        description: `Routine checkup at ${appt.location || "Clinic"}`,
        date: appt.date, 
        icon: "calendar"
      });
    });

    // Process History
    histories.forEach(hist => {
      timelineEvents.push({
        _id: hist._id,
        type: "history",
        title: hist.title,
        description: hist.description,
        date: hist.date,
        icon: "history"
      });
    });

    // Process Medicines 
    medicines.forEach(med => {
      timelineEvents.push({
        _id: med._id,
        type: "medicine",
        title: `Started new medicine: ${med.name}`,
        description: `${med.dosage || "Prescribed dosage"} - ${med.frequency || "Daily"}`,
        date: med.createdAt ? med.createdAt.toISOString().split('T')[0] : "2025-01-01", 
        icon: "pill"
      });
    });

    // Process Reports
    reports.forEach(rep => {
      timelineEvents.push({
        _id: rep._id,
        type: "report",
        title: `Uploaded Report: ${rep.title || "Medical Document"}`,
        description: "Lab results/medical file uploaded.",
        date: rep.uploadedAt ? rep.uploadedAt.toISOString().split('T')[0] : "2025-01-01",
        icon: "file"
      });
    });

    // 3. Sort by Date (Newest First)
    timelineEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json(timelineEvents);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch timeline" });
  }
});

module.exports = router;