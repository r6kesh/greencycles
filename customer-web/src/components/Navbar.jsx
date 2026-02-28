import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed w-full z-50 bg-bgDark-paper/80 backdrop-blur-md border-b border-white/10 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
                            <span className="text-primary">Green</span>Cycle<span className="text-primary text-4xl leading-none">.</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link to="/" className="text-gray-300 hover:text-primary font-medium transition-colors">Home</Link>
                        <Link to="/pricing" className="text-gray-300 hover:text-primary font-medium transition-colors">Scrap Prices</Link>
                        {user ? (
                            <div className="flex items-center space-x-6">
                                <Link to="/orders" className="text-gray-300 hover:text-primary font-medium transition-colors">My Orders</Link>
                                <Link to="/book-pickup" className="btn-primary">
                                    Book Pickup
                                </Link>
                                <button onClick={handleLogout} className="text-gray-300 font-medium hover:text-red-400 transition-colors">Logout</button>
                            </div>
                        ) : (
                            <Link to="/login" className="border border-primary text-primary px-6 py-2.5 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white hover:text-primary focus:outline-none">
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-bgDark-card border-b border-white/10 px-4 pt-2 pb-6 space-y-4">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-300 hover:text-primary font-medium text-lg pt-4">Home</Link>
                    <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-300 hover:text-primary font-medium text-lg">Scrap Prices</Link>
                    {user ? (
                        <div className="flex flex-col space-y-4 pt-4 border-t border-white/10">
                            <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-300 hover:text-primary font-medium text-lg">My Orders</Link>
                            <Link to="/book-pickup" onClick={() => setIsMobileMenuOpen(false)} className="bg-primary text-center text-white px-5 py-3 rounded-xl font-semibold">
                                Book Pickup
                            </Link>
                            <button onClick={handleLogout} className="text-left text-gray-300 font-medium hover:text-red-400 pt-2">Logout</button>
                        </div>
                    ) : (
                        <div className="pt-4 border-t border-white/10 text-center">
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full border border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors">
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
