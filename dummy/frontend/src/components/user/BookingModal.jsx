import React, { useState } from 'react';
import { X, Calendar, Clock, User, Stethoscope } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, householdId, initialData = {} }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        reason: '',
        doctor: initialData.doctor || '',
        hospital: initialData.hospital || ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Sync to Appointment collection for Admin view
            const response = await fetch(`http://localhost:5000/api/appointments/reschedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    householdId: householdId || "GENERAL",
                    date: `${formData.date}T${formData.time}`,
                    patient: formData.name,
                    type: formData.reason || (initialData.doctor ? "Specialist Visit" : "General Consultation")
                })
            });

            if (response.ok) {
                setIsSubmitted(true);
            }
        } catch (error) {
            console.error("Booking error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
                <div className="bg-[#0a0a1a] w-full max-w-md p-8 rounded-2xl border border-white/10 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
                        <Calendar size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-400 mb-6">
                        Your appointment {formData.doctor ? `with ${formData.doctor}` : ''} has been scheduled.
                    </p>
                    <button
                        onClick={() => { onClose(); setIsSubmitted(false); }}
                        className="bg-accent text-[#0a0a1a] px-8 py-3 rounded-xl font-semibold hover:bg-accent/90 transition-all w-full"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#0a0a1a] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl relative flex flex-col max-h-[90vh]">

                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">
                        {initialData.doctor ? 'Book Appointment' : 'Book Free Consultation'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {initialData.hospital && (
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
                            <p className="text-sm text-gray-400">Hospital</p>
                            <p className="font-medium text-white">{initialData.hospital}</p>
                            {initialData.doctor && <p className="text-accent text-sm mt-1">{initialData.doctor}</p>}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm text-gray-400">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 text-gray-500" size={18} />
                            <input
                                required
                                type="text"
                                placeholder="Enter your name"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-10 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3.5 text-gray-500" size={18} />
                                <input
                                    required
                                    type="date"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-10 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors bg-none"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3.5 text-gray-500" size={18} />
                                <input
                                    required
                                    type="time"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-10 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors"
                                    value={formData.time}
                                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-gray-400">Reason for Visit</label>
                        <textarea
                            rows="3"
                            placeholder="Briefly describe your symptoms..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors resize-none"
                            value={formData.reason}
                            onChange={e => setFormData({ ...formData, reason: e.target.value })}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-[#0a0a1a] py-4 rounded-xl font-bold hover:bg-accent/90 transition-all mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
