import React from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Home from "./components/Home";
import Landing from "./components/Landing";
import Register from "./components/Register";
import Profile from "./pages/Profile";
import BookAppointment from "./pages/BookAppointment";
import DoctorRegister from "./pages/DoctorRegister";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
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
    <div>
      {showNavbar && <Navbar />}
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
          path="/book-appointment"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<Profile userId={user?.id} />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default App;
