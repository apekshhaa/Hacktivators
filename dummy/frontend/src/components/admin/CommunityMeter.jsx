import React, { useState, useEffect } from 'react';
import { Trophy, Users, Star, Award, ChevronRight, X, Info, CheckCircle2, ListChecks, HeartPulse } from 'lucide-react';

const CommunityMeter = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        fetchStats();
        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/community/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Error fetching community stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) return null;

    const { percentage, threshold, isUnlocked, completedHouseholds, totalHouseholds } = stats;

    const RewardsModal = () => (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0d4648]/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#2b4548] border border-white/10 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                            <Info size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white leading-tight">Community Progress</h3>
                            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">How it works</p>
                        </div>
                    </div>
                    <button onClick={() => setIsDetailsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X size={20} className="text-white/40" />
                    </button>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Progress Visualizer */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-accent">
                                <Award size={18} />
                                <h4 className="text-sm font-bold uppercase tracking-wider">Community Milestone</h4>
                            </div>
                            <span className="text-white/60 text-xs font-medium">{percentage}% of 73% Goal</span>
                        </div>
                        <div className="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                            <div
                                className="h-full bg-gradient-to-r from-accent/40 to-accent rounded-full transition-all duration-1000 relative"
                                style={{ width: `${Math.min(100, (percentage / 73) * 100)}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </div>
                        </div>
                        <p className="text-[10px] text-white/30 text-center uppercase tracking-[0.2em]">Next Unlock at 71% completion</p>
                    </div>

                    {/* Collective Impact Card */}
                    <div className="bg-gradient-to-br from-accent/10 to-transparent rounded-2xl p-6 border border-accent/20 relative overflow-hidden group">
                        <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent text-[#0d4648] flex items-center justify-center shrink-0 shadow-lg">
                                <HeartPulse size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg mb-1">Collective Impact</h4>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    By participating in daily checkups, our community has reduced emergency response times by <span className="text-accent font-bold">14%</span> this month.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Calculation Explanation */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white/40">
                            <ListChecks size={18} />
                            <h4 className="text-sm font-bold uppercase tracking-wider">How we calculate this</h4>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-400 text-sm">Active Households</span>
                                <span className="text-white font-bold">{completedHouseholds}</span>
                            </div>
                            <div className="h-px bg-white/10 w-full mb-4" />
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Total Community</span>
                                <span className="text-white font-bold">{totalHouseholds}</span>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/10 text-center">
                                <p className="text-accent text-2xl font-bold tracking-tighter">
                                    {percentage}%
                                </p>
                                <p className="text-[10px] text-white/30 mt-1 uppercase tracking-widest leading-none">
                                    ({completedHouseholds} ÷ {totalHouseholds}) × 100
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Rewards List */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-2 text-accent">
                            <Trophy size={18} />
                            <h4 className="text-sm font-bold uppercase tracking-wider">Milestone Rewards</h4>
                        </div>
                        <div className="space-y-3">
                            {[
                                { threshold: 71, reward: "Extra Hygiene Kits for All", icon: <HeartPulse size={16} /> },
                                { threshold: 73, reward: "Community Health Workshop", icon: <Users size={16} /> },
                                { threshold: 75, reward: "Infrastructure Grant", icon: <Award size={16} /> }
                            ].map((item, idx) => (
                                <div key={idx} className={`flex items-center gap-4 p-4 rounded-xl border transition-all
                                    ${percentage >= item.threshold ? 'bg-accent/10 border-accent/20' : 'bg-white/5 border-white/5 opacity-50'}`}>
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                                        ${percentage >= item.threshold ? 'bg-accent text-[#0d4648]' : 'bg-white/10 text-white/40'}`}>
                                        {percentage >= item.threshold ? <CheckCircle2 size={18} /> : item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-accent/60 font-bold uppercase tracking-widest leading-none mb-1">{item.threshold}% Milestone</p>
                                        <p className="text-sm text-white font-medium">{item.reward}</p>
                                    </div>
                                    {percentage >= item.threshold && (
                                        <span className="text-[10px] font-bold text-accent uppercase tracking-tighter">Unlocked</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white/5 border-t border-white/10">
                    <button
                        onClick={() => setIsDetailsOpen(false)}
                        className="w-full py-4 bg-accent hover:bg-accent/90 text-[#0d4648] font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(209,240,114,0.2)]">
                        Got it, thanks!
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-8 hover:bg-white/10 transition-all group relative overflow-hidden">

            {/* Background Accent */}
            <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[100px] opacity-20 transition-colors duration-1000
                ${isUnlocked ? 'bg-accent' : 'bg-blue-500'}`} />

            <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">

                {/* Visual Meter (Radial Style) */}
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background Circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-white/5"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={364.4}
                            strokeDashoffset={364.4 - (percentage / 100) * 364.4}
                            strokeLinecap="round"
                            className={`transition-all duration-1000 ease-out
                                ${isUnlocked ? 'text-accent' : 'text-blue-400'}`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white leading-none">{percentage}%</span>
                        <span className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Health</span>
                    </div>
                </div>

                {/* Info & Rewards */}
                <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                        <Users size={16} className="text-accent" />
                        <h3 className="text-white/60 font-medium text-sm">Community Health Progress</h3>
                    </div>

                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight">
                        {completedHouseholds} of {totalHouseholds} <span className="text-white/30 font-normal">Households Done</span>
                    </h2>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-4">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all
                            ${isUnlocked
                                ? 'bg-accent/20 border-accent/30 text-accent shadow-[0_0_20px_rgba(209,240,114,0.15)]'
                                : 'bg-white/5 border-white/10 text-white/40'}`}>
                            {isUnlocked ? <Trophy size={16} /> : <Star size={16} />}
                            <span className="text-xs font-bold uppercase tracking-widest leading-none">
                                {isUnlocked ? 'Communal Rewards Unlocked' : `Rewards unlock at ${threshold}%`}
                            </span>
                        </div>

                        {!isUnlocked && (
                            <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden shrink-0">
                                <div
                                    className="h-full bg-blue-400/50 transition-all duration-1000"
                                    style={{ width: `${(percentage / threshold) * 100}%` }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Action */}
                <div className="shrink-0 flex items-center gap-3">
                    <button
                        onClick={() => setIsDetailsOpen(true)}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3 rounded-2xl text-xs font-bold transition-all group/btn">
                        View Details
                        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    {isUnlocked && (
                        <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-[#0d4648] animate-bounce-slow shadow-lg">
                            <Award size={24} />
                        </div>
                    )}
                </div>
            </div>
            {isDetailsOpen && <RewardsModal />}
        </div>
    );
};

export default CommunityMeter;
