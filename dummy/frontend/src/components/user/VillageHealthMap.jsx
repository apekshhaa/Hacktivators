import React, { useState, useEffect } from 'react';
import { Home, AlertTriangle, RefreshCw, Loader2, ShieldAlert, X } from 'lucide-react';

// Simulated house positions on a village grid
const HOUSE_POSITIONS = [
    { x: 8, y: 12 }, { x: 28, y: 8 }, { x: 50, y: 10 }, { x: 72, y: 6 }, { x: 90, y: 14 },
    { x: 14, y: 35 }, { x: 38, y: 30 }, { x: 60, y: 32 }, { x: 82, y: 28 },
    { x: 6, y: 58 }, { x: 24, y: 55 }, { x: 46, y: 52 }, { x: 68, y: 56 }, { x: 88, y: 50 },
    { x: 18, y: 78 }, { x: 40, y: 75 }, { x: 62, y: 80 }, { x: 84, y: 74 },
    { x: 10, y: 92 }, { x: 52, y: 90 },
];

const getRiskLevel = (household) => {
    if (!household.familyMembers || household.familyMembers.length === 0) return 'Low';
    const critical = household.familyMembers.filter(m => m.status === 'Critical').length;
    const followUp = household.familyMembers.filter(m => m.status === 'Follow-up').length;
    const hasFlags = household.familyMembers.some(m => m.flag && m.flag.trim() !== '');
    if (critical >= 2) return 'High';
    if (critical >= 1 || (followUp >= 2 && hasFlags)) return 'High';
    if (followUp >= 1 || hasFlags) return 'Moderate';
    return 'Low';
};

const RISK_CONFIG = {
    High: { bg: 'bg-red-500', border: 'border-red-400', glow: 'shadow-[0_0_12px_rgba(239,68,68,0.5)]', text: 'text-red-400', pulse: true },
    Moderate: { bg: 'bg-yellow-500', border: 'border-yellow-400', glow: 'shadow-[0_0_8px_rgba(234,179,8,0.3)]', text: 'text-yellow-400', pulse: false },
    Low: { bg: 'bg-green-500', border: 'border-green-400', glow: '', text: 'text-green-400', pulse: false },
};

const detectOutbreakClusters = (householdsWithPos) => {
    const highRisk = householdsWithPos.filter(h => h.risk === 'High');
    if (highRisk.length < 2) return [];

    const clusters = [];
    const visited = new Set();

    for (let i = 0; i < highRisk.length; i++) {
        if (visited.has(i)) continue;
        const cluster = [highRisk[i]];
        visited.add(i);

        for (let j = i + 1; j < highRisk.length; j++) {
            if (visited.has(j)) continue;
            const dx = highRisk[i].pos.x - highRisk[j].pos.x;
            const dy = highRisk[i].pos.y - highRisk[j].pos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 30) {
                cluster.push(highRisk[j]);
                visited.add(j);
            }
        }

        if (cluster.length >= 2) {
            clusters.push(cluster);
        }
    }
    return clusters;
};

