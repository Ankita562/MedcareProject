import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./Analytics.css";
import { fakeAnalytics } from "../data/fakeData";

const COLORS = ["#6e8efb", "#a777e3", "#f78fb3"];

const Analytics = () => {
  const { medicineAdherence, missedDoses, totalMedicines, bloodPressureReadings, sugarLevels } =
    fakeAnalytics;

  const adherenceData = [
    { name: "Taken", value: medicineAdherence },
    { name: "Missed", value: 100 - medicineAdherence },
  ];

  return (
    <div className="analytics-page-container">
      <h1>📊 Health Analytics</h1>
      <p className="subtitle">
        Get insights from your health data — trends, reminders, and predictions.
      </p>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card adherence">
          <h3>Medicine Adherence</h3>
          <p>{medicineAdherence}%</p>
        </div>
        <div className="summary-card total-meds">
          <h3>Total Medicines</h3>
          <p>{totalMedicines}</p>
        </div>
        <div className="summary-card missed">
          <h3>Missed Doses</h3>
          <p>{missedDoses}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container">
        {/* Blood Pressure */}
        <div className="chart-box">
          <h2>🩺 Blood Pressure Trends (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bloodPressureReadings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="systolic" stroke="#6e8efb" strokeWidth={2} />
              <Line type="monotone" dataKey="diastolic" stroke="#a777e3" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sugar Levels */}
        <div className="chart-box">
          <h2>🍬 Blood Sugar Levels (mg/dL)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sugarLevels}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#f78fb3" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Adherence Pie Chart */}
        <div className="chart-box">
          <h2>💊 Medicine Adherence</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={adherenceData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {adherenceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
