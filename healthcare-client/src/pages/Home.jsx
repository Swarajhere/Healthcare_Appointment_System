import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import {
  fetchDoctors,
  fetchPatientAppointments,
} from "../redux/slice/appointmentSlice";
import {
  Heart,
  Calendar,
  User,
  Stethoscope,
  Clock,
  Star,
  ChevronRight,
  Activity,
  Shield,
  Phone,
  MapPin,
  Award,
  Users,
  TrendingUp,
  Search,
  Filter,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

function Home() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { user } = useSelector((state) => state.auth);
  const { doctors, patientAppointments, loading, error } = useSelector(
    (state) => state.appointment
  );
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (user?.id && user?.role === "user") {
      dispatch(fetchPatientAppointments(user.id)).catch((err) => {
        console.error("Fetch patient appointments error:", err);
        toast.error(err.message || "Failed to load appointments");
      });
      dispatch(fetchDoctors()).catch((err) => {
        console.error("Fetch doctors error:", err);
        toast.error(err.message || "Failed to load doctors");
      });
    }
  }, [dispatch, user?.id, user?.role]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Filter upcoming appointments (confirmed and not in the past)
  const currentDateTime = new Date();
  const currentDate = format(currentDateTime, "yyyy-MM-dd");
  const upcomingAppointments = patientAppointments
    .filter((appt) => {
      const apptDateTime = new Date(`${appt.date}T${appt.time}:00+05:30`);
      return (
        appt.status === "confirmed" &&
        (appt.date > currentDate ||
          (appt.date === currentDate && apptDateTime >= currentDateTime))
      );
    })
    .slice(0, 2); // Limit to first 2

  // Map doctors data with mock fields for rating, experience, and availability
  const enhancedDoctors = doctors.map((doctor) => ({
    id: doctor.id,
    name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
    specialization: doctor.specialty,
    rating: (Math.random() * (5.0 - 4.8) + 4.8).toFixed(1), // Mock rating between 4.8 and 5.0
    experience: `${Math.floor(Math.random() * 10 + 10)}+ years`, // Mock experience 10+ to 19+ years
    availability:
      doctor.id % 2 === 0 ? "Available Today" : "Available Tomorrow", // Mock availability
    image: "/placeholder.svg", // Placeholder image
  }));

  const services = [
    {
      id: 1,
      name: "General Checkup",
      description: "Comprehensive health assessments for all ages.",
      icon: Stethoscope,
      price: "From $150",
      duration: "30-45 min",
    },
    {
      id: 2,
      name: "Cardiac Care",
      description: "Advanced heart diagnostics and treatments.",
      icon: Heart,
      price: "From $300",
      duration: "45-60 min",
    },
    {
      id: 3,
      name: "Neurological Services",
      description: "Specialized care for brain and nervous system disorders.",
      icon: Activity,
      price: "From $400",
      duration: "60-90 min",
    },
    {
      id: 4,
      name: "Orthopedic Surgery",
      description:
        "Expert surgical and non-surgical treatments for bones and joints.",
      icon: Shield,
      price: "From $500",
      duration: "90+ min",
    },
    {
      id: 5,
      name: "Pediatric Care",
      description: "Dedicated healthcare for children and adolescents.",
      icon: Users,
      price: "From $120",
      duration: "30-45 min",
    },
    {
      id: 6,
      name: "Emergency Care",
      description: "24/7 emergency medical services and trauma care.",
      icon: Phone,
      price: "Varies",
      duration: "Immediate",
    },
  ];

  const healthStats = [
    {
      label: "Heart Rate",
      value: "72 BPM",
      status: "Normal",
      color: "text-green-600",
    },
    {
      label: "Blood Pressure",
      value: "120/80",
      status: "Normal",
      color: "text-green-600",
    },
    {
      label: "Weight",
      value: "70 kg",
      status: "Stable",
      color: "text-blue-600",
    },
    {
      label: "Last Checkup",
      value: "2 weeks ago",
      status: "Recent",
      color: "text-gray-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Dashboard Section */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Welcome Card */}
            <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    Welcome Back!
                  </h1>
                  <p className="text-blue-100 text-base sm:text-lg">
                    Your health journey continues with CareConnect
                  </p>
                </div>
                <div className="hidden sm:block">
                  <div className="bg-white/20 rounded-full p-3 sm:p-4">
                    <Heart className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => navigate("/book-appointment")}
                  className="bg-white text-blue-600 px-4 sm:px-6 py-3 rounded-full hover:bg-blue-50 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center font-medium text-sm sm:text-base"
                >
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Book New Appointment
                </button>
                <button className="border-2 border-white/30 text-white px-4 sm:px-6 py-3 rounded-full hover:bg-white/10 transition-all duration-200 flex items-center justify-center text-sm sm:text-base">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span className="hidden sm:inline">
                    Emergency: (911) 123-4567
                  </span>
                  <span className="sm:hidden">Emergency Call</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Health Overview
                  </h3>
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                </div>
                <div className="space-y-3">
                  {healthStats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs sm:text-sm text-gray-600">
                        {stat.label}
                      </span>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 text-sm sm:text-base">
                          {stat.value}
                        </div>
                        <div className={`text-xs ${stat.color}`}>
                          {stat.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Appointments */}
      <section className="py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
                Upcoming Appointments
              </h2>
              <button
                onClick={() => navigate("/my-appointments")}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm sm:text-base"
              >
                Show More
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    Loading your appointments...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-semibold mb-1">
                    Error Loading Appointments
                  </h3>
                  <p className="text-red-700">{error}</p>
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
                    You don't have any upcoming appointments. Book a new one to
                    get started.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                        <div className="bg-blue-600 rounded-full p-2">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                            {appointment.doctorName}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {appointment.specialty}
                          </p>
                        </div>
                      </div>
                      <span className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium self-start sm:self-center">
                        {appointment.type}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-0">
                        <div className="flex items-center mb-1 sm:mb-0">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {format(
                            new Date(appointment.date),
                            "EEEE, MMM d, yyyy"
                          )}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {format(
                            new Date(`1970-01-01T${appointment.time}:00`),
                            "h:mm aa"
                          )}
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm self-start sm:self-center">
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 sm:mb-12">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Meet Our Expert Doctors
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Choose from our team of highly qualified specialists
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search doctors..."
                  className="w-full sm:w-auto pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <button
                className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Mobile Filter Panel */}
          {showFilters && (
            <div className="lg:hidden mb-6 bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>All Specializations</option>
                    <option>Cardiology</option>
                    <option>Neurology</option>
                    <option>Orthopedics</option>
                    <option>Pediatrics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>Any Time</option>
                    <option>Available Today</option>
                    <option>Available Tomorrow</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Doctors List */}
          <div className="py-8">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Loading doctors...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-semibold mb-1">
                    Error Loading Doctors
                  </h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            ) : enhancedDoctors.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center max-w-md">
                  <div className="bg-gray-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No Doctors Available
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    No doctors are available at the moment. Please try again
                    later.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {enhancedDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white rounded-full px-2 py-1 flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium">
                          {doctor.rating}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                        {doctor.name}
                      </h3>
                      <p className="text-blue-600 font-medium mb-2 text-sm sm:text-base">
                        {doctor.specialization}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">
                        {doctor.experience}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            doctor.availability === "Available Today"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {doctor.availability}
                        </span>
                      </div>
                      <button
                        onClick={() => navigate("/book-appointment")}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm sm:text-base"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Our Treatments & Services
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare services designed to meet all your
              medical needs
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group p-4 sm:p-6 lg:p-8"
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                    <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center mb-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {service.duration}
                      </div>
                      <div className="font-medium text-blue-600">
                        {service.price}
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center text-sm sm:text-base">
                    Book Service
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Need Immediate Assistance?
              </h2>
              <p className="text-blue-100 text-base sm:text-lg">
                We're here to help 24/7 with your healthcare needs
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center backdrop-blur-sm">
                <Phone className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-3 sm:mb-4" />
                <h3 className="font-semibold mb-2 text-sm sm:text-base">
                  Emergency Care
                </h3>
                <p className="text-blue-100 text-xs sm:text-sm mb-3 sm:mb-4">
                  24/7 emergency services
                </p>
                <button className="bg-white text-blue-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium text-xs sm:text-sm">
                  Call Now
                </button>
              </div>
              <div className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center backdrop-blur-sm">
                <MapPin className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-3 sm:mb-4" />
                <h3 className="font-semibold mb-2 text-sm sm:text-base">
                  Find Location
                </h3>
                <p className="text-blue-100 text-xs sm:text-sm mb-3 sm:mb-4">
                  Locate nearest facility
                </p>
                <button className="bg-white text-blue-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium text-xs sm:text-sm">
                  Get Directions
                </button>
              </div>
              <div className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center backdrop-blur-sm sm:col-span-2 lg:col-span-1">
                <Award className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-3 sm:mb-4" />
                <h3 className="font-semibold mb-2 text-sm sm:text-base">
                  Health Records
                </h3>
                <p className="text-blue-100 text-xs sm:text-sm mb-3 sm:mb-4">
                  Access your medical history
                </p>
                <button className="bg-white text-blue-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium text-xs sm:text-sm">
                  View Records
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
