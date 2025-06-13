import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold">HealthCare System</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/home" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </a>
            <a href="/services" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Services
            </a>
            <a href="/doctors" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Doctors
            </a>
            <a href="/appointments" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Appointments
            </a>
            <a href="/contact" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Contact
            </a>
            <a
              href="/login"
              className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;