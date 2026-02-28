import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, UserCircle, Shield, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'customer', 'agent'
    const { token } = useAuth();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`${API_URL}/admin/users`, config);
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch users", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [API_URL, token]);

    const filteredUsers = users.filter(user => {
        if (filter === 'all') return true;
        return user.role === filter;
    });

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
                    <h1 className="text-3xl font-black text-white font-outfit uppercase tracking-wider mb-2">Users & Agents</h1>
                    <p className="text-gray-400">Manage GreenCycle registered platform users.</p>
                </div>

                <div className="flex bg-bgDark-card border border-white/10 rounded-xl p-1">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('customer')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'customer' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Customers
                    </button>
                    <button
                        onClick={() => setFilter('agent')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'agent' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Agents
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-gray-500 glass-card">
                        No users found in this category.
                    </div>
                ) : filteredUsers.map((user, idx) => (
                    <motion.div
                        key={user._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card p-6 border-t-4 border-t-transparent hover:border-t-primary transition-all duration-300 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/10 transition-all"></div>

                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-bgDark-card border border-white/10 flex items-center justify-center text-gray-400">
                                    <UserCircle size={28} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{user.name || 'No Name Set'}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${user.role === 'agent' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {user.role === 'agent' && <Shield className="text-indigo-400 opacity-50" size={20} />}
                        </div>

                        <div className="space-y-3 relative z-10 mt-6 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Phone size={16} className="text-gray-500" />
                                {user.phoneNumber}
                            </div>
                            {user.addresses && user.addresses.length > 0 && (
                                <div className="flex items-start gap-3 text-sm text-gray-400">
                                    <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                                    <span>
                                        {user.addresses[0].city} (ZIP: {user.addresses[0].zip})
                                        {user.addresses.length > 1 && <span className="text-xs text-primary block mt-0.5">+{user.addresses.length - 1} more locations</span>}
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Users;
