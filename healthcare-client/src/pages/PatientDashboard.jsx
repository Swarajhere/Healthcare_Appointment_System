import React from "react";
import AppointmentBooking from "../components/AppointmentBooking";
import CalendarView from "../components/CalendarView";

function PatientDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Patient Dashboard</h1>
      <AppointmentBooking />
      <CalendarView />
    </div>
  );
}

export default PatientDashboard;
