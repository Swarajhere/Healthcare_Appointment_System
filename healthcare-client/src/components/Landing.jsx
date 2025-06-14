import React from "react";
import {
  Heart,
  Shield,
  Clock,
  Users,
  Stethoscope,
  Brain,
  Eye,
  Baby,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  Calendar,
  Award,
  Activity,
} from "lucide-react";

function Landing() {
  const services = [
    {
      icon: Heart,
      title: "Cardiology",
      description: "Heart health specialists with advanced cardiac care",
    },
    {
      icon: Brain,
      title: "Neurology",
      description: "Expert neurological care and brain health services",
    },
    {
      icon: Eye,
      title: "Ophthalmology",
      description: "Complete eye care from routine exams to surgery",
    },
    {
      icon: Baby,
      title: "Pediatrics",
      description: "Specialized healthcare for infants, children & teens",
    },
    {
      icon: Stethoscope,
      title: "Internal Medicine",
      description: "Primary care for adult health and wellness",
    },
    {
      icon: Shield,
      title: "Emergency Care",
      description: "24/7 emergency medical services and trauma care",
    },
    {
      icon: Users,
      title: "Family Medicine",
      description: "Comprehensive care for patients of all ages",
    },
    {
      icon: Activity,
      title: "Preventive Care",
      description: "Health screenings and preventive medicine",
    },
  ];

  const features = [
    "Board-certified physicians across all specialties",
    "State-of-the-art medical technology and equipment",
    "Personalized treatment plans tailored to your needs",
    "Convenient online appointment scheduling",
    "Electronic health records for seamless care",
    "Insurance accepted and financial assistance available",
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Mother of 2",
      content:
        "The pediatric team at CareConnect is absolutely wonderful. They made my children feel comfortable and provided excellent care throughout our visit.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Business Executive",
      content:
        "As someone with a busy schedule, I appreciate CareConnect's efficient service and online booking system. The doctors are professional and thorough.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Teacher",
      content:
        "I've been a patient here for 3 years. The staff is caring, the facilities are modern, and I always feel heard and understood during my appointments.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
                <Award className="h-4 w-4 mr-2" />
                Award-winning Healthcare Excellence
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Health,
                <span className="text-blue-600 block">Our Priority</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience world-class healthcare with our team of expert
                doctors, state-of-the-art facilities, and personalized patient
                care. Book your appointment today and take the first step
                towards better health.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Appointment
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full hover:border-blue-600 hover:text-blue-600 transition-all duration-300 flex items-center justify-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Emergency: (911) 123-4567
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-2xl p-6 transform -rotate-3">
                  <div className="flex items-center mb-4">
                    <Activity className="h-8 w-8 text-blue-600" />
                    <span className="ml-2 text-lg font-semibold text-gray-800">
                      Health Dashboard
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-green-700">Next Appointment</span>
                      <span className="text-green-600 font-medium">
                        Tomorrow 2:30 PM
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-700">Health Score</span>
                      <span className="text-blue-600 font-medium">92/100</span>
                    </div>
                    <div className="flex justify-center pt-4">
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-5 w-5 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Patients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
              <div className="text-gray-600">Expert Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600">Specializations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Emergency Care</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From routine check-ups to specialized treatments, we offer a full
              range of medical services to keep you and your family healthy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group cursor-pointer"
                >
                  <div className="flex items-center justify-center w-14 h-14 bg-blue-100 rounded-xl mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                    <IconComponent className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        id="about"
        className="py-20 bg-gradient-to-br from-blue-50 to-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose CareConnect Hospital?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We're committed to providing exceptional healthcare experiences
                that prioritize your health, comfort, and peace of mind.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Quick Appointment
              </h3>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="serviceNeeded"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Service Needed
                  </label>
                  <select
                    id="serviceNeeded"
                    name="serviceNeeded"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    <option value="general">General Consultation</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="neurology">Neurology</option>
                    <option value="pediatrics">Pediatrics</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Request Appointment
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it - hear from our satisfied patients
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600">
              We're here to help with any questions about your healthcare needs
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Call Us
              </h3>
              <p className="text-gray-600 mb-2">General Inquiries</p>
              <p className="text-blue-600 font-medium">(555) 123-4567</p>
              <p className="text-gray-600 mt-2">Emergency</p>
              <p className="text-red-600 font-medium">(911) 123-4567</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Email Us
              </h3>
              <p className="text-gray-600 mb-2">General Information</p>
              <p className="text-blue-600 font-medium">info@careconnect.com</p>
              <p className="text-gray-600 mt-2">Appointments</p>
              <p className="text-blue-600 font-medium">
                appointments@careconnect.com
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Visit Us
              </h3>
              <p className="text-gray-600 mb-2">Main Hospital</p>
              <p className="text-gray-700">
                123 Health Street
                <br />
                Medical City, MC 12345
              </p>
              <p className="text-gray-600 mt-2">Hours: 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">CareConnect</span>
              </div>
              <p className="text-gray-400 mb-4">
                Providing exceptional healthcare services with compassion,
                expertise, and state-of-the-art medical technology.
              </p>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">24/7 Emergency Care</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#about"
                    className="hover:text-white transition-colors duration-200"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Our Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Find a Doctor
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Patient Portal
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Insurance
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Emergency Care
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Surgery
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Maternity
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Cardiology
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Pediatrics
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" />
                  <span>123 Health Street, Medical City, MC 12345</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" />
                  <span>info@careconnect.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              © 2025 CareConnect Hospital. All rights reserved. | Privacy Policy
              | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
