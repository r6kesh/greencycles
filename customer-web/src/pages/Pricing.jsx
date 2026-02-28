import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2, TrendingUp, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await axios.get(`${API_URL}/prices`);
                setPrices(res.data);
            } catch (err) {
                console.error("Failed to fetch prices", err);
                setErrorMsg("Could not load latest prices. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchPrices();
    }, [API_URL]);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-80px)] bg-bgDark flex items-center justify-center">
                <Loader2 className="animate-spin w-12 h-12 text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bgDark py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Details */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-white mb-4 font-outfit uppercase tracking-wider"
                    >
                        Live <span className="text-primary text-shadow-glow">Scrap Rates</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        We offer the most competitive & transparent pricing in the market. Rates vary slightly based on actual quality.
                    </motion.p>
                </div>

                {errorMsg && (
                    <div className="mb-10 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center font-medium">
                        {errorMsg}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prices.map((item, idx) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-6 flex items-center justify-between group hover:-translate-y-1 hover:border-primary/50 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-bgDark border border-white/10 rounded-xl flex items-center justify-center text-3xl group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                                    {item.icon || '📦'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white font-outfit">{item.name}</h3>
                                    <p className="text-sm text-gray-400">Per Kg</p>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <span className="font-black text-2xl text-primary flex items-center gap-1">
                                    ₹{item.pricePerKg} <TrendingUp size={16} className="text-primary/70 mb-1" />
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 bg-primary/10 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                    <div className="flex items-start gap-4 text-left">
                        <Info className="text-primary flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h4 className="font-bold text-white text-lg mb-1">Large Quantity?</h4>
                            <p className="text-gray-400 text-sm">Got more than 100kg of scrap? Contact our bulk collection team for special customized pricing and dedicated transport.</p>
                        </div>
                    </div>
                    <Link to="/book-pickup" className="btn-primary whitespace-nowrap flex-shrink-0 w-full sm:w-auto text-center">
                        Schedule Pickup
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Pricing;
