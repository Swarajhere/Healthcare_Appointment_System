const express = require("express");
const {
  getDoctors,
  getAvailability,
  bookAppointment,
  getDoctorAppointments,
  updateDoctorHours,
  getPatientAppointments,
  markAppointmentCompleted
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
router.post(
  "/doctors/:doctorId/availability/hours",
  verifyToken,
  restrictTo(["doctor"]),
  updateDoctorHours
);
router.get(
  "/appointments/patient/:patientId",
  verifyToken,
  restrictTo(["user"]),
  getPatientAppointments
)
router.post(
  "/appointments/complete/:appointmentId",
  verifyToken,
  restrictTo(["doctor"]),
  markAppointmentCompleted
);

module.exports = router;