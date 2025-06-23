import React from "react";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  Clock,
  User,
  Stethoscope,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";

const BookingConfirmation = ({
  doctor,
  date,
  time,
  onConfirm,
  onCancel,
  loading,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-3xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Confirm Your Appointment</h3>
              <p className="text-blue-100 text-sm">
                Please review the details below
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Appointment Details */}
          <div className="space-y-6 mb-8">
            {/* Doctor Information */}
            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="bg-blue-600 p-2 rounded-full flex-shrink-0">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-600 mb-1">
                  Healthcare Provider
                </h4>
                <p className="text-lg font-bold text-gray-900">
                  Dr. {doctor.firstName} {doctor.lastName}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Stethoscope className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-600 font-medium text-sm">
                    {doctor.specialty}
                  </span>
                </div>
              </div>
            </div>

            {/* Clinic Address */}
            <div className="flex items-start space-x-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div className="bg-indigo-600 p-2 rounded-full flex-shrink-0">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-600 mb-1">
                  Clinic Address
                </h4>
                <p className="text-indigo-700 font-bold text-sm">
                  {doctor.clinicAddress || "Address not provided"}
                </p>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                <div className="bg-green-600 p-2 rounded-full flex-shrink-0">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    Date
                  </h4>
                  <p className="text-green-700 font-bold">
                    {format(date, "MMM d, yyyy")}
                  </p>
                  <p className="text-green-600 text-sm">
                    {format(date, "EEEE")}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="bg-purple-600 p-2 rounded-full flex-shrink-0">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    Time
                  </h4>
                  <p className="text-purple-700 font-bold">
                    {format(new Date(`1970-01-01T${time}:00`), "h:mm a")}
                  </p>
                  <p className="text-purple-600 text-sm">Duration: 30 min</p>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800 mb-1">
                    Please Note
                  </h4>
                  <p className="text-yellow-700 text-sm">
                    Please arrive 15 minutes early. Bring a valid ID and
                    insurance card if applicable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-4 px-6 rounded-2xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>Booking...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Confirm Appointment</span>
                </>
              )}
            </button>

            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-2xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="h-5 w-5 mr-2" />
              <span>Cancel</span>
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              You will receive a confirmation email once the appointment is
              booked
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
