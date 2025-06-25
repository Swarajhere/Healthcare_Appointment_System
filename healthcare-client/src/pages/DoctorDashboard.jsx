import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDoctorAppointments,
  updateDoctorHoursThunk,
  markAppointmentCompletedThunk, // New thunk
} from "../redux/slice/appointmentSlice";
import {
  Stethoscope,
  Calendar,
  Users,
  Loader2,
  Clock,
  User,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Check,
  CalendarDays,
  Timer,
  UserCheck,
  Plus,
} from "lucide-react";
import { format, isBefore, parse } from "date-fns";
import { toast } from "react-hot-toast";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { appointments, loading, error } = useSelector(
    (state) => state.appointment
  );
  const [showHoursForm, setShowHoursForm] = useState(false);
  const [hoursFormData, setHoursFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    start: "09:00",
    end: "17:00",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchDoctorAppointments(user.id));
  }, [dispatch, user.id]);

  // Current IST time
  const currentTime = new Date();
  const currentDate = format(currentTime, "yyyy-MM-dd");

  // Filter for completed and upcoming appointments
  const completedAppointments = appointments.filter((apt) => {
    return apt.status === "completed";
  });

  const upcomingAppointments = appointments.filter((apt) => {
    return apt.status === "confirmed" && apt.date === currentDate;
  });

  // Calculate statistics
  const totalAppointments = appointments.length;
  const todayAppointments = upcomingAppointments.length;
  const completedAppointmentsCount = completedAppointments.length;
  const pendingAppointments = upcomingAppointments.length;

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "confirmed":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const handleHoursFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    // Validate date
    if (hoursFormData.date < currentDate) {
      errors.date = "Cannot set hours for past dates";
    }

    // Validate times
    const startTime = parse(hoursFormData.start, "HH:mm", new Date());
    const endTime = parse(hoursFormData.end, "HH:mm", new Date());
    if (!isBefore(startTime, endTime)) {
      errors.start = "Start time must be before end time";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await dispatch(
        updateDoctorHoursThunk({
          doctorId: user.id,
          date: hoursFormData.date,
          start: hoursFormData.start,
          end: hoursFormData.end,
        })
      ).unwrap();
      toast.success("Availability hours updated successfully");
      setShowHoursForm(false);
      setHoursFormData({
        date: format(new Date(), "yyyy-MM-dd"),
        start: "09:00",
        end: "17:00",
      });
    } catch (err) {
      toast.error(err.message || "Failed to update hours");
    }
  };

  const handleFormChange = (e, field) => {
    setHoursFormData({ ...hoursFormData, [field]: e.target.value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: undefined });
    }
  };

  const handleMarkCompleted = async (appointmentId) => {
    try {
      await dispatch(
        markAppointmentCompletedThunk({ appointmentId, doctorId: user.id })
      ).unwrap();
      toast.success("Appointment marked as completed");
      dispatch(fetchDoctorAppointments(user.id)); // Refresh appointments
    } catch (err) {
      toast.error(err.message || "Failed to mark appointment as completed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl shadow-lg">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-1">
                  Welcome back, Dr. {user?.firstName}
                </h1>
                <p className="text-gray-600 text-lg">Today's appointments</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="text-blue-700 font-medium">
                {format(new Date(), "EEEE, MMM d")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Set Custom Hours Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowHoursForm(!showHoursForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium shadow-lg"
          >
            <Plus size={20} />
            {showHoursForm ? "Hide Custom Hours Form" : "Set Custom Hours"}
          </button>
        </div>

        {/* Custom Hours Form */}
        {showHoursForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Set Custom Availability Hours
            </h3>
            <form onSubmit={handleHoursFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={hoursFormData.date}
                  onChange={(e) => handleFormChange(e, "date")}
                  min={currentDate}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    formErrors.date
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.date && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={hoursFormData.start}
                    onChange={(e) => handleFormChange(e, "start")}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      formErrors.start
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.start && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.start}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={hoursFormData.end}
                    onChange={(e) => handleFormChange(e, "end")}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      formErrors.end
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.end && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.end}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                >
                  <Check size={20} />
                  Save Hours
                </button>
                <button
                  type="button"
                  onClick={() => setShowHoursForm(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-400"
                >
                  <XCircle size={20} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Appointments
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalAppointments}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Today's Appointments
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {todayAppointments}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CalendarDays className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Completed
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {completedAppointmentsCount}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Pending
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {pendingAppointments}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Timer className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-semibold mb-1">
                Error Loading Appointments
              </h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Upcoming Appointments Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Today's Appointments
              </h2>
            </div>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    Loading your appointments...
                  </p>
                </div>
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center max-w-md">
                  <div className="bg-gray-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No Appointments Today
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    You don't have any appointments scheduled for today. New
                    appointments will appear here once patients book with you.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <div
                    key={`${appointment.date}_${appointment.time}_${index}`}
                    className="group bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-200">
                            {appointment.patientName}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">
                                {format(
                                  new Date(appointment.date),
                                  "EEEE, MMM d, yyyy"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-green-500" />
                              <span className="font-medium">
                                {format(
                                  new Date(`1970-01-01T${appointment.time}:00`),
                                  "h:mm a"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={appointment.status === "completed"}
                          onChange={() => handleMarkCompleted(appointment.id)}
                          disabled={appointment.status === "completed"}
                          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                          title="Mark as completed"
                        />
                        <div
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full border font-medium text-sm ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {getStatusIcon(appointment.status)}
                          <span className="capitalize">
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Completed Appointments Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-teal-700 px-8 py-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Completed Appointments
              </h2>
            </div>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    Loading your appointments...
                  </p>
                </div>
              </div>
            ) : completedAppointments.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center max-w-md">
                  <div className="bg-gray-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No Completed Appointments
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    You don't have any completed appointments at the moment.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {completedAppointments.map((appointment, index) => (
                  <div
                    key={`${appointment.date}_${appointment.time}_${index}`}
                    className="group bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                          <User className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-900 transition-colors duration-200">
                            {appointment.patientName}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">
                                {format(
                                  new Date(appointment.date),
                                  "EEEE, MMM d, yyyy"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-green-500" />
                              <span className="font-medium">
                                {format(
                                  new Date(`1970-01-01T${appointment.time}:00`),
                                  "h:mm a"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full border font-medium text-sm ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {getStatusIcon(appointment.status)}
                          <span className="capitalize">Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
