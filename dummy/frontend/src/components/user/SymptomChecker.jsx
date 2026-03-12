import React, { useState } from 'react';
import {
    Stethoscope, Loader2, AlertTriangle, ShieldCheck,
    ShieldAlert, ChevronDown, ChevronUp, Activity
} from 'lucide-react';

// All symptoms the ML model understands
const SYMPTOM_OPTIONS = [
    { id: 'fever',        label: 'Fever' },
    { id: 'cough',        label: 'Cough' },
    { id: 'fatigue',      label: 'Fatigue / Tired' },
    { id: 'headache',     label: 'Headache' },
    { id: 'chest pain',   label: 'Chest Pain' },
    { id: 'short breath', label: 'Short Breath' },
    { id: 'nausea',       label: 'Nausea' },
    { id: 'vomiting',     label: 'Vomiting' },
    { id: 'body pain',    label: 'Body Pain' },
    { id: 'sore throat',  label: 'Sore Throat' },
    { id: 'runny nose',   label: 'Runny Nose' },
    { id: 'dizziness',    label: 'Dizziness' },
];

const RISK_STYLES = {
    Low:      { color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20', bar: 'bg-green-500',  label: 'Safe' },
    Mild:     { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', bar: 'bg-yellow-400', label: 'Watch Out' },
    Moderate: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', bar: 'bg-orange-500', label: 'Needs Attention' },
    High:     { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    bar: 'bg-red-500',    label: 'See Doctor Now' },
};

const SymptomChecker = ({ member }) => {
    // If we have a member, pull their existing flag/symptoms as initial state
    const initialSymptoms = React.useMemo(() => {
        if (!member || !member.flag) return [];
        const flags = member.flag.toLowerCase().split(',').map(s => s.trim());
        return SYMPTOM_OPTIONS.filter(o => flags.includes(o.id)).map(o => o.id);
    }, [member]);

    const [age, setAge] = useState(member?.age || '');
    const [selected, setSelected] = useState(initialSymptoms);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAll, setShowAll] = useState(false);

    const toggle = (id) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
        setResult(null); // Clear old results when symptoms change
    };

    const analyze = async () => {
        if (!age || selected.length === 0) {
            setError('Please enter your age and select at least one symptom.');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch('http://localhost:5000/api/predict/symptoms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ age: parseInt(age), symptoms: selected })
            });
            const data = await res.json();
            if (res.ok) {
                setResult(data);
            } else {
                setError(data.error || 'Analysis failed. Please try again.');
            }
        } catch {
            setError('Could not connect to the health service. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setSelected(initialSymptoms);
        if (!member) setAge('');
        setResult(null);
        setError('');
    };

    const rs = result ? (RISK_STYLES[result.risk_level] || RISK_STYLES.Low) : null;

    return (
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Stethoscope size={22} className="text-purple-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">
                        {member ? `${member.name}'s Symptom Checker` : 'Symptom Checker'}
                    </h3>
                    <p className="text-xs text-gray-400">
                        {member 
                            ? 'Update symptoms below to get a real-time health assessment'
                            : 'Select your symptoms to check possible health conditions'}
                    </p>
                </div>
            </div>

            <div className="p-5 space-y-5">
                {/* Age Input (Only show if no member is provided) */}
                {!member && (
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Age</label>
                        <input
                            type="number"
                            min="1"
                            max="120"
                            value={age}
                            onChange={e => setAge(e.target.value)}
                            placeholder="Enter age..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                    </div>
                )}

                {/* Symptom Grid */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        What are you feeling? <span className="text-gray-600 normal-case font-normal">(Tap to select)</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SYMPTOM_OPTIONS.map(sym => {
                            const isActive = selected.includes(sym.id);
                            return (
                                <button
                                    key={sym.id}
                                    onClick={() => toggle(sym.id)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border
                                        ${isActive
                                            ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 ring-1 ring-purple-500/30'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <span className="truncate">{sym.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    {selected.length > 0 && (
                        <p className="text-xs text-purple-400 mt-2">{selected.length} symptom{selected.length > 1 ? 's' : ''} selected</p>
                    )}
                </div>

                {/* Analyze Button */}
                <button
                    onClick={analyze}
                    disabled={loading || !age || selected.length === 0}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white py-3 rounded-xl text-sm font-bold transition-all"
                >
                    {loading
                        ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
                        : <><Activity size={16} /> Check My Health</>
                    }
                </button>

                {error && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                        <AlertTriangle size={16} className="text-red-400 shrink-0" />
                        <p className="text-sm text-red-300">{error}</p>
                    </div>
                )}

                {/* ──── RESULTS ──── */}
                {result && rs && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Main Result Card */}
                        <div className={`rounded-2xl border ${rs.border} ${rs.bg} p-5`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${rs.bg} border ${rs.border}`}>
                                    {result.risk_level === 'Low'
                                        ? <ShieldCheck size={24} className={rs.color} />
                                        : <ShieldAlert size={24} className={rs.color} />
                                    }
                                </div>
                                <div className="flex-1">
                                    <p className={`text-xl font-black ${rs.color}`}>{rs.label}</p>
                                    <p className="text-sm text-gray-300">
                                        {result.predicted_condition === 'Healthy'
                                            ? 'No specific illness detected'
                                            : <>Most likely: <strong className="text-white">{result.predicted_condition}</strong></>
                                        }
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-3xl font-black ${rs.color}`}>{result.risk_score}</p>
                                    <p className="text-[10px] text-gray-500">Risk / 100</p>
                                </div>
                            </div>

                            {/* Risk bar */}
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                <div className={`h-full ${rs.bar} rounded-full transition-all duration-700`} style={{ width: `${result.risk_score}%` }} />
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                                <span>Safe</span><span>Watch Out</span><span>Danger</span>
                            </div>
                        </div>

                        {/* Disease Breakdown */}
                        {result.disease_risks && result.disease_risks.length > 0 && (
                            <div className="space-y-2">
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => setShowAll(p => !p)}
                                >
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Disease Screening Results</p>
                                    {showAll ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                                </div>

                                <div className="bg-white/5 rounded-xl p-3 space-y-2.5">
                                    {(showAll ? result.disease_risks : result.disease_risks.slice(0, 5)).map((dr, i) => {
                                        const pct = dr.probability;
                                        const isHealthy = dr.disease === 'Healthy';
                                        const barColor = isHealthy ? 'bg-green-500'
                                            : pct >= 50 ? 'bg-red-500'
                                            : pct >= 20 ? 'bg-orange-500'
                                            : pct >= 10 ? 'bg-yellow-500'
                                            : 'bg-gray-500';
                                        const textColor = isHealthy ? 'text-green-400'
                                            : pct >= 50 ? 'text-red-400'
                                            : pct >= 20 ? 'text-orange-400'
                                            : pct >= 10 ? 'text-yellow-400'
                                            : 'text-gray-400';
                                        return (
                                            <div key={i}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`text-xs font-semibold ${textColor}`}>{dr.disease}</span>
                                                    <span className={`text-xs font-bold ${textColor}`}>{pct}%</span>
                                                </div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {!showAll && result.disease_risks.length > 5 && (
                                    <button onClick={() => setShowAll(true)} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                                        Show all {result.disease_risks.length} conditions...
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Disclaimer */}
                        <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3">
                            <p className="text-xs text-yellow-400/80 leading-relaxed">
                                <strong>Note:</strong> This is an AI-based screening tool. For accurate diagnosis, please visit your nearest health centre or contact your ASHA worker.
                            </p>
                        </div>

                        {/* Reset */}
                        <button
                            onClick={reset}
                            className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium text-gray-300 hover:text-white transition-all"
                        >
                            Check Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SymptomChecker;