const VillageHealthMap = () => {
    const [households, setHouseholds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(null);
    const [outbreakAlert, setOutbreakAlert] = useState(null);

    const fetchHouseholds = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://localhost:5000/api/households');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();

            const mapped = data.map((h, idx) => ({
                ...h,
                pos: HOUSE_POSITIONS[idx % HOUSE_POSITIONS.length],
                risk: getRiskLevel(h),
            }));

            setHouseholds(mapped);

            // Detect outbreak clusters
            const clusters = detectOutbreakClusters(mapped);
            if (clusters.length > 0) {
                const totalAffected = clusters.reduce((s, c) => s + c.length, 0);
                setOutbreakAlert({
                    clusters: clusters.length,
                    affected: totalAffected,
                    ids: clusters.flat().map(h => h.householdId),
                });
            } else {
                setOutbreakAlert(null);
            }
        } catch (err) {
            setError('Unable to load village data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchHouseholds(); }, []);

    const riskCounts = {
        High: households.filter(h => h.risk === 'High').length,
        Moderate: households.filter(h => h.risk === 'Moderate').length,
        Low: households.filter(h => h.risk === 'Low').length,
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div>
                    <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent inline-block"></span>
                        Village Health Map
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">Live household risk overview</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Legend */}
                    <div className="hidden sm:flex items-center gap-3 text-[10px]">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Low ({riskCounts.Low})</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Moderate ({riskCounts.Moderate})</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> High ({riskCounts.High})</span>
                    </div>
                    <button
                        onClick={fetchHouseholds}
                        className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <RefreshCw size={12} />
                    </button>
                </div>
            </div>

            {/* Outbreak Alert Banner */}
            {outbreakAlert && (
                <div className="mx-4 mt-4 bg-red-500/15 border border-red-500/30 rounded-xl p-3 flex items-start gap-3 animate-pulse">
                    <ShieldAlert size={20} className="text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-red-400">Potential Outbreak Detected</p>
                        <p className="text-xs text-red-300/80 mt-0.5">
                            {outbreakAlert.clusters} cluster(s) of {outbreakAlert.affected} nearby high-risk households found.
                            IDs: {outbreakAlert.ids.join(', ')}
                        </p>
                        <p className="text-[10px] text-red-300/60 mt-1 italic">Immediate investigation recommended.</p>
                    </div>
                </div>
            )}

            {/* Map Area */}
            <div className="relative w-full" style={{ paddingBottom: '50%' }}>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 size={24} className="animate-spin text-accent" />
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-red-400 text-xs">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* Grid roads */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                            <line x1="0" y1="25%" x2="100%" y2="25%" stroke="white" strokeWidth="1" strokeDasharray="4 6" />
                            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="4 6" />
                            <line x1="0" y1="75%" x2="100%" y2="75%" stroke="white" strokeWidth="1" strokeDasharray="4 6" />
                            <line x1="25%" y1="0" x2="25%" y2="100%" stroke="white" strokeWidth="1" strokeDasharray="4 6" />
                            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="1" strokeDasharray="4 6" />
                            <line x1="75%" y1="0" x2="75%" y2="100%" stroke="white" strokeWidth="1" strokeDasharray="4 6" />
                        </svg>

                        {/* Houses */}
                        {households.map((h) => {
                            const rc = RISK_CONFIG[h.risk];
                            return (
                                <button
                                    key={h.householdId}
                                    onClick={() => setSelected(selected?.householdId === h.householdId ? null : h)}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 hover:scale-125 z-10 focus:outline-none`}
                                    style={{ left: `${h.pos.x}%`, top: `${h.pos.y}%` }}
                                    title={h.householdId}
                                >
                                    {/* House icon with risk color */}
                                    <div className={`relative flex flex-col items-center`}>
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${rc.bg}/20 border ${rc.border}/40 ${rc.glow} flex items-center justify-center backdrop-blur-sm ${rc.pulse ? 'animate-pulse' : ''}`}>
                                            <Home size={16} className={rc.text} />
                                        </div>
                                        {/* Label */}
                                        <span className={`text-[7px] sm:text-[8px] mt-0.5 font-mono ${rc.text} opacity-80 whitespace-nowrap`}>
                                            {h.householdId.replace('HH-2024-', '')}
                                        </span>
                                    </div>

                                    {/* Risk dot */}
                                    <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${rc.bg} border border-black/50`}></div>
                                </button>
                            );
                        })}
                    </>
                )}
            </div>

            {/* Selected Household Detail Panel */}
            {selected && (
                <div className="border-t border-white/10 p-4 bg-black/20 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${RISK_CONFIG[selected.risk].bg}`}></div>
                            <h4 className="font-bold text-white text-sm">{selected.householdId}</h4>
                            <span className={`text-xs font-medium ${RISK_CONFIG[selected.risk].text}`}>{selected.risk} Risk</span>
                        </div>
                        <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white"><X size={14} /></button>
                    </div>
                    <p className="text-[11px] text-gray-400 mb-2">Head: {selected.head} · Village: {selected.village}</p>
                    <div className="flex flex-wrap gap-1.5">
                        {selected.familyMembers?.map((m) => (
                            <div key={m._id} className={`text-[10px] px-2 py-1 rounded-lg border ${
                                m.status === 'Critical' ? 'bg-red-500/10 border-red-500/20 text-red-300' :
                                m.status === 'Follow-up' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300' :
                                'bg-green-500/10 border-green-500/20 text-green-300'
                            }`}>
                                {m.name}: {m.status}{m.flag ? ` (${m.flag})` : ''}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VillageHealthMap;
