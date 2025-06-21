const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otpController");
const rateLimit = require("express-rate-limit");

// Rate limit for OTP sending (3 requests per email per hour)
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { success: false, message: "Too many OTP requests, please try again later" },
  keyGenerator: (req) => req.body.email.toLowerCase(),
});

// Rate limit for OTP verification (5 attempts per email per hour)
const verifyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: "Too many verification attempts, please try again later" },
  keyGenerator: (req) => req.body.email.toLowerCase(),
});

router.post("/check-email", otpController.checkEmail);
router.post("/send-otp", otpLimiter, otpController.sendOtp);
router.post("/verify-otp", verifyLimiter, otpController.verifyOtp);

module.exports = router;