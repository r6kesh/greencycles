import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, ExternalLink, UserPlus, Clock } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const { token } = useAuth();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const [ordersRes, usersRes] = await Promise.all([
                axios.get(`${API_URL}/admin/orders`, config),
                axios.get(`${API_URL}/admin/users`, config)
            ]);

            setOrders(ordersRes.data);
            setAgents(usersRes.data.filter(u => u.role === 'agent'));
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignAgent = async (orderId, agentId) => {
        if (!agentId) return;
        setActionLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${API_URL}/admin/orders/${orderId}`, { agentId, status: 'Assigned' }, config);
            fetchData(); // Refresh list
        } catch (err) {
            console.error("Failed to assign agent", err);
            alert("Failed to assign agent");
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'Assigned': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'On the way': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'Completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
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
            <div>
                <h1 className="text-3xl font-black text-white font-outfit uppercase tracking-wider mb-2">Manage Orders</h1>
                <p className="text-gray-400">View customer pickups, assign agents, and track status.</p>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-sm font-bold text-gray-400 uppercase tracking-wider">
                                <th className="p-4">Customer</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Total Est.</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Agent Assignment</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        No orders found matching criteria.
                                    </td>
                                </tr>
                            ) : orders.map((order) => (
                                <tr key={order._id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{order.customer?.name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">{order.customer?.phoneNumber}</div>
                                        <div className="text-xs text-primary mt-1">{new Date(order.pickupDate).toLocaleDateString()} | {order.pickupTimeSlot}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-300">
                                        {order.address?.city} <br />
                                        <span className="text-gray-500 font-mono">{order.address?.zip}</span>
                                    </td>
                                    <td className="p-4 font-bold text-white">
                                        ₹{order.totalFinalAmount || order.totalEstimatedAmount}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {order.status === 'Completed' || order.status === 'Cancelled' ? (
                                            <div className="text-sm text-gray-400">{order.agent?.name || 'Unassigned'}</div>
                                        ) : (
                                            <select
                                                className="bg-bgDark border border-white/10 rounded-lg px-3 py-2 text-sm text-white w-full outline-none focus:border-primary disabled:opacity-50"
                                                value={order.agent?._id || ''}
                                                onChange={(e) => handleAssignAgent(order._id, e.target.value)}
                                                disabled={actionLoading}
                                            >
                                                <option value="" disabled>Select Agent</option>
                                                {agents.map(agent => (
                                                    <option key={agent._id} value={agent._id}>{agent.name} ({agent.phoneNumber})</option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-primary hover:text-primary-hover p-2 transition-colors">
                                            <ExternalLink size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;
