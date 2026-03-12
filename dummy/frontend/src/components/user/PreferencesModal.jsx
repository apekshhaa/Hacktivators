import React, { useState, useEffect } from 'react';
import { X, Phone, MessageSquare, UserCheck, Save, CheckCircle2, XCircle } from 'lucide-react';

const PreferencesModal = ({ isOpen, onClose, householdId }) => {
    const [preference, setPreference] = useState('Text');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen && householdId) {
            fetchHouseholdPreference();
        }
    }, [isOpen, householdId]);

    const fetchHouseholdPreference = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/households/${householdId}`);
            if (response.ok) {
                const data = await response.json();
                setPreference(data.reminderPreference || 'Text');
            }
        } catch (error) {
            console.error("Error fetching preferences:", error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch(`http://localhost:5000/api/households/${householdId}/preferences`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ preference })
            });

            if (response.ok) {
                setMessage({ text: 'Preferences saved successfully!', type: 'success' });
                setTimeout(onClose, 1500);
            } else {
                setMessage({ text: 'Failed to save preferences.', type: 'error' });
            }
        } catch (error) {
            console.error("Error saving preferences:", error);
            setMessage('Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a0a1a]/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#1a1a2e] border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">

                {/* Header */}
                <div className="px-8 pt-8 pb-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold text-white">Preferences</h2>
                        <p className="text-white/40 text-sm">Routine Checkup Reminders</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-4">
                    <div className="space-y-3">
                        {[
                            { id: 'Call', label: 'Phone Call', icon: Phone, desc: 'A health worker will call you daily.' },
                            { id: 'Text', label: 'SMS / WhatsApp', icon: MessageSquare, desc: 'Automated text alerts to your phone.' },
                            { id: 'In-person', label: 'In-Person Visit', icon: UserCheck, desc: 'A worker will visit your home.' }
                        ].map((option) => (
                            <label
                                key={option.id}
                                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group
                                    ${preference === option.id
                                        ? 'bg-accent/10 border-accent/30 text-accent'
                                        : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'}`}
                            >
                                <input
                                    type="radio"
                                    name="preference"
                                    className="hidden"
                                    checked={preference === option.id}
                                    onChange={() => setPreference(option.id)}
                                />
                                <div className={`p-3 rounded-xl transition-colors
                                    ${preference === option.id ? 'bg-accent text-[#0a0a1a]' : 'bg-white/5 text-white/40 group-hover:text-white'}`}>
                                    <option.icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium">{option.label}</div>
                                    <div className="text-xs opacity-60 mt-0.5">{option.desc}</div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                    ${preference === option.id ? 'border-accent bg-accent' : 'border-white/10'}`}>
                                    {preference === option.id && <div className="w-2 h-2 bg-[#0a0a1a] rounded-full" />}
                                </div>
                            </label>
                        ))}
                    </div>

                    {message && (
                        <div className={`flex items-center justify-center gap-2 text-sm font-medium ${message.type === 'success' ? 'text-accent' : 'text-red-400'}`}>
                            {message.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                            {message.text}
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 text-[#0a0a1a] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save size={18} />
                                Save Preferences
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreferencesModal;
