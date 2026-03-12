import React, { useState } from 'react';
import { X, Calendar, Clock, AlertCircle } from 'lucide-react';

const RescheduleModal = ({ isOpen, onClose, householdId, headName, initialDate, onUpdate }) => {
    if (!isOpen) return null;

    const [date, setDate] = useState(initialDate ? new Date(initialDate).toISOString().split('T')[0] : '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:5000/api/households/${householdId}/reschedule`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date })
            });

            // Also sync to Appointment collection for Admin view
            await fetch(`http://localhost:5000/api/appointments/reschedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    householdId,
                    date,
                    patient: headName || "Household Head"
                })
            });

            const data = await response.json();

            if (response.ok) {
                onUpdate(data.nextScheduledVisit);
                onClose();
            } else {
                setError(data.message || 'Failed to reschedule');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-[#0d4648] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Calendar size={20} className="text-accent" />
                        Reschedule Visit
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-white/40" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="bg-accent/5 rounded-2xl p-5 border border-accent/10 flex items-start gap-3">
                        <AlertCircle className="text-accent shrink-0 mt-0.5" size={18} />
                        <p className="text-xs text-white/60 leading-relaxed">
                            Rescheduling will notify the assigned health worker. Please choose a date that fits your household's availability.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Select New Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                                <input
                                    required
                                    type="date"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-accent/50 transition-all font-medium"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 bg-accent hover:bg-accent/90 text-[#0d4648] font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(209,240,114,0.2)] disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Confirm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RescheduleModal;
