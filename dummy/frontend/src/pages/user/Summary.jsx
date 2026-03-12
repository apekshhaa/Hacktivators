import React, { useState, useEffect } from 'react';
import { Search, Activity, Calendar, AlertCircle, CheckCircle, Clock, Users, User, Baby, AlertTriangle, Lock, Unlock, ArrowLeft, ShieldAlert, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getHouseholdSummary, getRiskAnalysis } from '../../services/api';
import PrivacyLockModal from '../../components/user/PrivacyLockModal';
import RescheduleModal from '../../components/user/RescheduleModal';
import RoleIndicator from '../../components/common/RoleIndicator';

const Summary = () => {
    const navigate = useNavigate();
    const [householdId, setHouseholdId] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [dates, setDates] = useState({ lastCheckup: '', nextDue: '' });

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isUserMode, setIsUserMode] = useState(false);
    const [privacyModal, setPrivacyModal] = useState({ isOpen: false, member: null });
    const [rescheduleModal, setRescheduleModal] = useState({ isOpen: false });
    const [selectedMemberId, setSelectedMemberId] = useState(null);
    const [riskData, setRiskData] = useState(null);
    const [isRiskLoading, setIsRiskLoading] = useState(false);
    const location = useLocation();

    // Auto-load data if user has a stored household ID (user mode)
    useEffect(() => {
        const storedId = localStorage.getItem('userHouseholdId');
        const isAdmin = location.state?.from === '/admin-home';

        if (storedId && !isAdmin) {
            setIsUserMode(true);
            setHouseholdId(storedId);
            // Perform search automatically
            performSearch(storedId);
        }
    }, [location.state]);

    const performSearch = async (id) => {
        setIsLoaded(false);
        setIsRiskLoading(true);
        setError(null);
        try {
            const [result, riskResult] = await Promise.all([
                getHouseholdSummary(id),
                getRiskAnalysis(id)
            ]);
            
            if (!result) throw new Error("No data found for this ID");
            setData(result);
            setRiskData(riskResult);
            setIsLoaded(true);
        } catch (err) {
            console.error("Search error:", err);
            setError("Household not found or server error.");
            setIsLoaded(false);
        } finally {
            setIsRiskLoading(false);
        }
    };

    const updateMemberData = (memberId, newData, mode, memberName) => {
        setData(prev => ({
            ...prev,
            familyMembers: prev.familyMembers.map(m =>
                (m._id === memberId || m.name === memberId) ? { ...m, ...newData } : m
            )
        }));
        
        if (mode === 'unlock' && memberName) {
            // Auto-navigate to risk page immediately after successful unlock
            navigate(`/member-risk/${data.householdId}/${memberName}`, {
                state: { preUnlockedData: { status: newData.status, flag: newData.flag } }
            });
        } else {
            // Auto-select the member after unlock/lock for immediate feedback
            setSelectedMemberId(memberId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Helper to format date as dd/mm/yyyy
    const formatDate = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        // Set dynamic dates based on today
        const today = new Date();
        const lastCheckupDate = new Date(today);
        lastCheckupDate.setDate(today.getDate() - 15); // 15 days ago

        const nextDueDate = new Date(today);
        nextDueDate.setDate(today.getDate() + 14); // 14 days from now

        setDates({
            lastCheckup: formatDate(lastCheckupDate),
            nextDue: formatDate(nextDueDate)
        });
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (householdId.trim()) {
            performSearch(householdId);
        }
    };

    // Mock User Mapping (Simulating Backend Auth)
    const getUserNameFromEmail = () => {
        // 1. Check if userName was stored at login
        const storedName = localStorage.getItem("userName");
        if (storedName) return storedName;
        
        const email = localStorage.getItem("userEmail");
        // Simple mapping for demo purposes
        if (!email) return data?.head || ""; // Use the head name from loaded data
        if (email.includes("ramesh")) return "Ramesh Kumar";
        if (email.includes("sunita")) return "Sunita Devi";
        if (email.includes("rahul")) return "Rahul Kumar";
        if (email.includes("priya")) return "Priya Kumari";
        if (email.includes("savitri")) return "Savitri Devi";
        if (email.includes("kavita")) return "Kavita Mishra";
        if (email.includes("vikram")) return "Vikram Mishra";
        return data?.head || ""; // Fall back to head name
    };

    const currentUserName = getUserNameFromEmail();

    const getStatusColor = (status, isVisible, isLocked) => {
        if (isLocked) return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        if (!isVisible) return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        switch (status) {
            case 'Healthy': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'Follow-up': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'Due': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-white/5 text-gray-400 border-white/10';
        }
    };


    const handleMemberClick = (member) => {
        if (member.isLocked) {
            setPrivacyModal({ isOpen: true, member });
        } else {
            setSelectedMemberId(member._id || member.name); // Prefer ID if available
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getSelectedMember = () => {
        if (!selectedMemberId || !data) return null;
        return data.familyMembers.find(m => (m._id || m.name) === selectedMemberId);
    };

    const currentSelected = getSelectedMember();

    const getDisplayName = () => {
        if (currentSelected) return currentSelected.name;
        return data?.head || 'Household Head';
    };

    const getDisplayStatus = () => {
        if (currentSelected) return currentSelected.status;
        return data?.status || 'Due';
    };

    const getDisplayFlags = () => {
        if (currentSelected) return currentSelected.flag ? [currentSelected.flag] : [];
        return data?.flags || [];
    };

    const backPath = location.state?.from || '/home';

    return (
        <div className="min-h-screen font-sans bg-gradient-to-br from-[#0d4648] to-[#2b4548] text-white p-6 relative overflow-hidden">

            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/40 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto">
                {/* Navbar Container - Floating Pill */}
                <div className="pt-0 pb-8 flex justify-center sticky top-0 z-50">
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 py-3 grid grid-cols-[auto_1fr_auto] gap-4 items-center w-full shadow-2xl">
                        {/* Back Button */}
                        <div className="pl-2">
                            <button onClick={() => navigate(backPath)} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                                <ArrowLeft size={18} />
                                Back
                            </button>
                        </div>

                        {/* Role Indicator (Middle) */}
                        <div className="flex justify-center">
                            <RoleIndicator role={isUserMode ? "user" : "admin"} householdId={data?.householdId || householdId} />
                        </div>

                        {/* Title (Right or Empty for balance) */}
                        <div className="flex items-center gap-2 pr-4 justify-end">
                            <Activity size={18} className="text-accent" />
                            <span className="text-sm font-bold uppercase tracking-wider text-white/40 hidden md:block">Health Summary</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-6xl mx-auto">

                    {!isLoaded && (
                        !isUserMode ? (
                            /* Original Search UI */
                            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in zoom-in duration-500">
                                <div className="bg-white/5 p-4 rounded-full border border-white/10">
                                    <Activity size={48} className="text-accent" />
                                </div>
                                <h1 className="text-4xl font-semibold tracking-tight">Track Household Health</h1>
                                <p className="text-gray-400 max-w-md">Enter the Unique Household ID to view health records, checking history, and upcoming schedules.</p>

                                {error && <p className="text-red-400">{error}</p>}

                                <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
                                    <input
                                        type="text"
                                        placeholder="Enter Household ID"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-all"
                                        value={householdId}
                                        onChange={(e) => setHouseholdId(e.target.value)}
                                    />
                                    <button type="submit" className="bg-accent text-[#0d4648] px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-all">
                                        View
                                    </button>
                                </form>
                            </div>
                        ) : (
                            /* Loading or Error State for User Mode */
                            error ? (
                                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in zoom-in duration-500">
                                    <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20 mb-6">
                                        <AlertCircle size={48} className="text-red-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Unable to Load Household</h2>
                                    <p className="text-gray-400 max-w-md mb-8">{error}</p>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('userHouseholdId');
                                            navigate('/home');
                                        }}
                                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-all border border-white/10"
                                    >
                                        Change Household ID
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                                    <div className="w-12 h-12 border-3 border-white/20 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-400 font-medium">Loading your dashboard...</p>
                                </div>
                            )
                        )
                    )}

                    {isLoaded && data ? (
                        // STATE 2: DASHBOARD
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">

                            {/* Header Info */}
                            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <div>
                                    <h1 className="text-2xl font-bold flex items-center gap-2">
                                        {getDisplayName()} <span className="text-sm font-normal text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">{data.householdId}</span>
                                    </h1>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {currentSelected ? `${currentSelected.relation} • ${currentSelected.age} Yrs • ${currentSelected.gender}` : `${data.village} • ${data.members_count} Members`}
                                    </p>
                                    {currentSelected && (
                                        <button
                                            onClick={() => setSelectedMemberId(null)}
                                            className="text-accent text-[10px] uppercase tracking-widest font-bold mt-2 hover:underline flex items-center gap-1"
                                        >
                                            <ArrowLeft size={10} />
                                            Reset to Household View
                                        </button>
                                    )}
                                </div>
                                <div className={`px-4 py-2 rounded-full font-medium flex items-center gap-2 ${getStatusColor(getDisplayStatus(), true, false)}`}>
                                    <Clock size={16} />
                                    {currentSelected ? 'Member Status: ' : 'Household Status: '}{getDisplayStatus()}
                                </div>
                            </div>

                            {/* Top Stats Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {/* Card 1: Last Checkup */}
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-gray-400 text-sm font-medium">Last Visit Date</h3>
                                        <CheckCircle size={20} className="text-green-400" />
                                    </div>
                                    <p className="text-2xl font-semibold">{data.lastCheckup}</p>
                                    <p className="text-xs text-gray-500 mt-2">Routine Community Checkup</p>
                                </div>

                                {/* Card 2: Health Flags */}
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-gray-400 text-sm font-medium">{currentSelected ? "Member Health Flags" : "Active Health Flags"}</h3>
                                        <AlertCircle size={20} className="text-red-400" />
                                    </div>
                                    <div className="space-y-2">
                                        {getDisplayFlags().length > 0 ? getDisplayFlags().map((flag, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-red-200 bg-red-500/10 px-2 py-1 rounded">
                                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                                                {flag}
                                            </div>
                                        )) : (
                                            <p className="text-sm text-gray-400">No active flags</p>
                                        )}
                                    </div>
                                </div>

                                {/* Card 3: Next Due */}
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-gray-400 text-sm font-medium">Next Scheduled Visit</h3>
                                        <Calendar size={20} className="text-accent" />
                                    </div>
                                    <p className="text-2xl font-semibold text-accent">
                                        {data.nextScheduledVisit ? formatDate(data.nextScheduledVisit) : dates.nextDue}
                                    </p>
                                    <button
                                        onClick={() => setRescheduleModal({ isOpen: true })}
                                        className="mt-3 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors"
                                    >
                                        Reschedule Visit
                                    </button>
                                </div>
                            </div>

                            {/* New: Household Risk Section */}
                            {!currentSelected && riskData && (
                                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-accent/5">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <ShieldAlert size={20} className="text-accent" />
                                            Overall Household Risk Summary
                                        </h3>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                            riskData.family?.riskLevel === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                            riskData.family?.riskLevel === 'Moderate' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                                            'bg-green-500/20 text-green-400 border-green-500/30'
                                        }`}>
                                            Risk Level: {riskData.family?.riskLevel || 'Low'}
                                        </div>
                                    </div>
                                    <div className="p-6 grid md:grid-cols-2 gap-8 items-center text-center md:text-left">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center md:justify-start gap-4">
                                                <div className="relative w-24 h-24">
                                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                                        <circle className="text-white/5" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                                        <circle className={
                                                            riskData.family?.riskLevel === 'High' ? 'text-red-500' :
                                                            riskData.family?.riskLevel === 'Moderate' ? 'text-orange-500' :
                                                            'text-green-500'
                                                        } strokeWidth="8" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * (riskData.family?.avgScore || 0) / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className="text-2xl font-black">{riskData.family?.avgScore || 0}</span>
                                                        <span className="text-[10px] text-gray-400 uppercase">Score</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">Based on all household members,</p>
                                                    <p className="text-lg font-bold">Health Assessment is {
                                                        riskData.family?.riskLevel === 'High' ? 'Critical' :
                                                        riskData.family?.riskLevel === 'Moderate' ? 'Concerning' :
                                                        'Stable'
                                                    }</p>
                                                </div>
                                            </div>

                                            {riskData.family?.alerts?.length > 0 ? (
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Household Alerts</p>
                                                    {riskData.family.alerts.map((alert, idx) => (
                                                        <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-3">
                                                            <AlertTriangle size={16} className={alert.severity === 'High' ? 'text-red-400' : 'text-orange-400'} />
                                                            <div>
                                                                <p className="text-sm font-medium">{alert.message}</p>
                                                                {alert.recommendation && <p className="text-xs text-gray-400 mt-1 italic">{alert.recommendation}</p>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                                                    <CheckCircle size={20} className="text-green-400" />
                                                    <p className="text-sm text-green-200">No cross-member health risks detected.</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                                            <h4 className="text-sm font-bold flex items-center gap-2 mb-3">
                                                <Sparkles size={14} className="text-accent" />
                                                Community Health Context
                                            </h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-400">Village Risk Trend</span>
                                                    <span className={`font-bold ${riskData.community?.trend === 'Rising' ? 'text-red-400' : 'text-green-400'}`}>
                                                        {riskData.community?.trend || 'Stable'}
                                                    </span>
                                                </div>
                                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div className={`h-full ${riskData.community?.trend === 'Rising' ? 'bg-red-500' : 'bg-green-500'} w-1/2`} />
                                                </div>
                                                <p className="text-xs text-gray-500 leading-relaxed italic">
                                                    "{riskData.community?.message || 'Local health patterns appear stable across the village.'}"
                                                </p>
                                                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                                                    <div className="text-center">
                                                        <p className="text-[10px] text-gray-500 uppercase">Fever</p>
                                                        <p className="text-sm font-bold">{riskData.community?.avgFever || 0}%</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[10px] text-gray-500 uppercase">Cough</p>
                                                        <p className="text-sm font-bold">{riskData.community?.avgCough || 0}%</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[10px] text-gray-500 uppercase">Risk Index</p>
                                                        <p className="text-sm font-bold text-accent">{riskData.community?.avgRisk || 0}/10</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Family Members Details */}
                            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Users size={20} className="text-accent" />
                                        Family Health Details
                                    </h3>
                                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">{data.members_count} Members</span>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                                    {data.familyMembers.map((member, idx) => (
                                        <div key={idx}
                                            className={`bg-black/20 p-4 rounded-xl border transition-all group cursor-pointer
                                                ${selectedMemberId === (member._id || member.name) ? 'border-accent ring-1 ring-accent/20 bg-accent/5' : 'border-white/5 hover:border-white/20'}
                                                ${member.isLocked ? 'hover:border-blue-500/30' : ''}`}
                                            onClick={() => handleMemberClick(member)}>
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${member.isLocked ? 'bg-blue-500/10 text-blue-400' : (selectedMemberId === (member._id || member.name) ? 'bg-accent/20 text-accent' : 'bg-white/10 text-gray-300')}`}>
                                                        {member.isLocked ? <Lock size={20} /> : (member.age < 12 ? <Baby size={20} /> : <User size={20} />)}
                                                    </div>
                                                    <div>
                                                        <h4 className={`font-medium transition-colors ${selectedMemberId === (member._id || member.name) ? 'text-accent' : 'text-white'}`}>{member.name}</h4>
                                                        <p className="text-gray-400 text-xs">{member.relation} • {member.age} Yrs • {member.gender}</p>
                                                    </div>
                                                </div>
                                                {member.isLocked ? (
                                                    <div className="text-blue-400/50">
                                                        <Lock size={16} />
                                                    </div>
                                                ) : (
                                                    member.flag && (
                                                        <div title={member.flag} className="text-red-400 animate-pulse">
                                                            <AlertTriangle size={16} />
                                                        </div>
                                                    )
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mt-4 text-xs">
                                                <span className="text-gray-500">Health Status</span>
                                                <span className={`px-2 py-1 rounded border ${getStatusColor(member.status, true, member.isLocked)}`}>
                                                    {member.status}
                                                </span>
                                            </div>

                                            {member.isLocked ? (
                                                <div className="mt-3 flex flex-col items-center gap-2">
                                                    <div className="text-[10px] text-blue-400/40 uppercase tracking-widest font-bold">Locked Record</div>
                                                    <button
                                                        onClick={() => setPrivacyModal({ isOpen: true, member })}
                                                        className="w-full py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/20 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Unlock size={14} />
                                                        Unlock Record
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    {member.flag && (
                                                        <div className="mt-3 text-xs bg-red-500/10 text-red-300 px-2 py-1.5 rounded border border-red-500/10 truncate">
                                                            {member.flag}
                                                        </div>
                                                    )}
                                                    {member.age >= 18 && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setPrivacyModal({ isOpen: true, member });
                                                            }}
                                                            className="mt-3 w-full py-1.5 text-[10px] uppercase tracking-wider font-bold text-white/20 hover:text-accent hover:border-accent/30 border border-white/5 rounded-lg transition-all"
                                                        >
                                                            Set Privacy Lock
                                                        </button>
                                                    )}
                                                    
                                                    {/* Check Risk Button linking to individual page */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/member-risk/${data.householdId}/${member.name}`);
                                                        }}
                                                        className="mt-3 w-full py-2 bg-accent/10 hover:bg-accent/20 text-accent text-xs font-bold rounded-lg border border-accent/20 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Activity size={14} />
                                                        Check Risk
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* History Timeline */}
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <h3 className="text-lg font-semibold mb-6">Checkup History</h3>
                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
                                    {data.checkupHistory.map((item, idx) => (
                                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group select-none">

                                            {/* Icon Dot */}
                                            <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#0d4648] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow ${item.status === 'Done' ? 'bg-green-500' : 'bg-red-500'}`}></div>

                                            {/* Card Content */}
                                            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white/5 p-4 rounded-xl border border-white/10 text-sm hover:border-accent/30 transition-colors">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-semibold text-white">{item.date}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'Done' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{item.status}</span>
                                                </div>
                                                <p className="text-gray-400 leading-snug">{item.notes}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full mt-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-center text-sm font-medium text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2">
                                    <Clock size={16} />
                                    Show Full History
                                </button>
                            </div>

                        </div>
                    ) : null}
                </div>
            </div>

            <PrivacyLockModal
                isOpen={privacyModal.isOpen}
                onClose={() => setPrivacyModal({ isOpen: false, member: null })}
                member={privacyModal.member}
                householdId={data?.householdId}
                onUpdate={updateMemberData}
            />

            <RescheduleModal
                isOpen={rescheduleModal.isOpen}
                onClose={() => setRescheduleModal({ isOpen: false })}
                householdId={data?.householdId}
                headName={data?.head}
                initialDate={data?.nextScheduledVisit}
                onUpdate={(newDate) => setData(prev => ({ ...prev, nextScheduledVisit: newDate }))}
            />
        </div>
    );
};

export default Summary;
