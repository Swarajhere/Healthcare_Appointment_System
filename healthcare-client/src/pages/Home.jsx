import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to Healthcare Appointment System
      </h1>
      <p className="text-gray-600 mb-6">
        Book appointments with ease and manage your healthcare needs.
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default Home;
