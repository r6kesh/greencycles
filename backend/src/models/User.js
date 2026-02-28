import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String, // Made optional for OTP login flow initially
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ['customer', 'agent', 'admin'],
            default: 'customer',
        },
        otp: {
            type: String,
        },
        otpExpires: {
            type: Date,
        },
        addresses: [
            {
                street: String,
                city: String,
                state: String,
                zipCode: String,
                lat: Number,
                lng: Number,
            }
        ]
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

export default User;
