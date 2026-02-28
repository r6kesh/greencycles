import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Package,
    IndianRupee,
    Settings,
    LogOut,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const navLinks = [
        { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/orders', name: 'Manage Orders', icon: <Package size={20} /> },
        { path: '/users', name: 'Users & Agents', icon: <Users size={20} /> },
        { path: '/pricing', name: 'Scrap Pricing', icon: <IndianRupee size={20} /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const sidebarContent = (
        <div className="flex flex-col h-full bg-bgDark-card border-r border-white/10 w-64 shadow-2xl relative">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-wider">GreenCycle</h2>
                    <p className="text-primary text-sm font-bold tracking-widest mt-0.5">ADMIN PORTAL</p>
                </div>
                <button
                    className="md:hidden text-gray-400 hover:text-white"
                    onClick={() => setMobileOpen(false)}
                >
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                ? 'bg-primary/20 text-primary border border-primary/30'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                            }`
                        }
                    >
                        {link.icon}
                        {link.name}
                    </NavLink>
                ))}
            </div>

            <div className="p-4 border-t border-white/10 space-y-2">
                <button
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-gray-400 hover:bg-white/5 w-full text-left"
                >
                    <Settings size={20} />
                    Settings
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full text-left"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block h-screen fixed inset-y-0 left-0 bg-bgDark-card z-30">
                {sidebarContent}
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-50 md:hidden bg-bgDark-card"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
