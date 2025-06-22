import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import BookAppointment from "./pages/BookAppointment";
import DoctorRegister from "./pages/DoctorRegister";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import AppointmentConfirmed from "./components/AppointmentConfirmed";
import VerifyOtpAndReset from "./pages/VerifyOtpAndReset";
import ErrorBoundary from "./components/ErrorBoundary";
import MyAppointments from "./pages/MyAppointments";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./redux/slice/authSlice";

function ProtectedRoute({ children, requiredRole }) {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/home" replace />;
  }
  return children;
}

function Logout() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(logout());
  }, [dispatch]);
  return <Navigate to="/login" replace />;
}

function App() {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const showNavbar = !["/login", "/register", "/doctor-register"].includes(
    location.pathname
  );

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <ErrorBoundary>
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/reset-password"
              element={
                <ProtectedRoute>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp-reset" element={<VerifyOtpAndReset />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctor-register" element={<DoctorRegister />} />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-appointments"
              element={
                <ProtectedRoute>
                  <MyAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-appointment"
              element={
                <ProtectedRoute>
                  <BookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointment-confirmed"
              element={
                <ProtectedRoute>
                  <AppointmentConfirmed />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<Profile userId={user?.id} />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </ErrorBoundary>
      {showNavbar && <Footer />}
    </div>
  );
}

export default App;
