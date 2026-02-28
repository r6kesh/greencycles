import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (phone.length === 10) {
            setLoading(true);
            try {
                await axios.post(`${API_URL}/auth/send-otp`, { phoneNumber: phone });
                setStep(2);
            } catch (err) {
                setErrorMsg(err.response?.data?.message || 'Failed to send OTP');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (otp.length === 4) {
            setLoading(true);
            try {
                const res = await axios.post(`${API_URL}/auth/verify-otp`, {
                    phoneNumber: phone,
                    otp,
                    name: name || undefined
                });
                login(res.data);
                navigate('/book-pickup');
            } catch (err) {
                setErrorMsg(err.response?.data?.message || 'Invalid OTP');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-bgDark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-md w-full space-y-8 glass-card p-10 relative z-10">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-black text-white tracking-tight font-outfit">
                        Access <span className="text-primary text-shadow-glow">GreenCycle</span>
                    </h2>
                    <p className="mt-3 text-center text-sm text-gray-400 font-medium">
                        {step === 1 ? 'Enter your mobile number to continue' : 'Enter the OTP sent to your number'}
                    </p>
                </div>

                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm text-center font-medium">
                        {errorMsg}
                    </div>
                )}

                {step === 1 ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="sr-only">Full Name (Optional)</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Full Name (for new users)"
                                    className="input-field"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="sr-only">Phone Number</label>
                                <div className="flex rounded-xl overflow-hidden border border-white/10 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all">
                                    <span className="inline-flex items-center px-4 bg-bgDark-card text-gray-400 font-bold border-r border-white/10">
                                        +91
                                    </span>
                                    <input
                                        id="phone"
                                        required
                                        type="tel"
                                        pattern="[0-9]{10}"
                                        placeholder="Mobile Number"
                                        className="w-full bg-bgDark-card px-4 py-4 text-white placeholder-gray-500 focus:outline-none text-lg font-bold tracking-widest"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={phone.length !== 10 || loading}
                                className="w-full btn-primary flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Send OTP"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
                        <div>
                            <label htmlFor="otp" className="sr-only">OTP</label>
                            <input
                                id="otp"
                                required
                                type="text"
                                maxLength={4}
                                placeholder="• • • •"
                                className="w-full bg-bgDark-card border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-3xl font-black text-center tracking-[1em]"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            />
                        </div>

                        <div className="flex flex-col space-y-4">
                            <button
                                type="submit"
                                disabled={otp.length !== 4 || loading}
                                className="w-full btn-primary flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Verify & Login"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setOtp('');
                                    setErrorMsg('');
                                }}
                                className="text-sm font-semibold text-gray-400 hover:text-primary transition-colors text-center"
                            >
                                Change mobile number
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
