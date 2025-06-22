"use client";

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
  ChevronRight,
  Activity,
  Shield,
  Phone,
  MapPin,
  Award,
  Users,
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

  // Map doctors data with mock fields for availability
  const enhancedDoctors = doctors.map((doctor) => ({
    id: doctor.id,
    name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
    specialization: doctor.specialty,
    availability: "Available Today",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
  }));

  const services = [
    {
      id: 1,
      name: "General Checkup",
      description:
        "Comprehensive health assessments for all ages with detailed medical evaluations.",
      icon: Stethoscope,
      price: "From $150",
      duration: "30-45 min",
    },
    {
      id: 2,
      name: "Cardiac Care",
      description:
        "Advanced heart diagnostics and specialized cardiovascular treatments.",
      icon: Heart,
      price: "From $300",
      duration: "45-60 min",
    },
    {
      id: 3,
      name: "Neurological Services",
      description:
        "Specialized care for brain and nervous system disorders with expert diagnosis.",
      icon: Activity,
      price: "From $400",
      duration: "60-90 min",
    },
    {
      id: 4,
      name: "Orthopedic Surgery",
      description:
        "Expert surgical and non-surgical treatments for bones, joints, and muscles.",
      icon: Shield,
      price: "From $500",
      duration: "90+ min",
    },
    {
      id: 5,
      name: "Pediatric Care",
      description:
        "Dedicated healthcare services for children and adolescents of all ages.",
      icon: Users,
      price: "From $120",
      duration: "30-45 min",
    },
    {
      id: 6,
      name: "Emergency Care",
      description:
        "24/7 emergency medical services and immediate trauma care response.",
      icon: Phone,
      price: "Varies",
      duration: "Immediate",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Dashboard Section */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 gap-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                    Welcome Back, {user?.firstName || "Patient"}!
                  </h1>
                  <p className="text-blue-100 text-lg lg:text-xl">
                    Your health journey continues with CareConnect
                  </p>
                </div>
                <div className="hidden lg:block">
                  <div className="bg-white/20 rounded-full p-4">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/book-appointment")}
                  className="bg-white text-blue-600 px-6 py-3 rounded-full hover:bg-blue-50 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center font-semibold text-base"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book New Appointment
                </button>
                <button className="border-2 border-white/30 text-white px-6 py-3 rounded-full hover:bg-white/10 transition-all duration-200 flex items-center justify-center font-medium text-base">
                  <Phone className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">
                    Emergency: (911) 123-4567
                  </span>
                  <span className="sm:hidden">Emergency Call</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Appointments */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg border border-gray-100 p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Upcoming Appointments
                </h2>
                <p className="text-gray-600 text-base">
                  Your scheduled medical consultations
                </p>
              </div>
              <button
                onClick={() => navigate("/my-appointments")}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center text-base mt-4 sm:mt-0"
              >
                View All Appointments
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">
                    Loading your appointments...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-semibold mb-1 text-lg">
                    Error Loading Appointments
                  </h3>
                  <p className="text-red-700 text-base">{error}</p>
                </div>
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center max-w-md">
                  <div className="bg-gray-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Calendar className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No Upcoming Appointments
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    You don't have any upcoming appointments scheduled. Book a
                    new appointment to get started with your healthcare journey.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                        <div className="bg-blue-600 rounded-full p-2">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {appointment.doctorName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {appointment.specialty}
                          </p>
                        </div>
                      </div>
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium self-start sm:self-center">
                        {appointment.type}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 mb-3 sm:mb-0">
                        <div className="flex items-center mb-1 sm:mb-0">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(
                            new Date(appointment.date),
                            "EEEE, MMM d, yyyy"
                          )}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {format(
                            new Date(`1970-01-01T${appointment.time}:00`),
                            "h:mm aa"
                          )}
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm self-start sm:self-center">
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
      <section className="py-8 lg:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Meet Our Expert Doctors
              </h2>
              <p className="text-gray-600 text-lg">
                Choose from our team of highly qualified medical specialists
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search doctors by name or specialty..."
                  className="w-full sm:w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
              </div>
              <button
                className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-base font-medium"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Mobile Filter Panel */}
          {showFilters && (
            <div className="lg:hidden mb-6 bg-white rounded-lg border border-gray-200 p-4 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-lg">
                  Filter Options
                </h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Specialization
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
                    Doctor Availability
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
                  <p className="text-gray-600 text-lg font-medium">
                    Loading doctors...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-semibold mb-1 text-lg">
                    Error Loading Doctors
                  </h3>
                  <p className="text-red-700 text-base">{error}</p>
                </div>
              </div>
            ) : enhancedDoctors.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center max-w-md">
                  <div className="bg-gray-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Stethoscope className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No Doctors Available
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    No doctors are currently available. Please check back later
                    or contact our support team for assistance.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {enhancedDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={doctor.image || "/placeholder.svg"}
                        alt={`${doctor.name} - ${doctor.specialization}`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {doctor.name}
                      </h3>
                      <p className="text-blue-600 font-medium mb-3 text-base">
                        {doctor.specialization}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`text-sm px-3 py-1 rounded-full font-medium ${
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
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold text-base"
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
      <section className="py-8 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Medical Services & Treatments
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare services designed to meet all your
              medical needs with expert care and advanced technology
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group p-6 lg:p-8"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                    <IconComponent className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-base">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="font-medium">
                          Duration: {service.duration}
                        </span>
                      </div>
                      <div className="font-semibold text-blue-600 text-base">
                        {service.price}
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold flex items-center justify-center text-base">
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
      <section className="py-8 lg:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Need Immediate Medical Assistance?
              </h2>
              <p className="text-blue-100 text-lg lg:text-xl">
                We're here to help you 24/7 with all your healthcare needs and
                emergency situations
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm hover:bg-white/20 transition-colors duration-200">
                <Phone className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-lg">Emergency Care</h3>
                <p className="text-blue-100 text-base mb-4">
                  24/7 emergency medical services
                </p>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-semibold text-base">
                  Call Emergency
                </button>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm hover:bg-white/20 transition-colors duration-200">
                <MapPin className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-lg">
                  Find Our Location
                </h3>
                <p className="text-blue-100 text-base mb-4">
                  Locate the nearest medical facility
                </p>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-semibold text-base">
                  Get Directions
                </button>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm hover:bg-white/20 transition-colors duration-200 sm:col-span-2 lg:col-span-1">
                <Award className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-lg">Medical Records</h3>
                <p className="text-blue-100 text-base mb-4">
                  Access your complete medical history
                </p>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-semibold text-base">
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
