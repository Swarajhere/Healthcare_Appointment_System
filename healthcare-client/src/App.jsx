import React from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Home from "./components/Home";
import Landing from "./components/Landing";
import Register from "./components/Register";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "./redux/slice/authSlice";

function Logout() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(logout());
  }, [dispatch]);
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      {/* <main className="container mx-auto p-4"> */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
      {/* </main> */}
    </BrowserRouter>
  );
}

export default App;
