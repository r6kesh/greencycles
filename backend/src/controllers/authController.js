import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import twilio from 'twilio';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const sendTwilioSms = async (to, body) => {
    try {
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
            console.log(`[Twilio Mock] SMS to ${to}: ${body}`);
            return true;
        }
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
        });
        return true;
    } catch (error) {
        console.error('Twilio SMS Error:', error);
        return false;
    }
};

// @desc    Send OTP to phone number
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOtp = async (req, res) => {
    const { phoneNumber, role } = req.body;
    if (!phoneNumber) return res.status(400).json({ message: 'Phone number is required' });

    try {
        // Generate a 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60000); // 10 mins

        let user = await User.findOne({ phoneNumber });

        if (!user) {
            // Create a pending user without name (will ask during onboarding if needed)
            user = await User.create({
                phoneNumber,
                role: role || 'customer',
                otp,
                otpExpires
            });
        } else {
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        }

        const smsSent = await sendTwilioSms(phoneNumber, `Your GreenCycle OTP is ${otp}. Valid for 10 minutes.`);

        if (!smsSent && process.env.NODE_ENV === 'production') {
            return res.status(500).json({ message: 'Failed to send OTP SMS' });
        }

        res.status(200).json({ message: 'OTP sent successfully', success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
    const { phoneNumber, otp, name } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // For testing purposes, "1234" is a universal master OTP if env is dev
        const isMasterOtp = process.env.NODE_ENV !== 'production' && otp === '1234';

        if (!isMasterOtp && (user.otp !== otp || user.otpExpires < Date.now())) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Clear OTP 
        user.otp = undefined;
        user.otpExpires = undefined;

        // Finalize name if provided during first time login
        if (name && !user.name) {
            user.name = name;
        }
        await user.save();

        res.status(200).json({
            _id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            role: user.role,
            addresses: user.addresses,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
