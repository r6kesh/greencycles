import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    TrendingUp,
    Package,
    IndianRupee,
    Clock,
    CheckCircle,
    Loader2
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const { token } = useAuth();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`${API_URL}/admin/stats`, config);
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
                setErrorMsg("Could not load dashboard statistics.");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [API_URL, token]);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="animate-spin w-12 h-12 text-primary" />
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-6 rounded-xl text-center font-medium">
                {errorMsg}
            </div>
        );
    }

    // Mock data for the chart since backend doesn't provide time-series data yet
    const monthlyData = [
        { name: 'Jan', revenue: 4000, profit: 2400 },
        { name: 'Feb', revenue: 3000, profit: 1398 },
        { name: 'Mar', revenue: 2000, profit: 9800 },
        { name: 'Apr', revenue: 2780, profit: 3908 },
        { name: 'May', revenue: 1890, profit: 4800 },
        { name: 'Jun', revenue: 2390, profit: 3800 },
    ];

    const statCards = [
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: <IndianRupee size={24} className="text-primary" />,
            color: 'bg-primary/20 border-primary/30 text-primary'
        },
        {
            title: 'Total Profit',
            value: `₹${stats.totalProfit.toLocaleString()}`,
            icon: <TrendingUp size={24} className="text-blue-400" />,
            color: 'bg-blue-400/20 border-blue-400/30 text-blue-400'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders.toLocaleString(),
            icon: <Package size={24} className="text-secondary" />,
            color: 'bg-secondary/20 border-secondary/30 text-secondary'
        },
        {
            title: 'Completed Pickups',
            value: stats.completedOrders.toLocaleString(),
            icon: <CheckCircle size={24} className="text-emerald-400" />,
            color: 'bg-emerald-400/20 border-emerald-400/30 text-emerald-400'
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-black text-white font-outfit uppercase tracking-wider mb-2">Overview</h1>
                <p className="text-gray-400">GreenCycle Platform Metrics & Financials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 flex flex-row items-center justify-between group hover:-translate-y-1 transition-all duration-300"
                    >
                        <div>
                            <p className="text-sm text-gray-400 font-medium mb-1">{card.title}</p>
                            <h3 className="text-3xl font-black text-white font-outfit">{card.value}</h3>
                        </div>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors ${card.color}`}>
                            {card.icon}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 lg:col-span-2"
                >
                    <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Revenue vs Profit (Mock Data)</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={monthlyData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="profit" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6 flex flex-col justify-between"
                >
                    <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Operational Status</h2>
                    <div className="flex-1 flex flex-col justify-center space-y-6">
                        <div className="bg-bgDark-card border border-white/10 rounded-xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[40px] group-hover:bg-yellow-500/20 transition-all"></div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 font-medium mb-1">Pending Orders</p>
                                    <h3 className="text-4xl font-black text-yellow-500 font-outfit">{stats.pendingOrders}</h3>
                                </div>
                                <Clock size={40} className="text-yellow-500/50" />
                            </div>
                        </div>

                        <ul className="space-y-4">
                            <li className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-gray-400">Agents Active</span>
                                <span className="text-white font-bold">5</span>
                            </li>
                            <li className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-gray-400">Total Customers</span>
                                <span className="text-white font-bold">120+</span>
                            </li>
                            <li className="flex items-center justify-between text-sm pb-2">
                                <span className="text-gray-400">Platform Health</span>
                                <span className="text-primary font-bold flex items-center gap-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                    </span>
                                    Online
                                </span>
                            </li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
