import React, { useState, useEffect } from 'react';
import { Search, Save, ArrowLeft, Check, X, RefreshCw, Trash2, Edit2, Lock, Unlock, Zap, Gem, Calendar, Award, CheckCircle, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRewards, updateRewards } from '../../services/api';

const DEFAULT_BADGES = [
    { id: 1, name: 'Regular Checkup Family', desc: '10+ checkups completed', icon: '👨‍👩‍👧‍👦', unlocked: false },
    { id: 2, name: 'Health Champion', desc: 'Maintained 6-month streak', icon: '💪', unlocked: false },
    { id: 3, name: 'Vaccination Hero', desc: 'All family vaccinated', icon: '💉', unlocked: false },
    { id: 4, name: 'Perfect Attendance', desc: 'No missed appointments', icon: '✨', unlocked: false },
];

const DEFAULT_BENEFITS = [
    { id: 1, name: 'Monthly Ration Kit', points: 400, eligible: false },
    { id: 2, name: 'Free Medicine Voucher', points: 300, eligible: false },
    { id: 3, name: 'Health Insurance Subsidy', points: 600, eligible: false },
];

const AdminRewardsPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('HH-2024-1002');
    const [loading, setLoading] = useState(false);
    const [householdId, setHouseholdId] = useState('');

    // State for editable fields
    const [points, setPoints] = useState(0);
    const [streak, setStreak] = useState(0);
    const [badges, setBadges] = useState(DEFAULT_BADGES);

    const [benefits, setBenefits] = useState(DEFAULT_BENEFITS);

    // Derived stats
    const eligibleBenefitsCount = benefits.filter(b => b.eligible).length;
    const earnedBadgesCount = badges.filter(b => b.unlocked).length;

    useEffect(() => {
        // Initial search on load if searchTerm exists
        if (searchTerm) {
            handleSearch();
        }
    }, []);

    const checkBadgeCondition = (badge, pts, strk) => {
        switch (badge.id) {
            case 2: return strk >= 6; // Health Champion: 6 month streak
            case 4: return pts > 800; // Perfect Attendance: simulated by high points
            default: return false;
        }
    };

    const handleSearch = async () => {
        if (!searchTerm) return;
        setLoading(true);
        try {
            const data = await getRewards(searchTerm);
            setHouseholdId(data.householdId || searchTerm);
            const fetchedPoints = data.totalPoints || 0;
            const fetchedStreak = data.currentStreak || 0;

            setPoints(fetchedPoints);
            setStreak(fetchedStreak);

            // Merge fetched badges with default badges to ensure structure exists
            if (data.badges && data.badges.length > 0) {
                setBadges(data.badges);
            } else {
                // Auto-calculate defaults if no stored badges
                setBadges(DEFAULT_BADGES.map(b => ({
                    ...b,
                    unlocked: checkBadgeCondition(b, fetchedPoints, fetchedStreak)
                })));
            }

            if (data.benefits && data.benefits.length > 0) {
                setBenefits(data.benefits);
            } else {
                // Auto-calculate defaults if no stored benefits
                setBenefits(DEFAULT_BENEFITS.map(b => ({
                    ...b,
                    eligible: fetchedPoints >= b.points
                })));
            }

        } catch (error) {
            console.error("Error fetching rewards:", error);
            // If 404 or error, maybe reset to defaults for new entry
            setHouseholdId(searchTerm);
            setPoints(0);
            setStreak(0);
            setBadges(DEFAULT_BADGES);
            setBenefits(DEFAULT_BENEFITS);
        } finally {
            setLoading(false);
        }
    };

    const saveChanges = async () => {
        if (!householdId) return;
        setLoading(true);
        try {
            const payload = {
                totalPoints: points,
                currentStreak: streak,
                badges: badges,
                benefits: benefits
            };
            await updateRewards(householdId, payload);
            alert("Changes saved successfully!");
        } catch (error) {
            console.error("Error saving changes:", error);
            alert("Failed to save changes.");
        } finally {
            setLoading(false);
        }
    };

    const toggleBadge = (id) => {
        setBadges(badges.map(b =>
            b.id === id ? { ...b, unlocked: !b.unlocked } : b
        ));
    };

    const updateBenefitPoints = (id, newPoints) => {
        setBenefits(benefits.map(b =>
            b.id === id ? { ...b, points: parseInt(newPoints) || 0 } : b
        ));
    };

    const toggleBenefitStatus = (id) => {
        setBenefits(benefits.map(b =>
            b.id === id ? { ...b, eligible: !b.eligible } : b
        ));
    };

    const deleteBenefit = (id) => {
        if (window.confirm('Are you sure you want to delete this benefit?')) {
            setBenefits(benefits.filter(b => b.id !== id));
        }
    };

    const calculateProgress = (required) => {
        if (!required || required === 0) return 100;
        return Math.min((points / required) * 100, 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] to-[#1a1a2e] text-gray-100 font-sans selection:bg-accent/20">

            <div className="max-w-[1600px] mx-auto p-4 lg:p-10">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-6 border-b border-white/10 relative">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary text-2xl animate-pulse-slow">
                            <Zap size={24} fill="currentColor" />
                        </div>
                        <div>
                            <div className="text-accent text-xs font-mono tracking-widest uppercase font-bold mb-1">Administrator Panel</div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Swasthya Parivar</h1>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/admin-home')}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-sm font-medium"
                        >
                            <ArrowLeft size={16} />
                            Back to Dashboard
                        </button>
                        <button
                            onClick={saveChanges}
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-primary hover:bg-accent/90 transition-all font-semibold text-sm shadow-[0_0_15px_rgba(209,240,114,0.2)]"
                        >
                            <Save size={16} />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </header>

                {/* Main Title */}
                <div className="mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-accent">
                        Rewards Management
                    </h2>
                    <p className="text-gray-400 text-lg">Configure household rewards, points, badges, and benefit eligibility</p>
                </div>

                {/* Household Selector */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-green-400 opacity-60"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                        <div>
                            <div className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">Household ID</div>
                            <div className="text-3xl md:text-4xl font-mono font-bold text-white tracking-wide">{householdId}</div>
                        </div>
                        <div className="bg-accent/10 border border-accent/20 text-accent px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                            Active Account
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            className="w-full bg-[#0B2525] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-accent/50 focus:bg-white/5 transition-all"
                            placeholder="Search household by ID... (Press Enter)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {/* Points Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:-translate-y-1 hover:border-accent/30 transition-all duration-300 group">
                        <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-center inline-block text-accent">
                            <Gem size={32} />
                        </div>
                        <div className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-2">Total Points</div>
                        <div className="text-4xl font-bold text-white mb-4">{points}</div>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={points}
                                onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                                className="w-full bg-[#0B2525] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent/50"
                            />
                            <button onClick={saveChanges} className="bg-accent text-primary px-3 py-2 rounded-lg text-xs font-bold hover:bg-accent/90 transition-colors">
                                Update
                            </button>
                        </div>
                    </div>

                    {/* Streak Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:-translate-y-1 hover:border-accent/30 transition-all duration-300 group">
                        <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-center inline-block text-accent">
                            <Calendar size={32} />
                        </div>
                        <div className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-2">Checkup Streak</div>
                        <div className="text-4xl font-bold text-white mb-4">{streak}</div>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={streak}
                                onChange={(e) => setStreak(parseInt(e.target.value) || 0)}
                                className="w-full bg-[#0B2525] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent/50"
                            />
                            <button onClick={saveChanges} className="bg-accent text-primary px-3 py-2 rounded-lg text-xs font-bold hover:bg-accent/90 transition-colors">
                                Update
                            </button>
                        </div>
                    </div>

                    {/* Badge Count Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:-translate-y-1 hover:border-accent/30 transition-all duration-300 group">
                        <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-center inline-block text-accent">
                            <Award size={32} />
                        </div>
                        <div className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-2">Badges Earned</div>
                        <div className="text-4xl font-bold text-white mb-4">{earnedBadgesCount}</div>
                        <button onClick={() => document.getElementById('badges-section').scrollIntoView({ behavior: 'smooth' })} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 py-2 rounded-lg text-xs font-bold transition-colors">
                            Manage Badges
                        </button>
                    </div>

                    {/* Benefits Count Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:-translate-y-1 hover:border-accent/30 transition-all duration-300 group">
                        <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-center inline-block text-accent">
                            <CheckCircle size={32} />
                        </div>
                        <div className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-2">Eligible Benefits</div>
                        <div className="text-4xl font-bold text-white mb-4">{eligibleBenefitsCount}</div>
                        <button onClick={() => document.getElementById('benefits-section').scrollIntoView({ behavior: 'smooth' })} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 py-2 rounded-lg text-xs font-bold transition-colors">
                            Configure Benefits
                        </button>
                    </div>
                </div>

                {/* Badges Section */}
                <div id="badges-section" className="mb-12">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <Award size={32} className="text-accent" />
                            <h3 className="text-2xl font-bold text-white">Achievement Badges</h3>
                        </div>
                        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors">
                            + Add Badge
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {badges.map(badge => (
                            <div
                                key={badge.id}
                                className={`relative p-6 rounded-2xl border transition-all duration-300 ${badge.unlocked
                                    ? 'bg-white/5 border-accent/50 shadow-[0_0_15px_rgba(209,240,114,0.1)]'
                                    : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <div className="flex gap-4 mb-4">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white truncate">{badge.name}</h4>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{badge.desc}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => toggleBadge(badge.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold border transition-all ${badge.unlocked
                                            ? 'bg-accent text-primary border-accent'
                                            : 'bg-[#0B2525] text-gray-400 border-white/10 hover:bg-white/5'
                                            }`}
                                    >
                                        {badge.unlocked ? <Unlock size={12} /> : <Lock size={12} />}
                                        {badge.unlocked ? 'Unlocked' : 'Locked'}
                                    </button>
                                    <button className="p-2 rounded-lg bg-[#0B2525] border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                                        <Edit2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Benefits Section */}
                <div id="benefits-section" className="mb-12">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <Gift size={32} className="text-accent" />
                            <h3 className="text-2xl font-bold text-white">Benefit Eligibility</h3>
                        </div>
                        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors">
                            + Add Benefit
                        </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_140px] gap-4 p-5 bg-[#0B2525] border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:grid">
                            <div>Benefit Program</div>
                            <div>Status</div>
                            <div>Required Points</div>
                            <div>Progress</div>
                            <div>Actions</div>
                        </div>

                        {benefits.map(benefit => {
                            const progress = calculateProgress(benefit.points);
                            return (
                                <div key={benefit.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_140px] gap-4 p-6 border-b border-white/5 items-center hover:bg-white/5 transition-colors">
                                    <div className="font-semibold text-white">{benefit.name}</div>

                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-flex items-center gap-1 ${benefit.eligible
                                            ? 'bg-accent/10 text-accent border border-accent/20'
                                            : 'bg-white/5 text-gray-500 border border-white/10'
                                            }`}>
                                            {benefit.eligible ? <Check size={10} /> : <X size={10} />}
                                            {benefit.eligible ? 'Eligible' : 'Locked'}
                                        </span>
                                    </div>

                                    <div>
                                        <input
                                            type="number"
                                            value={benefit.points}
                                            onChange={(e) => updateBenefitPoints(benefit.id, e.target.value)}
                                            className="w-24 bg-[#0B2525] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:border-accent/50"
                                        />
                                    </div>

                                    <div className="w-full">
                                        <div className="h-2 bg-[#0B2525] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-accent to-green-400 transition-all duration-500 ease-out"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-right text-xs text-gray-500 mt-1">{Math.round(progress)}%</div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => toggleBenefitStatus(benefit.id)}
                                            className="p-2 rounded-lg bg-[#0B2525] border border-white/10 text-gray-400 hover:text-accent hover:border-accent/50 hover:bg-white/5 transition-colors"
                                            title="Toggle Status"
                                        >
                                            <RefreshCw size={14} />
                                        </button>
                                        <button
                                            className="p-2 rounded-lg bg-[#0B2525] border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => deleteBenefit(benefit.id)}
                                            className="p-2 rounded-lg bg-[#0B2525] border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-400/50 hover:bg-red-900/10 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>



            </div>
        </div>
    );
};

export default AdminRewardsPage;
