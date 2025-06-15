import React from "react";
import { Heart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slice/authSlice";

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/login");
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
            {isLoggedIn ? (
              <>
                <a
                  href="/profile"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Profile
                </a>
                <a
                  href="/logout"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Logout
                </a>
                <button 
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                  href="/book-appointment"
                  onClick={() => navigate("/book-appointment")}
                >
                  Book Appointment
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;