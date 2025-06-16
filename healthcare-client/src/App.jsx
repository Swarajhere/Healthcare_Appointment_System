import React from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Home from "./components/Home";
import Landing from "./components/Landing";
import Register from "./components/Register";
import Profile from "./pages/Profile";
import BookAppointment from "./pages/BookAppointment";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./redux/slice/authSlice";

function ProtectedRoute({ children }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function Logout() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(logout());
  }, [dispatch]);
  return <Navigate to="/login" replace />;
}

function App() {
  const userId = "USER_ID_HERE";
  const location = useLocation();

  // Hide Navbar on login and register pages
  const showNavbar = !["/login", "/register"].includes(location.pathname);

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
        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile userId={userId} />
            </ProtectedRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
