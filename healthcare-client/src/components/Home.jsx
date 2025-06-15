import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
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
  Bell,
  Settings,
  LogOut,
  Search,
  Filter,
} from "lucide-react";

function Home() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Enhanced mock data
  const doctors = [
    {
      id: 1,
      name: "Dr. John Smith",
      specialization: "Cardiology",
      rating: 4.9,
      experience: "15+ years",
      availability: "Available Today",
      image:
        "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 2,
      name: "Dr. Emily Johnson",
      specialization: "Neurology",
      rating: 4.8,
      experience: "12+ years",
      availability: "Available Tomorrow",
      image:
        "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 3,
      name: "Dr. Michael Chen",
      specialization: "Orthopedics",
      rating: 4.9,
      experience: "18+ years",
      availability: "Available Today",
      image:
        "https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 4,
      name: "Dr. Sarah Patel",
      specialization: "Pediatrics",
      rating: 5.0,
      experience: "10+ years",
      availability: "Available Today",
      image:
        "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

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

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. John Smith",
      specialty: "Cardiology",
      date: "Today",
      time: "2:30 PM",
      type: "Follow-up",
    },
    {
      id: 2,
      doctor: "Dr. Emily Johnson",
      specialty: "Neurology",
      date: "Tomorrow",
      time: "10:00 AM",
      type: "Consultation",
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
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Welcome Card */}
            <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
                  <p className="text-blue-100 text-lg">
                    Your health journey continues with CareConnect
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="bg-white/20 rounded-full p-4">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-full hover:bg-blue-50 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center font-medium">
                  <Calendar className="h-5 w-5 mr-2" />
                  Book New Appointment
                </button>
                <button className="border-2 border-white/30 text-white px-6 py-3 rounded-full hover:bg-white/10 transition-all duration-200 flex items-center justify-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Emergency: (911) 123-4567
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Health Overview
                  </h3>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div className="space-y-3">
                  {healthStats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600">
                        {stat.label}
                      </span>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
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
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Upcoming Appointments
              </h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-600 rounded-full p-2">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {appointment.doctor}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {appointment.specialty}
                        </p>
                      </div>
                    </div>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {appointment.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {appointment.time}
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Meet Our Expert Doctors
              </h2>
              <p className="text-gray-600">
                Choose from our team of highly qualified specialists
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search doctors..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-medium">{doctor.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">
                    {doctor.specialization}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
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
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Treatments & Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare services designed to meet all your
              medical needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group p-8"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                    <IconComponent className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center mb-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration}
                      </div>
                      <div className="font-medium text-blue-600">
                        {service.price}
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center">
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Need Immediate Assistance?
              </h2>
              <p className="text-blue-100 text-lg">
                We're here to help 24/7 with your healthcare needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
                <Phone className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Emergency Care</h3>
                <p className="text-blue-100 text-sm mb-4">
                  24/7 emergency services
                </p>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium">
                  Call Now
                </button>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
                <MapPin className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Find Location</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Locate nearest facility
                </p>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium">
                  Get Directions
                </button>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
                <Award className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Health Records</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Access your medical history
                </p>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium">
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
