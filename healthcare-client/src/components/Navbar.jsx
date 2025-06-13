import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

function Navbar() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Healthcare System
        </Link>
        <div className="space-x-4">
          {!token ? (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          ) : (
            <>
              {user?.role === "patient" && (
                <Link to="/patient" className="hover:underline">
                  Patient Dashboard
                </Link>
              )}
              {user?.role === "doctor" && (
                <Link to="/doctor" className="hover:underline">
                  Doctor Dashboard
                </Link>
              )}
              {user?.role === "admin" && (
                <Link to="/admin" className="hover:underline">
                  Admin Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
