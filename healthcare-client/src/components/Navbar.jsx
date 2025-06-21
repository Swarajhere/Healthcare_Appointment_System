"use client";

import { useEffect, useState } from "react";
import { Heart, Bell, Clock, LogOut, User, Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slice/authSlice";

const Navbar = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/login", { replace: true });
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">
              CareConnect
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Clock */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>

            {/* Logged in user actions */}
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
              /* Guest navigation links */
              <div className="flex items-center space-x-8">
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
                >
                  Register
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
            <div className="pt-4 space-y-4">
              {/* Mobile Clock */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 px-2">
                <Clock className="h-4 w-4" />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>

              {isLoggedIn ? (
                /* Mobile logged in menu */
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <button className="relative flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                      <Bell className="h-5 w-5" />
                      <span>Notifications</span>
                      <span className="absolute -top-1 left-4 h-3 w-3 bg-red-500 rounded-full"></span>
                    </button>
                  </div>

                  <a
                    href="/profile"
                    className="flex items-center space-x-2 px-2 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </a>

                  {user?.role === "user" && (
                    <button
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      onClick={() => {
                        navigate("/book-appointment");
                        closeMobileMenu();
                      }}
                    >
                      Book Appointment
                    </button>
                  )}

                  <button
                    className="flex items-center space-x-2 px-2 py-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                /* Mobile guest menu */
                <div className="space-y-3">
                  <a
                    href="#services"
                    className="block px-2 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Services
                  </a>
                  <a
                    href="#about"
                    className="block px-2 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    About
                  </a>
                  <a
                    href="#contact"
                    className="block px-2 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Contact
                  </a>
                  <a
                    href="/login"
                    className="block px-2 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    className="block w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
                    onClick={closeMobileMenu}
                  >
                    Register
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
