import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { registerUser, checkEmail, sendOtp, verifyOtp } from "../api/register";
import { toast } from "react-hot-toast";
import {
  Heart,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Users,
  ArrowRight,
  Shield,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import debounce from "lodash.debounce";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    gender: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState("idle"); // idle, format_invalid, checking, available, otp_sent, otp_verifying, otp_verified, otp_invalid
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpTimer, setOtpTimer] = useState(180); 
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "email") {
      setEmailStatus("idle");
      setOtp("");
      setOtpError("");
      setOtpTimer(180);
    }
  };

  const checkEmailAvailability = useCallback(
    debounce(async (email) => {
      if (!emailRegex.test(email)) {
        setEmailStatus("format_invalid");
        return;
      }
      setEmailStatus("checking");
      try {
        const response = await checkEmail({ email: email.toLowerCase() });
        if (response.success && response.available) {
          setEmailStatus("available");
        } else {
          setEmailStatus("format_invalid");
          setError(response.message || "Email is already registered");
        }
      } catch (err) {
        setEmailStatus("format_invalid");
        setError("Failed to check email availability");
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (formData.email && emailStatus === "idle") {
      checkEmailAvailability(formData.email);
    }
  }, [formData.email, emailStatus, checkEmailAvailability]);

  useEffect(() => {
    let timer;
    if (emailStatus === "otp_sent" && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [emailStatus, otpTimer]);

  const handleVerifyEmail = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await sendOtp({ email: formData.email.toLowerCase() });
      if (response.success) {
        setEmailStatus("otp_sent");
        setOtpTimer(180);
        toast.success("OTP sent to your email");
      } else {
        setEmailStatus("format_invalid");
        setError(response.message || "Failed to send OTP");
        toast.error(response.message || "Failed to send OTP");
      }
    } catch (err) {
      setEmailStatus("format_invalid");
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setOtpError("");
    try {
      const response = await verifyOtp({ email: formData.email.toLowerCase(), otp });
      if (response.success && response.verified) {
        setEmailStatus("otp_verified");
        toast.success("Email verified successfully");
      } else {
        setEmailStatus("otp_invalid");
        setOtpError(response.message || "Invalid or expired OTP");
        toast.error(response.message || "Invalid or expired OTP");
      }
    } catch (err) {
      setEmailStatus("otp_invalid");
      setOtpError("Failed to verify OTP");
      toast.error("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtp("");
    setOtpError("");
    setOtpTimer(180);
    await handleVerifyEmail();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailStatus !== "otp_verified") {
      setError("Please verify your email with OTP");
      toast.error("Please verify your email with OTP");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await registerUser(formData);
      if (response.success) {
        toast.success(response.message || "Registration successful");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.message || "Registration failed");
        toast.error(response.message || "Registration failed");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (password) => {
    if (password.length < 6) return { strength: "weak", color: "bg-red-500" };
    if (password.length < 10) return { strength: "medium", color: "bg-yellow-500" };
    return { strength: "strong", color: "bg-green-500" };
  };

  const currentPasswordStrength = passwordStrength(formData.password);

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join CareConnect
          </h1>
          <p className="text-gray-600">
            Create your account to access healthcare services
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <Shield className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-lg font-semibold text-gray-900">
              Create Account
            </span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
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

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
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
                  placeholder="Enter your email address"
                  required
                  disabled={emailStatus === "otp_verified"}
                />
                {emailStatus === "otp_verified" && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {emailStatus === "format_invalid" && (
                <p className="mt-2 text-sm text-red-600">Please enter a valid email address</p>
              )}
              {emailStatus === "checking" && (
                <p className="mt-2 text-sm text-gray-600 flex items-center">
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Checking email...
                </p>
              )}
              {emailStatus === "available" && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      "Verify Email"
                    )}
                  </button>
                </div>
              )}
              {emailStatus === "otp_sent" && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="6-digit OTP"
                      maxLength="6"
                    />
                    {otpError && (
                      <p className="mt-2 text-sm text-red-600">{otpError}</p>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={loading || otp.length !== 6}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin inline" />
                      ) : (
                        "Verify OTP"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={otpTimer > 0 || loading}
                      className="text-blue-600 hover:text-blue-700 text-sm disabled:text-gray-400"
                    >
                      {otpTimer > 0 ? `Resend OTP in ${formatTimer(otpTimer)}` : "Resend OTP"}
                    </button>
                  </div>
                </div>
              )}
              {emailStatus === "otp_verified" && (
                <p className="mt-2 text-sm text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Email verified
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Your age"
                    required
                    min="1"
                    max="120"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                    required
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                  placeholder="Create a strong password"
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

            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || emailStatus !== "otp_verified"}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Sign in here
              </NavLink>
            </p>
            <p>
              Are you a doctor?{" "}
              <NavLink
                to="/doctor-register"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Register as a doctor
              </NavLink>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Your personal information is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;