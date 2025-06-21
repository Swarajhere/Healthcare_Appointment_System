const User = require("../models/userModel");
const Otp = require("../models/otpModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const validator = require("validator");

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

exports.checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }
        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if (user) {
            return res.status(400).json({ success: true, available: false, message: "Email is already registered" });
        }
        res.json({ success: true, available: true, message: "Email is available" });
    } catch (error) {
        console.error("Check email error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }
        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if (user) {
            return res.status(400).json({ success: false, message: "Email is already registered" });
        }
        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 3 * 60 * 1000); 

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await Otp.create({
            email: normalizedEmail,
            otp: hashedOtp,
            expiresAt,
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: normalizedEmail,
            subject: "CareConnect OTP Verification",
            text: `Your OTP for CareConnect registration is ${otp}. It is valid for 3 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: "OTP sent to your email" });
    } catch (error) {
        console.error("Send OTP error:", error);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !validator.isEmail(email) || !otp || otp.length !== 6) {
            return res.status(400).json({ success: false, message: "Invalid email or OTP" });
        }
        const normalizedEmail = email.toLowerCase();
        const otpRecord = await Otp.findOne({
            email: normalizedEmail,
            expiresAt: { $gt: new Date() },
            used: false,
        }).sort({ createdAt: -1 });
        if (!otpRecord) {
            return res.status(400).json({ success: true, verified: false, message: "Invalid or expired OTP" });
        }
        const isMatch = await bcrypt.compare(otp, otpRecord.otp);
        if (!isMatch) {
            return res.status(400).json({ success: true, verified: false, message: "Invalid OTP" });
        }
        otpRecord.used = true;
        await otpRecord.save();
        res.json({ success: true, verified: true, message: "OTP verified" });
    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};