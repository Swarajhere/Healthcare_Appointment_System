const express = require("express");
const {
  getDoctors,
  getAvailability,
  bookAppointment,
  getDoctorAppointments,
} = require("../controllers/appointmentController");
const { verifyToken, restrictTo } = require("../middlewares/auth-middleware");

const router = express.Router();

// Public route to get approved doctors
router.get("/doctors", getDoctors);

// Protected routes
router.get(
  "/doctors/:doctorId/availability",
  verifyToken,
  restrictTo(["user"]),
  getAvailability
);
router.post("/appointments", verifyToken, restrictTo(["user"]), bookAppointment);
router.get(
  "/doctors/:doctorId/appointments",
  verifyToken,
  restrictTo(["doctor"]),
  getDoctorAppointments
);

module.exports = router;