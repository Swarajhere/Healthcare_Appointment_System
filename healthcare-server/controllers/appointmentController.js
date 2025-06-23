const User = require("../models/userModel");
const Appointment = require("../models/appointmentModel");
const Availability = require("../models/availabilityModel");
const { generateSlots } = require("../utils/generateSlots");
const { addDays, format, parse, isBefore, addMinutes } = require("date-fns");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // Use SendGrid, Amazon SES, etc., for production
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email template function
const createAppointmentEmail = (patientName, doctor, date, time, clinicAddress, receptionNumber) => {
  const formattedDate = format(new Date(date), "EEEE, MMMM d, yyyy");
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; background-color: #007bff; color: white; padding: 15px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Appointment Confirmation</h1>
      </div>
      <div style="padding: 20px;">
        <p style="font-size: 16px; color: #333;">Dear ${patientName},</p>
        <p style="font-size: 16px; color: #333;">
          Your appointment has been successfully booked with <strong>Dr. ${doctor.firstName} ${doctor.lastName}</strong>. Below are the details:
        </p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">Doctor:</td>
            <td style="padding: 10px; border: 1px solid #e0e0e0;">Dr. ${doctor.firstName} ${doctor.lastName} (${doctor.specialty})</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">Date:</td>
            <td style="padding: 10px; border: 1px solid #e0e0e0;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">Time:</td>
            <td style="padding: 10px; border: 1px solid #e0e0e0;">${time}</td>
          </tr>
          <tr>
            <td style="padding:1 0px; border: 1px solid #e0e0e0; font-weight: bold;">Location:</td>
            <td style="padding: 10px; border: 1px solid #e0e0e0;">${clinicAddress || "Address not provided"}</td>
          </tr>
        </table>
        <p style="font-size: 16px; color: #333;">
          Please arrive 15 minutes early and bring your ID and insurance card. If you need to reschedule or cancel, contact us at least 24 hours in advance at <a href="tel:${receptionNumber}">${receptionNumber}</a>.
        </p>
        <p style="font-size: 16px; color: #333;">
          Thank you for choosing our practice. We look forward to serving you.
        </p>
        <p style="font-size: 16px; color: #333;">
          Best regards,<br />
          Your Healthcare Team
        </p>
      </div>
      <div style="text-align: center; background-color: #f8f9fa; padding: 10px; border-radius: 0 0 8px 8px; font-size: 14px; color: #666;">
        <p style="margin: 0;">1234 Main Street, Oak Grove, FL 00009 | (555) 123-4567</p>
      </div>
    </div>
  `;
};

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
      "_id firstName lastName specialty yearsOfExperience clinicAddress"
    );

    res.status(200).json({
      success: true,
      doctors: doctors.map((doc) => ({
        id: doc._id.toString(),
        firstName: doc.firstName,
        lastName: doc.lastName,
        specialty: doc.specialty,
        yearsOfExperience: doc.yearsOfExperience ?? 0,
        clinicAddress: doc.clinicAddress,
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
    const customHours = availability?.customHours?.find(
      (ch) => ch.date === date
    );
    const { start, end } = customHours || availability?.defaultHours || {
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

    // Check if the slot is in the past (current time: June 23, 2025, 11:47 IST)
    const currentTime = new Date(); // Dynamic time
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

    // Send confirmation email
    try {
      const patientName = `${patient.firstName} ${patient.lastName}`;
      const emailContent = createAppointmentEmail(
        patientName,
        {
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          specialty: doctor.specialty,
        },
        date,
        time,
        doctor.clinicAddress,
        doctor.receptionNumber
      );

      await transporter.sendMail({
        from: `"Healthcare Team" <${process.env.EMAIL_USER}>`,
        to: patient.email,
        subject: `Appointment Confirmation with Dr. ${doctor.firstName} ${doctor.lastName} on ${format(new Date(date), "MMMM d, yyyy")}`,
        html: emailContent,
      });

      console.log(`Confirmation email sent to ${patient.email}`);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Don't fail the booking if email fails
    }

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

exports.getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await User.findOne({
      _id: patientId,
      role: "user",
    });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const appointments = await Appointment.find({
      patientId,
      status: { $in: ["confirmed", "completed"] },
    })
      .populate("doctorId", "firstName lastName specialty")
      .sort({ date: -1, time: -1 });

    res.status(200).json({
      success: true,
      appointments: appointments.map((appt) => ({
        id: appt._id.toString(),
        date: appt.date,
        time: appt.time,
        doctorName: `${appt.doctorId.firstName} ${appt.doctorId.lastName}`,
        specialty: appt.doctorId.specialty,
        status: appt.status,
        type: appt.status === "confirmed" ? "Consultation" : "Follow-up",
      })),
    });
  } catch (error) {
    console.error("Error in getPatientAppointments:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch appointments",
    });
  }
};

exports.updateDoctorHours = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date, start, end } = req.body;

    if (!date.match(/^\d{4}-\d{2}-\d{2}$/) || !start.match(/^\d{2}:\d{2}$/) || !end.match(/^\d{2}:\d{2}$/)) {
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

    // Validate date is not in the past
    const currentTime = new Date();
    if (date < format(currentTime, "yyyy-MM-dd")) {
      return res.status(400).json({
        success: false,
        message: "Cannot set hours for past dates",
      });
    }

    // Validate start time is before end time
    const startTime = parse(start, "HH:mm", new Date());
    const endTime = parse(end, "HH:mm", new Date());
    if (!isBefore(startTime, endTime)) {
      return res.status(400).json({
        success: false,
        message: "Start time must be before end time",
      });
    }

    // Update or add custom hours
    let availability = await Availability.findOne({ doctorId });
    if (!availability) {
      availability = new Availability({ doctorId, customHours: [] });
    }

    const existingCustomHoursIndex = availability.customHours.findIndex(
      (ch) => ch.date === date
    );
    if (existingCustomHoursIndex !== -1) {
      availability.customHours[existingCustomHoursIndex] = { date, start, end };
    } else {
      availability.customHours.push({ date, start, end });
    }

    await availability.save();

    res.status(200).json({
      success: true,
      message: "Doctor hours updated successfully",
    });
  } catch (error) {
    console.error("Error in updateDoctorHours:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update doctor hours",
    });
  }
};