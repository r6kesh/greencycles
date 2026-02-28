import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Loader2, PackageSearch, Clock, MapPin, IndianRupee, FileText } from 'lucide-react';
import { format } from 'date-fns';

const OrderTracking = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const { token } = useAuth();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`${API_URL}/orders/myorders`, config);
                setOrders(res.data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
                setErrorMsg("Could not load your orders. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [API_URL, token]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'Assigned': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'On the way': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
            case 'Completed': return 'text-primary bg-primary/10 border-primary/20';
            case 'Cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bgDark flex items-center justify-center">
                <Loader2 className="animate-spin w-12 h-12 text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bgDark py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="mb-12 flex items-center gap-4 border-b border-white/10 pb-6">
                    <PackageSearch className="text-primary w-10 h-10" />
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-white font-outfit uppercase tracking-tighter">Your Orders</h1>
                        <p className="text-gray-400">Track current pickups and view history</p>
                    </div>
                </div>

                {errorMsg && (
                    <div className="mb-8 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center font-medium">
                        {errorMsg}
                    </div>
                )}

                {!loading && orders.length === 0 ? (
                    <div className="glass-card p-12 text-center flex flex-col items-center">
                        <FileText className="w-16 h-16 text-gray-600 mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">No Orders Yet</h3>
                        <p className="text-gray-400 mb-6">You haven't scheduled any scrap pickups yet.</p>
                        <a href="/book-pickup" className="btn-primary">Schedule a Pickup</a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence>
                            {orders.map((order, idx) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass-card overflow-hidden group"
                                >
                                    {/* Order Header */}
                                    <div className="bg-white/5 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-bgDark border border-white/10 rounded-lg flex items-center justify-center text-gray-400 font-medium text-xs">
                                                ID
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white font-mono tracking-wider">#{order._id.slice(-6).toUpperCase()}</p>
                                                <p className="text-xs text-gray-500">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full border text-sm font-bold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                            <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                                            {order.status}
                                        </div>
                                    </div>

                                    {/* Order Body */}
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider h-auto flex items-center gap-2">
                                                <Clock size={16} /> Pickup Details
                                            </h4>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3 border border-white/5 p-3 rounded-xl bg-bgDark-card/50">
                                                    <MapPin className="text-primary mt-0.5" size={18} />
                                                    <div>
                                                        <p className="text-sm text-gray-400 mb-1">Address</p>
                                                        <p className="text-white text-sm font-medium">{order.address?.street}, {order.address?.city}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 border border-white/5 p-3 rounded-xl bg-bgDark-card/50">
                                                    <Calendar className="text-primary mt-0.5" size={18} />
                                                    <div>
                                                        <p className="text-sm text-gray-400 mb-1">Scheduled Time</p>
                                                        <p className="text-white text-sm font-medium">{order.pickupTimeSlot}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider h-auto flex items-center gap-2">
                                                <IndianRupee size={16} /> Payment Estimate
                                            </h4>
                                            <div className="bg-bgDark-card/50 border border-white/5 rounded-xl p-4">
                                                <div className="space-y-2 mb-4 border-b border-white/5 pb-4">
                                                    {order.items.map((item, i) => (
                                                        <div key={i} className="flex justify-between text-sm">
                                                            <span className="text-gray-400">{item.item.name} <span className="text-gray-600 text-xs ml-1">x {item.quantity}kg</span></span>
                                                            <span className="text-gray-300 font-medium">₹{item.item.pricePerKg * item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-white">Estimated Value</span>
                                                    <span className="font-black text-xl text-primary">₹{order.estimatedAmount}</span>
                                                </div>
                                                {order.finalAmount && order.status === 'Completed' && (
                                                    <div className="mt-3 flex justify-between items-center bg-primary/10 text-primary p-2 rounded-lg border border-primary/20">
                                                        <span className="font-bold text-sm">Final Amount Paid</span>
                                                        <span className="font-black text-lg">₹{order.finalAmount}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {order.agent && (
                                        <div className="bg-secondary/5 px-6 py-4 flex items-center gap-4 border-t border-secondary/10">
                                            <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-secondary font-bold">
                                                {order.agent.name?.[0] || 'A'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">Agent Assigned: <span className="font-bold">{order.agent.name || 'Agent'}</span></p>
                                                {order.agent.phoneNumber && <p className="text-xs text-secondary">{order.agent.phoneNumber}</p>}
                                            </div>
                                        </div>
                                    )}

                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;
