import React from "react";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import CalendarView from "../components/CalendarView";

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      <AnalyticsDashboard />
      <CalendarView />
    </div>
  );
}

export default AdminDashboard;
