import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { registerDoctor } from "../api/doctor";
import {
  Heart,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Stethoscope,
  Shield,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle,
  Award,
  FileText,
} from "lucide-react";

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    specialty: "",
    licenseNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await registerDoctor(formData);

      if (response.success) {
        toast.success(
          "Registration submitted successfully! Awaiting admin approval."
        );

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const errorMessage = response.message || "Registration failed";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const apiErrorMessage = err.message || "An unexpected error occurred";
      setError(apiErrorMessage);
      toast.error(apiErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (password) => {
    if (password.length < 6) return { strength: "weak", color: "bg-red-500" };
    if (password.length < 10)
      return { strength: "medium", color: "bg-yellow-500" };
    return { strength: "strong", color: "bg-green-500" };
  };

  const currentPasswordStrength = passwordStrength(formData.password);

  const specialties = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Internal Medicine",
    "Emergency Medicine",
    "Radiology",
    "Anesthesiology",
    "Psychiatry",
    "Dermatology",
    "Ophthalmology",
    "ENT (Otolaryngology)",
    "Urology",
    "Gynecology",
    "Oncology",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Our Medical Team
          </h1>
          <p className="text-gray-600">
            Register as a healthcare professional with CareConnect
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <Award className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-lg font-semibold text-gray-900">
              Professional Registration
            </span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="First name"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Professional Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter your professional email"
                  required
                />
              </div>
            </div>

            {/* Specialty and License Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="specialty"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Medical Specialty
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Stethoscope className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                    required
                  >
                    <option value="" disabled>
                      Select your specialty
                    </option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="licenseNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Medical License Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter license number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Create a secure password"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${currentPasswordStrength.color}`}
                        style={{
                          width:
                            currentPasswordStrength.strength === "weak"
                              ? "33%"
                              : currentPasswordStrength.strength === "medium"
                              ? "66%"
                              : "100%",
                        }}
                      ></div>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        currentPasswordStrength.strength === "weak"
                          ? "text-red-600"
                          : currentPasswordStrength.strength === "medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {currentPasswordStrength.strength === "weak"
                        ? "Weak"
                        : currentPasswordStrength.strength === "medium"
                        ? "Medium"
                        : "Strong"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Professional Agreement */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex items-center h-5">
                  <input
                    id="professional-terms"
                    name="professional-terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="text-sm">
                  <label htmlFor="professional-terms" className="text-gray-700">
                    I certify that I am a licensed medical professional and
                    agree to the{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    >
                      Professional Code of Conduct
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    >
                      Terms of Service
                    </a>
                  </label>
                </div>
              </div>
            </div>

            {/* Verification Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <strong>Verification Required:</strong> Your credentials will
                  be verified by our medical board before account activation.
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  Submit Registration
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Sign in here
              </NavLink>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Your professional credentials are secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;
