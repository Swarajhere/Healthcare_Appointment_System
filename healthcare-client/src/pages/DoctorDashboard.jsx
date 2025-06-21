import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctorAppointments } from "../redux/slice/appointmentSlice";
import {
  Stethoscope,
  Calendar,
  Users,
  Loader2,
  AlertCircle,
  Clock,
  User,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  CalendarDays,
  Timer,
  UserCheck,
} from "lucide-react";
import { format } from "date-fns";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { appointments, loading, error } = useSelector(
    (state) => state.appointment
  );

  useEffect(() => {
    dispatch(fetchDoctorAppointments(user.id));
  }, [dispatch, user.id]);

  // Calculate statistics
  const totalAppointments = appointments.length;
  const todayAppointments = appointments.filter(
    (apt) =>
      format(new Date(apt.date), "yyyy-MM-dd") ===
      format(new Date(), "yyyy-MM-dd")
  ).length;
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "completed"
  ).length;
  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "scheduled"
  ).length;

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "scheduled":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
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
                <p className="text-gray-600 text-lg">
                  Here's an overview of your appointments today
                </p>
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
                  {completedAppointments}
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

        {/* Appointments Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Your Appointments
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
            ) : appointments.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center max-w-md">
                  <div className="bg-gray-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No Appointments Yet
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    You don't have any scheduled appointments at the moment. New
                    appointments will appear here once patients book with you.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment, index) => (
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
      </div>
    </div>
  );
};

export default DoctorDashboard;
