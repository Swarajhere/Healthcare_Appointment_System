import React from "react";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  ArrowLeft,
  Home,
  Plus,
  Stethoscope,
  Award,
  Phone,
  MapPin,
} from "lucide-react";
import { format, isValid } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";

const AppointmentConfirmed = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Extract props from location.state with fallbacks
  const { doctor, date, time } = state || {};
  console.log("AppointmentConfirmed state:", { doctor, date, time });

  const formattedDate =
    date && isValid(new Date(date))
      ? format(new Date(date), "EEEE, MMMM d, yyyy")
      : "Invalid date";
  const doctorName =
    doctor?.firstName && doctor?.lastName
      ? `Dr. ${doctor.firstName} ${doctor.lastName}`
      : "Unknown Doctor";
  const doctorSpecialty = doctor?.specialty || "Unknown Specialty";
  const doctorClinicAddress = doctor?.clinicAddress || "Unknown Address";
  const displayTime = time || "Unknown Time";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Appointment Confirmed
                </h1>
                <p className="text-gray-600">
                  Your booking has been successfully processed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-green-600 p-6 rounded-full">
                <CheckCircle className="h-16 w-16 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mt-6 mb-2">
              Appointment Confirmed!
            </h2>
            <p className="text-lg text-gray-600">
              Your appointment has been successfully booked. We've sent a
              confirmation to your email.
            </p>
          </div>

          {/* Appointment Details Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center space-x-3">
                <Stethoscope className="h-8 w-8" />
                <div>
                  <h3 className="text-xl font-bold">Appointment Details</h3>
                  <p className="text-blue-100">
                    Please save these details for your records
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Doctor Information */}
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-2xl">
                <div className="bg-blue-600 p-3 rounded-full flex-shrink-0">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    Healthcare Provider
                  </h4>
                  <p className="text-xl font-bold text-blue-600 mb-1">
                    {doctorName}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{doctorSpecialty}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600 line-clamp-2">
                      {doctorClinicAddress}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-2xl">
                  <div className="bg-green-600 p-3 rounded-full flex-shrink-0">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      Date
                    </h4>
                    <p className="text-green-700 font-medium">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-2xl">
                  <div className="bg-purple-600 p-3 rounded-full flex-shrink-0">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      Time
                    </h4>
                    <p className="text-purple-700 font-medium">{displayTime}</p>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Phone className="h-5 w-5 text-yellow-600 mr-2" />
                  Important Reminders
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Please arrive 15 minutes before your appointment time
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Bring a valid ID and insurance card if applicable
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      If you need to reschedule, please call at least 24 hours
                      in advance
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
            >
              <Home className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>

            <button
              onClick={() => navigate("/book-appointment")}
              className="flex items-center justify-center space-x-2 border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all duration-200 font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>Book Another Appointment</span>
            </button>
          </div>

          {/* Contact Information */}
          <div className="mt-12 text-center">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Need Help?
              </h4>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Call us: (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-red-600" />
                  <span className="text-red-600">
                    Emergency: (911) 123-4567
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmed;
