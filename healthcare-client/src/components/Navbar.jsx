import React from "react";

const Navbar = () => {
  // Mock login state (replace with actual auth logic, e.g., context or redux)
  const isLoggedIn = false;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold">CareConnect Hospital</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="/home"
              className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </a>
            <a
              href="/services"
              className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Services
            </a>
            <a
              href="/doctors"
              className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Doctors
            </a>
            <a
              href="/appointments"
              className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Appointments
            </a>
            <a
              href="/contact"
              className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Contact
            </a>
            {isLoggedIn ? (
              <>
                <a
                  href="/profile"
                  className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Profile
                </a>
                <a
                  href="/logout"
                  className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Logout
                </a>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
