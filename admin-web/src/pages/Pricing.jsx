import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Pricing = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        try {
            const res = await axios.get(`${API_URL}/prices`);
            setItems(res.data);
        } catch (err) {
            console.error("Failed to fetch prices", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="animate-spin w-12 h-12 text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white font-outfit uppercase tracking-wider mb-2">Scrap Pricing</h1>
                    <p className="text-gray-400">Manage buying and selling rates for the platform.</p>
                </div>
                <button className="btn-primary flex items-center gap-2 py-3">
                    <Plus size={20} /> Add New Item
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-sm font-bold text-gray-400 uppercase tracking-wider">
                                <th className="p-4">Item (Icon)</th>
                                <th className="p-4">Buying Price (Customer)</th>
                                <th className="p-4">Estimated Selling Price</th>
                                <th className="p-4">Profit Margin / Kg</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No scrap items found. Create one.
                                    </td>
                                </tr>
                            ) : items.map((item) => (
                                <tr key={item._id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-bgDark-card flex items-center justify-center text-2xl border border-white/10">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{item.name}</div>
                                            <div className="text-xs text-gray-500">{item.description}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-emerald-400">
                                        ₹{item.buyingPrice || item.pricePerKg} <span className="text-xs text-gray-500 font-normal">/kg</span>
                                    </td>
                                    <td className="p-4 font-bold text-blue-400">
                                        ₹{item.sellingPrice || item.pricePerKg} <span className="text-xs text-gray-500 font-normal">/kg</span>
                                    </td>
                                    <td className="p-4 font-bold text-purple-400">
                                        ₹{((item.sellingPrice || item.pricePerKg) - (item.buyingPrice || item.pricePerKg)).toFixed(2)} <span className="text-xs text-gray-500 font-normal">/kg</span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button className="text-gray-400 hover:text-white p-2 transition-colors bg-white/5 rounded-lg border border-transparent hover:border-white/10">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="text-red-400 hover:text-red-300 p-2 transition-colors bg-red-400/5 rounded-lg border border-transparent hover:border-red-400/20">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mt-6">
                <p className="text-sm text-primary">
                    <strong>Note:</strong> Changes to pricing will be instantly reflected on the Customer Web App and taken into account for all new bookings. Existing bookings will retain the prices locked at the time of creation.
                </p>
            </div>
        </div>
    );
};

export default Pricing;
