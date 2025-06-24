import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchDoctors,
  fetchAvailability,
  bookAppointmentThunk as bookAppointment,
} from "../redux/slice/appointmentSlice";
import { toast } from "react-hot-toast";
import DoctorSelector from "../components/DoctorSelector";
import DatePicker from "../components/DatePicker";
import TimeSlotGrid from "../components/TimeSlotGrid";
import BookingConfirmation from "../components/BookingConfirmation";
import {
  Loader2,
  Stethoscope,
  AlertCircle,
  Users,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle,
  User,
  Activity,
} from "lucide-react";

const BookAppointment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { doctors, availability, loading, error } = useSelector(
    (state) => state.appointment
  );
  // Initialize selectedDate to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Reset time to midnight
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(tomorrow);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    dispatch(fetchDoctors()).catch((err) => {
      console.error("Fetch doctors error:", err);
      toast.error(err.message || "Failed to load doctors");
    });
  }, [dispatch]);

  useEffect(() => {
    if (selectedDoctorId) {
      dispatch(
        fetchAvailability({
          doctorId: selectedDoctorId,
          date: selectedDate.toISOString().split("T")[0],
        })
      ).catch((err) => {
        console.error("Fetch availability error:", err);
        toast.error(
          err.message === "Access denied"
            ? "You are not authorized to view this doctor's availability. Please log in as a patient."
            : err.message || "Failed to load availability"
        );
      });
    }
  }, [selectedDoctorId, selectedDate, dispatch]);

  const handleSelectDoctor = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setSelectedTime(null);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleSelectTime = (time) => {
    setSelectedTime(time);
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    try {
      const result = await dispatch(
        bookAppointment({
          doctorId: selectedDoctorId,
          patientId: user.id,
          date: selectedDate.toISOString().split("T")[0],
          time: selectedTime,
        })
      ).unwrap();
      const selectedDoctor = doctors.find((doc) => doc.id === selectedDoctorId);
      console.log("Navigating to appointment-confirmed with state:", {
        doctor: selectedDoctor,
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime,
      });
      setShowConfirmation(false);
      if (!selectedDoctor) {
        console.error("Selected doctor not found for ID:", selectedDoctorId);
        toast.error("Doctor information not found");
        return;
      }
      navigate("/appointment-confirmed", {
        state: {
          doctor: selectedDoctor,
          date: selectedDate.toISOString().split("T")[0],
          time: selectedTime,
        },
      });
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(
        err.message === "You already have an appointment booked on this date"
          ? "You already have an appointment with this doctor on this date."
          : err.message === "Cannot book a slot that has already passed"
          ? "This time slot is no longer available."
          : err.message || "Failed to book appointment"
      );
      setShowConfirmation(false);
    }
  };

  const selectedDoctor = doctors.find((doc) => doc.id === selectedDoctorId);
  const availabilityData = availability[`${selectedDoctorId}_${selectedDate.toISOString().split("T")[0]}`] || {};
  const slots = availabilityData.slots || [];

  // Calculate minDate (tomorrow) and maxDate (14 days from tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  minDate.setHours(0, 0, 0, 0);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14);
  maxDate.setHours(0, 0, 0, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-full">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Book Appointment
                </h1>
                <p className="text-gray-600">
                  Schedule your visit with our expert doctors
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/home")}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${
                !selectedDoctorId ? "text-blue-600" : "text-green-600"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  !selectedDoctorId
                    ? "bg-blue-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {!selectedDoctorId ? "1" : <CheckCircle className="h-5 w-5" />}
              </div>
              <span className="font-medium">Select Doctor</span>
            </div>
            <div
              className={`w-16 h-1 rounded ${
                selectedDoctorId ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex items-center space-x-2 ${
                selectedDoctorId && !selectedTime
                  ? "text-blue-600"
                  : selectedTime
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedDoctorId && !selectedTime
                    ? "bg-blue-600 text-white"
                    : selectedTime
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {selectedTime ? <CheckCircle className="h-5 w-5" /> : "2"}
              </div>
              <span className="font-medium">Select Time</span>
            </div>
            <div
              className={`w-16 h-1 rounded ${
                selectedTime ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex items-center space-x-2 ${
                selectedTime ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedTime
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                3
              </div>
              <span className="font-medium">Confirm</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
            <p className="text-red-700">
              {error === "Access denied"
                ? "You are not authorized to view this doctor's availability. Please log in as a patient."
                : error}
            </p>
          </div>
        )}

        {/* Main Content */}
        {!selectedDoctorId ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Choose Your Doctor
              </h2>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading available doctors...</p>
                </div>
              </div>
            ) : doctors.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Doctors Available
                  </h3>
                  <p className="text-gray-600">
                    There are no doctors available at the moment. Please try
                    again later.
                  </p>
                </div>
              </div>
            ) : (
              <DoctorSelector
                doctors={doctors}
                onSelectDoctor={handleSelectDoctor}
              />
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Selected Doctor Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Stethoscope className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}
                    </h2>
                    <p className="text-blue-600 font-medium">
                      {selectedDoctor?.specialty}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDoctorId(null)}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Change Doctor</span>
                </button>
              </div>

              {/* Date Selection */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Select Date
                  </h3>
                </div>
                <DatePicker
                  selectedDate={selectedDate}
                  onSelectDate={handleSelectDate}
                  minDate={minDate}
                  maxDate={maxDate}
                />
              </div>

              {/* Time Selection */}
              <div>
                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Available Time Slots
                  </h3>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
                      <p className="text-gray-600">
                        Loading available times...
                      </p>
                    </div>
                  </div>
                ) : (
                  <TimeSlotGrid
                    slots={slots}
                    onSelectSlot={handleSelectTime}
                    selectedDate={selectedDate}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Booking Confirmation Modal */}
        {showConfirmation && (
          <BookingConfirmation
            doctor={selectedDoctor}
            date={selectedDate}
            time={selectedTime}
            onConfirm={handleConfirmBooking}
            onCancel={() => setShowConfirmation(false)}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default BookAppointment;