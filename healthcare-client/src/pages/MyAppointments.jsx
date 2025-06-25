import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import {
  fetchPatientAppointments,
  deleteAppointmentThunk as deleteAppointment,
} from "../redux/slice/appointmentSlice";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  User,
  Users,
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { DateTime } from "luxon";

const MyAppointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { patientAppointments, loading, error } = useSelector(
    (state) => state.appointment
  );

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    } else if (user?.id && user?.role === "user") {
      dispatch(fetchPatientAppointments(user.id)).catch((err) => {
        console.error("Fetch patient appointments error:", err);
        toast.error(err.message || "Failed to load appointments");
      });
    }
  }, [dispatch, isLoggedIn, navigate, user?.id, user?.role]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Current IST time using luxon
  const currentDateTime = DateTime.now().setZone("Asia/Kolkata");
  const currentDate = currentDateTime.toFormat("yyyy-MM-dd");

  // Check if deletion is allowed (before or on appointment day until midnight)
  const canDeleteAppointment = (appt) => {
    const apptDateTime = DateTime.fromFormat(
      `${appt.date} ${appt.time}`,
      "yyyy-MM-dd HH:mm",
      {
        zone: "Asia/Kolkata",
      }
    );
    const apptMidnight = DateTime.fromFormat(appt.date, "yyyy-MM-dd", {
      zone: "Asia/Kolkata",
    }).endOf("day");
    return currentDateTime <= apptMidnight && appt.status === "confirmed";
  };

  // Handle delete action
  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await dispatch(deleteAppointment(appointmentId)).unwrap();
        toast.success("Appointment deleted successfully");
      } catch (err) {
        console.error("Delete appointment error:", err);
        toast.error(err.message || "Failed to delete appointment");
      }
    }
  };

  // Separate upcoming and completed appointments
  const upcomingAppointments = patientAppointments.filter((appt) => {
    return appt.status === "confirmed";
  });

  const completedAppointments = patientAppointments.filter((appt) => {
    return appt.status === "completed";
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-full">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  My Appointments
                </h1>
                <p className="text-gray-600">
                  View your upcoming and completed appointments
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
        <div>
          {/* Error Display */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Upcoming Appointments Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Upcoming Appointments
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
                      No Upcoming Appointments
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      You don't have any upcoming appointments. Book a new one
                      to get started.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="group bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-200">
                              {appointment.doctorName}
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
                                    new Date(
                                      `1970-01-01T${appointment.time}:00`
                                    ),
                                    "h:mm aa"
                                  )}
                                </span>
                              </div>
                            </div>
                            <p className="text-blue-600 font-medium text-sm">
                              {appointment.specialty}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 px-4 py-2 rounded-full border bg-blue-100 text-blue-800 border-blue-200 font-medium text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span className="capitalize">
                              {appointment.type}
                            </span>
                          </div>
                          {canDeleteAppointment(appointment) && (
                            <button
                              onClick={() =>
                                handleDeleteAppointment(appointment.id)
                              }
                              className="text-red-600 hover:text-red-800 transition-colors duration-200"
                              title="Delete Appointment"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Completed Appointments Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-600">
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
                  {completedAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="group bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                            <User className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-900 transition-colors duration-200">
                              {appointment.doctorName}
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
                                    new Date(
                                      `1970-01-01T${appointment.time}:00`
                                    ),
                                    "h:mm aa"
                                  )}
                                </span>
                              </div>
                            </div>
                            <p className="text-green-600 font-medium text-sm">
                              {appointment.specialty}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 px-4 py-2 rounded-full border bg-green-100 text-green-800 border-green-200 font-medium text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span className="capitalize">
                              {appointment.type}
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
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
