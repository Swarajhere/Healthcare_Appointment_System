const User = require("../models/userModel");
const Appointment = require("../models/appointmentModel");
const Availability = require("../models/availabilityModel");
const { generateSlots } = require("../utils/generateSlots");
const { addDays, format, parse, isBefore, addMinutes } = require("date-fns");

exports.getDoctors = async (req, res) => {
  try {
    const { specialty, search } = req.query;
    const query = { role: "doctor", status: "approved", isActive: true };

    if (specialty) query.specialty = specialty;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    const doctors = await User.find(query).select(
      "_id firstName lastName specialty"
    );

    res.status(200).json({
      success: true,
      doctors: doctors.map((doc) => ({
        id: doc._id.toString(),
        firstName: doc.firstName,
        lastName: doc.lastName,
        specialty: doc.specialty,
      })),
    });
  } catch (error) {
    console.error("Error in getDoctors:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch doctors",
    });
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD",
      });
    }

    const doctor = await User.findOne({
      _id: doctorId,
      role: "doctor",
      status: "approved",
      isActive: true,
    });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found or not approved",
      });
    }

    const availability = await Availability.findOne({ doctorId });
    const { start, end } = availability?.defaultHours || {
      start: "09:00",
      end: "15:00",
    };
    const unavailableSlots = availability?.unavailableSlots
      .filter((slot) => slot.date === date)
      .map((slot) => slot.time) || [];

    const bookedAppointments = await Appointment.find({
      doctorId,
      date,
      status: "confirmed",
    });
    const bookedSlots = bookedAppointments.map((appt) => appt.time);

    const slots = generateSlots(start, end, bookedSlots, unavailableSlots);

    res.status(200).json({
      success: true,
      slots,
    });
  } catch (error) {
    console.error("Error in getAvailability:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch availability",
    });
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, date, time } = req.body;

    if (!date.match(/^\d{4}-\d{2}-\d{2}$/) || !time.match(/^\d{2}:\d{2}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date or time format",
      });
    }

    const doctor = await User.findOne({
      _id: doctorId,
      role: "doctor",
      status: "approved",
      isActive: true,
    });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found or not approved",
      });
    }

    const patient = await User.findOne({ _id: patientId, role: "user" });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Check if the slot is in the past (current time: June 21, 2025, 14:04 IST)
    const currentTime = new Date("2025-06-21T14:04:00+05:30");
    const slotDateTime = parse(
      `${date} ${time}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );
    if (
      date === format(currentTime, "yyyy-MM-dd") &&
      isBefore(slotDateTime, addMinutes(currentTime, 15))
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot book a slot that has already passed",
      });
    }

    const existingAppointment = await Appointment.findOne({
      patientId,
      doctorId,
      date,
      status: "confirmed",
    });
    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "You already have an appointment booked on this date",
      });
    }

    const slotBooked = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: "confirmed",
    });
    if (slotBooked) {
      return res.status(400).json({
        success: false,
        message: "This slot is already booked",
      });
    }

    const availability = await Availability.findOne({ doctorId });
    const { start, end } = availability?.defaultHours || {
      start: "09:00",
      end: "15:00",
    };
    const unavailableSlots = availability?.unavailableSlots
      .filter((slot) => slot.date === date)
      .map((slot) => slot.time) || [];
    if (time < start || time >= end || unavailableSlots.includes(time)) {
      return res.status(400).json({
        success: false,
        message: "This slot is unavailable",
      });
    }

    const appointment = new Appointment({
      doctorId,
      patientId,
      date,
      time,
      status: "confirmed",
    });
    await appointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment: {
        id: appointment._id.toString(),
        doctorId: appointment.doctorId.toString(),
        patientId: appointment.patientId.toString(),
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
      },
    });
  } catch (error) {
    console.error("Error in bookAppointment:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to book appointment",
    });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await User.findOne({
      _id: doctorId,
      role: "doctor",
      status: "approved",
      isActive: true,
    });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found or not approved",
      });
    }

    const appointments = await Appointment.find({
      doctorId,
      status: "confirmed",
    })
      .populate("patientId", "firstName lastName")
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      appointments: appointments.map((appt) => ({
        id: appt._id.toString(),
        date: appt.date,
        time: appt.time,
        patientName: `${appt.patientId.firstName} ${appt.patientId.lastName}`,
        status: appt.status,
      })),
    });
  } catch (error) {
    console.error("Error in getDoctorAppointments:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch appointments",
    });
  }
};