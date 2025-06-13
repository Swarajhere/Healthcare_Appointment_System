import React from "react";
import CalendarView from "../components/CalendarView";

function DoctorDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
      <CalendarView />
    </div>
  );
}

export default DoctorDashboard;
