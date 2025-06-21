const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Doctor ID is required"],
    unique: true,
  },
  defaultHours: {
    start: {
      type: String,
      default: "09:00",
      match: [/^\d{2}:\d{2}$/, "Start time must be in HH:mm format"],
    },
    end: {
      type: String,
      default: "15:00",
      match: [/^\d{2}:\d{2}$/, "End time must be in HH:mm format"],
    },
  },
  unavailableSlots: [
    {
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
    },
  ],
});

module.exports = mongoose.model("Availability", availabilitySchema);