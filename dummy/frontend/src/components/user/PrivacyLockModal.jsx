import React, { useState } from 'react';
import { Lock, Unlock, X, ShieldCheck, AlertCircle } from 'lucide-react';

const PrivacyLockModal = ({ isOpen, onClose, member, householdId, onUpdate }) => {
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState('lock');

    React.useEffect(() => {
        if (member && isOpen) {
            setMode(member.isLocked ? 'unlock' : 'lock');
            setPassword('');
            setError('');
        }
    }, [member, isOpen]);

    const handleAction = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        let endpoint = '';
        let method = 'POST';

        if (mode === 'lock') endpoint = `http://localhost:5000/api/households/${householdId}/members/${member._id}/lock`;
        else if (mode === 'unlock') endpoint = `http://localhost:5000/api/households/${householdId}/members/${member._id}/unlock`;
        else if (mode === 'remove') {
            endpoint = `http://localhost:5000/api/households/${householdId}/members/${member._id}/lock`;
            method = 'DELETE';
        }

        try {
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok) {
                const memberKey = member._id || member.name;
                if (mode === 'unlock') {
                    onUpdate(memberKey, {
                        status: data.status,
                        flag: data.flag,
                        isLocked: false
                    }, mode, member.name);
                } else if (mode === 'lock') {
                    onUpdate(memberKey, {
                        isLocked: true,
                        status: 'Hidden',
                        flag: null
                    }, mode, member.name);
                } else if (mode === 'remove') {
                    onUpdate(memberKey, {
                        isLocked: false,
                        status: 'Healthy',
                        flag: null
                    }, mode, member.name);
                }
                onClose();
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            console.error("Privacy Error:", err);
            setError('Server error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-[#1a1a2e] border border-white/10 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative p-8">

                <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center space-y-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors
                        ${mode === 'lock' ? 'bg-accent/10 text-accent' : 'bg-blue-500/10 text-blue-400'}`}>
                        {mode === 'lock' ? <Lock size={32} /> : <Unlock size={32} />}
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {mode === 'lock' ? 'Set Privacy Password' : 'Enter Privacy Password'}
                        </h2>
                        <p className="text-white/40 text-sm mt-2">
                            {mode === 'lock'
                                ? `Hide health records for ${member.name}.`
                                : `Unlock health records for ${member.name}.`}
                        </p>
                    </div>

                    <form onSubmit={handleAction} className="w-full space-y-4">
                        <div className="space-y-2 text-left">
                            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider pl-1">
                                {mode === 'lock' ? 'Desired Password' : 'Password'}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 transition-all text-center tracking-widest"
                                autoFocus
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                                <AlertCircle size={14} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2
                                ${mode === 'remove' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-accent text-[#0a0a1a] hover:bg-accent/90'}`}
                        >
                            {isSubmitting ? 'Processing...' : (
                                <>
                                    {mode === 'lock' ? <ShieldCheck size={18} /> : (mode === 'remove' ? <X size={18} /> : <Unlock size={18} />)}
                                    {mode === 'lock' ? 'Enable Privacy' : (mode === 'remove' ? 'Remove Privacy Lock' : 'Unlock Record')}
                                </>
                            )}
                        </button>
                    </form>

                    {mode === 'unlock' && (
                        <div className="space-y-4">
                            <p className="text-[10px] text-white/20 px-4 leading-relaxed">
                                Privacy passwords ensure that only the record owner can view sensitive health status and flags.
                            </p>
                            <button
                                onClick={() => setMode('remove')}
                                className="text-xs text-red-400/50 hover:text-red-400 transition-colors underline decoration-red-400/20 underline-offset-4"
                            >
                                Stop using a privacy password
                            </button>
                        </div>
                    )}

                    {mode === 'remove' && (
                        <button
                            onClick={() => setMode('unlock')}
                            className="text-xs text-white/20 hover:text-white transition-colors"
                        >
                            Go back to unlock
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrivacyLockModal;
