import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Truck, Scale, IndianRupee } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="flex flex-col min-h-screen bg-bgDark">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-32 px-4 sm:px-6 lg:px-8">
                {/* Background Details */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2 mb-16 md:mb-0"
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 font-outfit uppercase tracking-tighter">
                            Sell <span className="text-primary text-shadow-glow">Scrap</span><br /> Earn Real <span className="text-secondary text-shadow-glow">Cash.</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 max-w-lg">
                            The smartest, eco-friendly way to dispose of your recyclables in Hyderabad. Schedule a premium doorstep pickup today.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link to={user ? "/book-pickup" : "/login"} className="btn-primary flex items-center justify-center text-lg">
                                Schedule Pickup
                            </Link>
                            <Link to="/pricing" className="bg-transparent border border-white/20 text-white hover:border-primary/50 text-center px-8 py-3 rounded-xl font-medium text-lg transition-all duration-300">
                                Check Prices
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="md:w-1/2 flex justify-center"
                    >
                        <div className="relative w-full max-w-md h-96 glass-card p-10 flex flex-col items-center justify-center">
                            <motion.div
                                className="w-32 h-32 text-primary mb-8"
                                animate={{ y: [0, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                                </svg>
                            </motion.div>
                            <h3 className="text-3xl font-black text-white font-outfit tracking-tight">Fast & Premium</h3>
                            <p className="text-gray-400 mt-2 text-center text-lg">Guaranteed pickup and instant bank transfer.</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-32 bg-bgDark-paper relative z-10 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-20 font-outfit uppercase tracking-wider">How Ecosystem Works</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent -translate-y-1/2 z-0"></div>

                        {[
                            { icon: <Truck size={40} />, title: 'Schedule Pickup', desc: 'Choose a date & location in Nizampet/Miyapur.' },
                            { icon: <Scale size={40} />, title: 'Smart Weighing', desc: 'Agent arrives with certified digital weighing scale.' },
                            { icon: <IndianRupee size={40} />, title: 'Instant Payment', desc: 'Get paid instantly via UPI or bank transfer.' },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="flex flex-col items-center glass-card p-10 group relative z-10 transition-transform duration-300 hover:-translate-y-2"
                            >
                                <div className="w-20 h-20 bg-bgDark border border-primary/30 text-primary rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white font-outfit">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
