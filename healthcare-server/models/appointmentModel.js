const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Doctor ID is required"],
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Patient ID is required"],
  },
  date: {
    type: String,
    required: [true, "Date is required"],
    match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
  },
  time: {
    type: String,
    required: [true, "Time is required"],
    match: [/^\d{2}:\d{2}$/, "Time must be in HH:mm format"],
  },
  status: {
    type: String,
    enum: ["confirmed", "pending", "cancelled"],
    default: "confirmed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);