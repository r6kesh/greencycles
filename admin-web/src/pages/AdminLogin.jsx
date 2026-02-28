import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (!phone || phone.length < 10) {
            return setErrorMsg('Please enter a valid phone number');
        }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/auth/send-otp`, { phoneNumber: `+91${phone}` });
            setStep(2);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (!otp || otp.length < 4) {
            return setErrorMsg('Please enter the valid OTP');
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/verify-otp`, {
                phoneNumber: `+91${phone}`,
                otp
            });

            if (res.data.user.role !== 'admin') {
                setErrorMsg('Unauthorized access. Admin only.');
                return;
            }

            login(res.data.user, res.data.token);
            navigate('/');
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bgDark flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <ShieldCheck size={40} className="text-primary" />
                    </div>

                    <h1 className="text-3xl font-black text-white font-outfit mb-2 text-center tracking-wide">Admin Portal</h1>
                    <p className="text-gray-400 text-center mb-8">Secure access for GreenCycle staff</p>

                    {errorMsg && (
                        <div className="w-full mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center text-sm font-medium">
                            {errorMsg}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="w-full space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Admin Phone Number</label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-white/10 bg-bgDark-paper text-gray-400 font-medium">
                                        +91
                                    </span>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-3 rounded-r-xl bg-bgDark border border-white/10 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-white placeholder-gray-600 font-mono tracking-wider"
                                        placeholder="0000000000"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                        maxLength="10"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary flex justify-center items-center py-4"
                            >
                                {loading ? <Loader2 className="animate-spin" size={24} /> : 'Request Access'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="w-full space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Secure OTP Code</label>
                                <div className="flex justify-between gap-2 max-w-[280px] mx-auto">
                                    <input
                                        type="text"
                                        className="w-full text-center px-4 py-3 rounded-xl bg-bgDark border border-white/10 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-white font-mono tracking-[0.5em] text-2xl"
                                        placeholder="••••"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                        maxLength="6"
                                        autoFocus
                                    />
                                </div>
                                <p className="text-center text-gray-500 text-xs mt-4">Code sent to +91 {phone}</p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary flex justify-center items-center py-4 gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : <>Verify & Login <ArrowRight size={20} /></>}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-gray-400 hover:text-white font-medium text-sm transition-colors py-2"
                                >
                                    Use a different number
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
