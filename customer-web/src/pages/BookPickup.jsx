import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, Package, MapPin, Calendar, CreditCard } from 'lucide-react';

const BookPickup = () => {
    const [scrapTypes, setScrapTypes] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [step, setStep] = useState(1);
    const [address, setAddress] = useState({ street: '', city: '', zip: '' });
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await axios.get(`${API_URL}/prices`);
                setScrapTypes(res.data);
            } catch (err) {
                console.error("Failed to fetch prices", err);
                setErrorMsg("Could not load scrap prices. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchPrices();
    }, [API_URL]);

    const handleSelectItem = (item) => {
        setSelectedItems(prev => {
            const current = prev[item._id] || 0;
            return { ...prev, [item._id]: { ...item, quantity: current + 5 } };
        });
    };

    const handleRemoveItem = (item) => {
        setSelectedItems(prev => {
            const current = prev[item._id]?.quantity || 0;
            if (current <= 5) {
                const newState = { ...prev };
                delete newState[item._id];
                return newState;
            }
            return { ...prev, [item._id]: { ...item, quantity: current - 5 } };
        });
    };

    const getTotalEstimate = () => {
        return Object.values(selectedItems).reduce((total, item) => {
            return total + (item.pricePerKg * item.quantity);
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg('');

        try {
            const itemsArray = Object.values(selectedItems).map(item => ({
                item: item._id,
                quantity: item.quantity
            }));

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.post(`${API_URL}/orders`, {
                items: itemsArray,
                address,
                pickupTimeSlot: `${date} ${timeSlot}`
            }, config);

            setStep(4); // Success step
            setTimeout(() => {
                navigate('/');
            }, 3000);

        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to schedule pickup');
            setSubmitting(false);
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
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="mb-12 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
                    <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-primary' : 'text-gray-500'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? 'border-primary bg-primary/20 text-primary' : 'border-gray-500 bg-transparent text-gray-500'}`}>1</div>
                        <span className="font-bold hidden sm:block">Select Scrap</span>
                    </div>
                    <div className="w-16 h-0.5 bg-gray-700 hidden md:block"></div>
                    <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-primary' : 'text-gray-500'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= 2 ? 'border-primary bg-primary/20 text-primary' : 'border-gray-500 bg-transparent text-gray-500'}`}>2</div>
                        <span className="font-bold hidden sm:block">Address & Time</span>
                    </div>
                    <div className="w-16 h-0.5 bg-gray-700 hidden md:block"></div>
                    <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-primary' : 'text-gray-500'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= 3 ? 'border-primary bg-primary/20 text-primary' : 'border-gray-500 bg-transparent text-gray-500'}`}>3</div>
                        <span className="font-bold hidden sm:block">Confirm</span>
                    </div>
                </div>

                {errorMsg && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center font-medium">
                        {errorMsg}
                    </div>
                )}

                <div className="glass-card overflow-hidden">

                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 md:p-12">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 font-outfit">What are you selling?</h2>
                            <p className="text-gray-400 mb-10 text-lg">Select the scrap items and approximate quantity (Kg)</p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {scrapTypes.map(item => (
                                    <div key={item._id} className={`p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ${selectedItems[item._id] ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-white/5 bg-bgDark-card hover:border-primary/30 cursor-pointer'}`} onClick={() => !selectedItems[item._id] && handleSelectItem(item)}>
                                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon || '📦'}</div>
                                        <div className="font-bold text-white text-lg">{item.name}</div>
                                        <div className="text-sm text-primary font-medium mb-6">₹{item.pricePerKg}/kg</div>

                                        {selectedItems[item._id] ? (
                                            <div className="flex items-center justify-between bg-bgDark rounded-xl border border-primary/30 p-1.5" onClick={e => e.stopPropagation()}>
                                                <button type="button" className="w-8 h-8 rounded-lg bg-gray-800 text-gray-300 font-bold hover:bg-red-500/20 hover:text-red-400 transition-colors" onClick={() => handleRemoveItem(item)}>-</button>
                                                <span className="font-bold text-primary">{selectedItems[item._id].quantity} kg</span>
                                                <button type="button" className="w-8 h-8 rounded-lg bg-primary/20 text-primary font-bold hover:bg-primary hover:text-white transition-colors" onClick={() => handleSelectItem(item)}>+</button>
                                            </div>
                                        ) : (
                                            <div className="text-white font-bold text-sm bg-white/5 py-3 rounded-xl text-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">Add Item +</div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <p className="text-gray-400 font-medium mb-1">Estimated Value</p>
                                    <p className="text-4xl font-black text-white font-outfit">₹{getTotalEstimate()}</p>
                                </div>
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={Object.keys(selectedItems).length === 0}
                                    className="w-full md:w-auto btn-primary px-10 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continue to Address
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 md:p-12">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 font-outfit">Where and When?</h2>
                            <p className="text-gray-400 mb-10 text-lg">Provide your address and preferred pickup time</p>

                            <div className="space-y-8 max-w-xl mx-auto md:mx-0">
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4"><MapPin className="text-primary" /> Address Details</h3>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2">Street Address</label>
                                        <input type="text" className="input-field py-4" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} placeholder="House/Flat No, Apartment, Street" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-400 mb-2">City</label>
                                            <input type="text" className="input-field py-4" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} placeholder="City (e.g., Hyderabad)" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-400 mb-2">PIN Code</label>
                                            <input type="text" className="input-field py-4" value={address.zip} onChange={e => setAddress({ ...address, zip: e.target.value })} placeholder="500049, 500050, 500090" />
                                        </div>
                                    </div>
                                    {address.zip.length >= 6 && !['500049', '500050', '500090'].includes(address.zip) && (
                                        <p className="text-red-400 text-sm mt-1">Currently, we only serve Miyapur (500049, 500050) and Nizampet (500090).</p>
                                    )}
                                </div>

                                <div className="space-y-6 pt-4">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4"><Calendar className="text-primary" /> Scheduling</h3>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2">Preferred Date</label>
                                        <input type="date" className="input-field py-4 [color-scheme:dark]" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2">Preferred Time Slot</label>
                                        <select className="input-field py-4 appearance-none" value={timeSlot} onChange={e => setTimeSlot(e.target.value)}>
                                            <option value="" disabled className="text-gray-500">Select a time slot</option>
                                            <option value="09:00 AM - 12:00 PM" className="text-bgDark-card">09:00 AM - 12:00 PM</option>
                                            <option value="12:00 PM - 03:00 PM" className="text-bgDark-card">12:00 PM - 03:00 PM</option>
                                            <option value="03:00 PM - 06:00 PM" className="text-bgDark-card">03:00 PM - 06:00 PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                                <button type="button" onClick={() => setStep(1)} className="text-gray-400 font-bold hover:text-white transition-colors">Back</button>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={!address.street || !address.city || !['500049', '500050', '500090'].includes(address.zip) || !date || !timeSlot}
                                    className="btn-primary px-10 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Review Order
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 md:p-12">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-8 font-outfit">Confirm Booking</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="bg-bgDark-card/50 rounded-2xl p-6 border border-white/5">
                                    <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2"><Package className="text-primary" /> Scrap Items</h3>
                                    <div className="space-y-4">
                                        {Object.values(selectedItems).map((item) => (
                                            <div key={item._id} className="flex justify-between items-center group">
                                                <span className="text-gray-400 font-medium group-hover:text-gray-300 transition-colors">{item.icon} {item.name} ({item.quantity}kg)</span>
                                                <span className="font-bold text-white">₹{item.pricePerKg * item.quantity}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
                                            <span className="text-white font-bold text-lg">Estimated Total</span>
                                            <span className="font-black text-3xl text-primary">₹{getTotalEstimate()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-bgDark-card/50 rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2"><MapPin className="text-primary" /> Pickup Details</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Address</p>
                                                <p className="text-white font-medium">{address.street}, {address.city} - {address.zip}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Scheduled For</p>
                                                <p className="text-white font-medium">{date} <span className="text-primary">|</span> {timeSlot}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 p-4 bg-primary/10 rounded-xl border border-primary/20 flex items-start gap-3">
                                        <CreditCard className="text-primary flex-shrink-0 mt-0.5" size={20} />
                                        <p className="text-sm text-gray-300">Payment will be settled instantly via UPI or Bank Transfer after accurate weighing by our agent.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
                                <button type="button" onClick={() => setStep(2)} className="text-gray-400 font-bold hover:text-white transition-colors" disabled={submitting}>Back</button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="btn-primary px-10 py-4 text-lg flex items-center gap-2 disabled:opacity-50"
                                >
                                    {submitting ? <><Loader2 className="animate-spin" /> Confirming...</> : 'Confirm Booking'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-16 flex flex-col items-center justify-center text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                            >
                                <CheckCircle size={48} className="text-white" />
                            </motion.div>
                            <h2 className="text-4xl font-black text-white mb-4 font-outfit">Pickup Scheduled!</h2>
                            <p className="text-xl text-gray-400 max-w-md mx-auto mb-2">
                                Your eco-friendly effort has been registered.
                            </p>
                            <p className="text-gray-500">
                                An agent will be assigned to your location shortly. Redirecting you home...
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookPickup;
