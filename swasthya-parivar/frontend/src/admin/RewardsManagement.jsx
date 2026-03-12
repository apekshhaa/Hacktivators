import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Gift, Sparkles, Activity, Zap, Gem, Calendar, Award, CheckCircle, CheckCircle2, Printer, RefreshCw, RefreshCcw, Users, Dumbbell, Syringe, Save, Check, X, Download, Trash2, Edit2, Lock, Unlock, BarChart2, BarChart3, Star, Medal, Hospital, HeartPulse } from 'lucide-react';
import { getRewards } from '../../services/api';
import CommunityMeter from '../../components/admin/CommunityMeter';
import RoleIndicator from '../../components/common/RoleIndicator';

const RewardsManagement = () => {
    const location = useLocation();
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [results, setResults] = useState(null);
    const [isUserMode, setIsUserMode] = useState(false);

    useEffect(() => {
        const storedId = localStorage.getItem('userHouseholdId');
        const isAdmin = location.state?.from === '/admin-home';

        if (storedId && !isAdmin) {
            setIsUserMode(true);
            setSearchInput(storedId);
            performSearch(storedId);
        }
    }, [location.state]);

    const performSearch = async (id) => {
        setError('');
        setSuccess(false);
        setResults(null);

        if (!id) {
            setError('Please enter a Household ID');
            return;
        }

        setLoading(true);

        try {
            const data = await getRewards(id);
            setSuccess(true);

            // Map API response to component state structure
            // Note: The backend currently returns { householdId, points, streak, badges: [], eligible: boolean }
            // The frontend expects badges as objects with { id, name, icon, desc, unlocked }
            // We need to map the badges array from strings to detailed objects or update the backend.
            // For now, I'll mock the badge DETAILS while using the unlocked status from backend

            // Default constants if backend returns empty (e.g. new user)
            const DEFAULT_BADGES = [
                { id: 1, name: 'Regular Checkup Family', icon: <Hospital size={24} />, desc: '10+ checkups completed', unlocked: false },
                { id: 2, name: 'Health Champion', icon: <HeartPulse size={24} />, desc: 'Maintained 6-month streak', unlocked: false },
                { id: 3, name: 'Vaccination Hero', icon: <Syringe size={24} />, desc: 'All family vaccinated', unlocked: false },
                { id: 4, name: 'Perfect Attendance', icon: <Sparkles size={24} />, desc: 'No missed appointments', unlocked: false }
            ];

            const DEFAULT_BENEFITS = [
                { id: 1, name: 'Monthly Ration Kit', points: 400, eligible: false },
                { id: 2, name: 'Free Medicine Voucher', points: 300, eligible: false },
                { id: 3, name: 'Health Insurance Subsidy', points: 600, eligible: false }
            ];

            // Use backend data if available, otherwise defaults
            const badges = (data.badges && data.badges.length > 0) ? data.badges : DEFAULT_BADGES;

            // For benefits, map to the structure expected by the render loop below
            // Render loop expects: { benefit: string, eligible: boolean, pointsRequired: number, pointsEarned: number }
            const rawBenefits = (data.benefits && data.benefits.length > 0) ? data.benefits : DEFAULT_BENEFITS;

            const benefitsForRender = rawBenefits.map(b => ({
                benefit: b.name,
                eligible: b.eligible,
                pointsRequired: b.points,
                pointsEarned: data.totalPoints || 0
            }));

            setResults({
                householdId: data.householdId,
                totalPoints: data.totalPoints || 0,
                streak: data.currentStreak || 0,
                badges: badges,
                eligibility: benefitsForRender
            });

            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 404) {
                setError('Household ID not found in the system');
            } else {
                setError('Server error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };



    const searchHousehold = () => {
        performSearch(searchInput.trim().toUpperCase());
    };

    const quickSearch = (id) => {
        setSearchInput(id);
        performSearch(id);
    };

    const exportData = () => {
        if (results) {
            alert(`Export functionality will generate a detailed report for ${results.householdId}\n\nFormats available: PDF, CSV, Excel`);
        }
    };

    const refreshData = () => {
        if (searchInput) {
            performSearch(searchInput.trim().toUpperCase());
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchHousehold();
        }
    };

    const getUnlockedCount = () => results?.badges.filter(b => b.unlocked).length || 0;
    const getEligibleCount = () => results?.eligibility.filter(e => e.eligible).length || 0;

    return (
        <div className="min-h-screen font-sans bg-gradient-to-br from-[#091E1E] to-[#113030] text-white overflow-x-hidden relative">
            {/* Background Ambient Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/40 rounded-full blur-3xl"></div>
            </div>

            {/* Navbar */}
            <div className="pt-6 pb-2 px-4 flex justify-center sticky top-0 z-50">
                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-6 py-3 grid grid-cols-[auto_1fr_auto] gap-4 items-center w-[98%] max-w-[1600px] shadow-2xl">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <Sparkles size={22} className="text-white" />
                        <span className="text-xl font-medium tracking-wide">Swasthya Parivar</span>
                    </div>

                    {/* Role Indicator (Middle) */}
                    <div className="flex justify-center">
                        <RoleIndicator role={isUserMode ? "user" : "admin"} householdId={results?.householdId || searchInput} />
                    </div>

                    {/* Back Button */}
                    <div className="flex justify-end">
                        <Link to="/home" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all">
                            <ArrowLeft size={16} />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 lg:px-8 pt-8 pb-20 relative z-10">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl lg:text-5xl font-semibold leading-tight tracking-tight mb-3">
                        Household <span className="text-accent">Rewards</span>
                    </h1>
                    <p className="text-gray-400 text-lg">Search and view household reward information and benefit eligibility</p>
                </div>

                <div className="mb-10">
                    <CommunityMeter />
                </div>

                {/* Search Card - Only for Admin */}
                {!isUserMode && (
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 shadow-xl">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Search Household Records</h2>
                            <p className="text-gray-400 text-sm">Enter a Household ID to view their complete rewards profile</p>
                        </div>

                        <div className="flex gap-4 mb-6 flex-wrap">
                            <div className="flex-1 min-w-[250px]">
                                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Household ID</label>
                                <div className="relative">
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-medium"
                                        placeholder="e.g., HH-12345"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={searchHousehold}
                                className="self-end bg-accent hover:bg-accent/90 text-[#091E1E] px-8 py-3 rounded-xl font-semibold text-sm transition-all shadow-[0_0_20px_rgba(209,240,114,0.3)]"
                            >
                                Search
                            </button>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Quick Access</p>
                            <div className="flex gap-3 flex-wrap">
                                {['HH-12345', 'HH-67890', 'HH-11111'].map(id => (
                                    <button
                                        key={id}
                                        onClick={() => quickSearch(id)}
                                        className="px-4 py-2 bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/30 rounded-lg text-sm font-mono font-medium text-gray-300 hover:text-accent transition-all"
                                    >
                                        {id}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl mb-6 backdrop-blur-md">
                        {error}
                    </div>
                )}

                {/* Success Alert */}
                {success && (
                    <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-4 rounded-xl mb-6 backdrop-blur-md">
                        Household data loaded successfully
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 border-3 border-white/20 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400 font-medium">Loading household data...</p>
                    </div>
                )}

                {/* Results */}
                {results && !loading && (
                    <div className="space-y-6">
                        {/* Household Banner */}
                        <div className="backdrop-blur-md bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/30 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10 flex justify-between items-center flex-wrap gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-accent/80 uppercase tracking-widest mb-2">Household Identification</p>
                                    <h2 className="text-4xl font-bold tracking-wider text-white">{results.householdId}</h2>
                                </div>
                                <div className="bg-accent/20 border border-accent/30 px-5 py-2.5 rounded-full text-sm font-semibold text-accent backdrop-blur-md">
                                    Active Account
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { icon: <Gem className="text-secondary" />, label: 'Total Points', value: results.totalPoints },
                                { icon: <Calendar className="text-secondary" />, label: 'Checkup Streak', value: results.streak },
                                { icon: <Award className="text-secondary" />, label: 'Badges Earned', value: getUnlockedCount() },
                                { icon: <CheckCircle className="text-secondary" />, label: 'Eligible Benefits', value: getEligibleCount() }
                            ].map((stat, index) => (
                                <div key={index} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                                    <div className="mb-3">{stat.icon}</div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Badges Section */}
                        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                                    <Award size={24} />
                                </div>
                                <h2 className="text-xl font-semibold">Achievement Badges</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {results.badges.map(badge => (
                                    <div
                                        key={badge.id}
                                        className={`flex items-center gap-4 p-5 rounded-xl border transition-all ${badge.unlocked
                                            ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                                            : 'bg-white/5 border-white/10 opacity-50'
                                            }`}
                                    >
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${badge.unlocked ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/10 border border-white/10'
                                            }`}>
                                            {badge.icon === '🏥' ? <Activity size={28} className="text-accent" /> :
                                                badge.icon === '💪' ? <Dumbbell size={28} className="text-accent" /> :
                                                    badge.icon === '💉' ? <Syringe size={28} className="text-accent" /> :
                                                        badge.icon === '✨' ? <Star size={28} className="text-accent" /> :
                                                            <Award size={28} className="text-accent" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-white mb-1">{badge.name}</p>
                                            <p className="text-sm text-gray-400 mb-2">{badge.desc}</p>
                                            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${badge.unlocked
                                                ? 'bg-green-500 text-white'
                                                : 'bg-white/10 text-gray-500'
                                                }`}>
                                                {badge.unlocked ? 'UNLOCKED' : 'LOCKED'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Benefits Table */}
                        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                                    <Gift size={24} />
                                </div>
                                <h2 className="text-xl font-semibold">Benefit Eligibility</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-4">Benefit Program</th>
                                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-4">Status</th>
                                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-4">Required Points</th>
                                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-4">Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.eligibility.map((item, index) => {
                                            const percentage = Math.min((item.pointsEarned / item.pointsRequired) * 100, 100);
                                            return (
                                                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-all">
                                                    <td className="py-4 px-4 font-semibold">{item.benefit}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full ${item.eligible
                                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                            }`}>
                                                            {item.eligible ? 'Eligible' : 'Not Eligible'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-400">{item.pointsRequired} points</td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-accent to-green-400 rounded-full transition-all duration-1000"
                                                                    style={{ width: `${percentage}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm font-mono text-gray-400 w-12">{Math.round(percentage)}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Administrative Actions</p>
                            <div className="flex gap-3 flex-wrap">
                                <button
                                    onClick={exportData}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/30 rounded-lg text-sm font-medium text-gray-300 hover:text-accent transition-all"
                                >
                                    <BarChart2 size={16} />
                                    Export Report
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/30 rounded-lg text-sm font-medium text-gray-300 hover:text-accent transition-all"
                                >
                                    <Printer size={16} />
                                    Print Details
                                </button>
                                <button
                                    onClick={refreshData}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/30 rounded-lg text-sm font-medium text-gray-300 hover:text-accent transition-all"
                                >
                                    <RefreshCw size={16} />
                                    Refresh Data
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Spinner Animation */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 0.7s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default RewardsManagement;
