import React, { useEffect, useState } from "react";
import { Heart, Bell, Clock, LogOut, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slice/authSlice";

const Navbar = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">
              CareConnect
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
            {isLoggedIn ? (
              <>
                <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </button>
                <a
                  href="/profile"
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                </a>
                {user?.role === "user" && (
                  <button
                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                    onClick={() => navigate("/book-appointment")}
                  >
                    Book Appointment
                  </button>
                )}
                <button
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="#services"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Services
                </a>
                <a
                  href="#about"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  About
                </a>
                <a
                  href="#contact"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Contact
                </a>
                <a
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Register
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
