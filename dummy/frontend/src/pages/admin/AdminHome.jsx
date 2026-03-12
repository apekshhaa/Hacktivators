import React, { useState, useEffect } from 'react';
import { Activity, Gift, Calendar, AlertTriangle, User, TrendingUp, ChevronRight, Search, ShoppingBag, Sparkles, ChevronDown, Plus, X, ArrowLeft, Edit3, Save, Loader2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RoleIndicator from '../../components/common/RoleIndicator';
import mediBot from '../../assets/medi_bot.png';

import { auth } from '../../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';

import { getRecentAppointments, createHousehold, updateHousehold } from '../../services/api';

const AdminHome = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [isSearching, setIsSearching] = useState(false);
    // Symptom editor state
    const [symptomHouseholdId, setSymptomHouseholdId] = useState('');
    const [symptomMembers, setSymptomMembers] = useState([]);
    const [symptomLoading, setSymptomLoading] = useState(false);
    const [symptomError, setSymptomError] = useState('');
    const [editingMemberId, setEditingMemberId] = useState(null);
    const [editValues, setEditValues] = useState({ status: '', flag: '' });
    const [saveSuccess, setSaveSuccess] = useState(null);
    const [formData, setFormData] = useState({
        householdId: '',
        head: '',
        village: '',
        status: 'Due',
        healthFlags: [],
        familyMembers: []
    });
    const [newFlag, setNewFlag] = useState('');
    const [newMember, setNewMember] = useState({
        name: '',
        relation: '',
        age: '',
        gender: 'Male',
        status: 'Healthy',
        flag: ''
    });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState(false);

    useEffect(() => {
        const fetchAppointments = async () => {
            const data = await getRecentAppointments();
            setAppointments(data);
        };
        fetchAppointments();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess(false);

        if (!formData.householdId || !formData.head || !formData.village) {
            setFormError('Please fill all required fields');
            return;
        }

        try {
            if (modalMode === 'add') {
                const payload = {
                    ...formData,
                    members_count: formData.familyMembers.length || 1
                };
                await createHousehold(payload);
                setFormSuccess(true);
            } else {
                // Update mode
                await updateHousehold(formData.householdId, {
                    head: formData.head,
                    village: formData.village,
                    familyMembers: formData.familyMembers
                });
                setFormSuccess(true);
            }

            setFormData({ householdId: '', head: '', village: '', status: 'Due', healthFlags: [], familyMembers: [] });
            setNewMember({ name: '', relation: '', age: '', gender: 'Male', status: 'Healthy', flag: '' });
            setTimeout(() => {
                setShowAddModal(false);
                setFormSuccess(false);
            }, 1500);
        } catch (err) {
            if (err.response?.status === 409) {
                setFormError('Household ID already exists');
            } else {
                setFormError(err.message || (modalMode === 'add' ? 'Failed to create household' : 'Failed to update household'));
            }
        }
    };

    const fetchHouseholdForUpdate = async (id) => {
        if (!id) return;
        setIsSearching(true);
        setFormError('');
        try {
            const response = await fetch(`http://localhost:5000/api/households/${id}`);
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    householdId: data.householdId,
                    head: data.head,
                    village: data.village,
                    status: data.status,
                    healthFlags: data.healthFlags || [],
                    familyMembers: data.familyMembers || []
                });
            } else {
                setFormError('Household not found');
            }
        } catch (error) {
            setFormError('Error fetching household');
        } finally {
            setIsSearching(false);
        }
    };

    const addHealthFlag = () => {
        if (newFlag.trim()) {
            setFormData({ ...formData, healthFlags: [...formData.healthFlags, newFlag.trim()] });
            setNewFlag('');
        }
    };

    // Symptom editor: fetch members by household
    const fetchSymptomMembers = async () => {
        if (!symptomHouseholdId.trim()) return;
        setSymptomLoading(true);
        setSymptomError('');
        setSymptomMembers([]);
        setEditingMemberId(null);
        try {
            const res = await fetch(`http://localhost:5000/api/households/${symptomHouseholdId}`);
            if (res.ok) {
                const data = await res.json();
                setSymptomMembers(data.familyMembers || []);
            } else {
                setSymptomError('Household not found');
            }
        } catch {
            setSymptomError('Server error');
        } finally {
            setSymptomLoading(false);
        }
    };

    const saveSymptomEdit = async (memberId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/households/${symptomHouseholdId}/members/${memberId}/symptoms`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editValues)
            });
            if (res.ok) {
                setSaveSuccess(memberId);
                setTimeout(() => setSaveSuccess(null), 1500);
                setEditingMemberId(null);
                fetchSymptomMembers(); // refresh
            }
        } catch {
            setSymptomError('Failed to save');
        }
    };

    const removeHealthFlag = (index) => {
        const updated = formData.healthFlags.filter((_, i) => i !== index);
        setFormData({ ...formData, healthFlags: updated });
    };

    const addFamilyMember = () => {
        if (newMember.name && newMember.relation && newMember.age) {
            setFormData({ ...formData, familyMembers: [...formData.familyMembers, { ...newMember, age: parseInt(newMember.age) }] });
            setNewMember({ name: '', relation: '', age: '', gender: 'Male', status: 'Healthy', flag: '' });
        }
    };

    const removeFamilyMember = (index) => {
        const updated = formData.familyMembers.filter((_, i) => i !== index);
        setFormData({ ...formData, familyMembers: updated });
    };

    return (
        <div className="min-h-screen font-sans bg-gradient-to-br from-[#0a0a1a] to-[#1a1a2e] text-white overflow-y-auto relative">

            {/* Background Ambient Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/40 rounded-full blur-3xl"></div>
            </div>

            {/* Navbar Container - Floating Pill */}
            <div className="pt-6 pb-2 px-4 flex justify-center sticky top-0 z-50">
                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-3 py-3 grid grid-cols-[auto_1fr_auto] gap-4 items-center w-[98%] max-w-[1600px] shadow-2xl">

                    {/* Logo (Left Aligned) */}
                    <div className="flex items-center gap-3 pl-2">
                        <div className="text-white">
                            <Sparkles size={22} className="text-white" />
                        </div>
                        <span className="text-xl font-medium tracking-wide whitespace-nowrap">Swasthya Parivar</span>
                    </div>

                    {/* Role Indicator (Centered) */}
                    <div className="flex justify-center">
                        <RoleIndicator role="admin" />
                    </div>

                    {/* Right Actions (Right Aligned) */}
                    <div className="flex items-center justify-end gap-2 pr-1">
                        <div id="nav-translate-container" className="flex items-center justify-center mr-2"></div>

                        {/* Search Pill */}
                        <div className="hidden 2xl:flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10 w-64">
                            <Search size={16} className="text-gray-400 mr-2" />
                            <input type="text" placeholder="Search Patients..." className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-full" />
                        </div>

                        <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors shrink-0">
                            <User size={18} />
                        </button>
                        <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 whitespace-nowrap">
                            Logout
                        </button>
                    </div>
                </div>
            </div>


            {/* Main Layout Grid */}
            <div className="relative z-10 max-w-[1600px] mx-auto min-h-[calc(100vh-140px)] h-auto container mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center px-6 pb-10">

                {/* Left Column */}
                <div className="flex flex-col h-full justify-between gap-6 pb-6">

                    {/* Top Left: Summary / Health Tracker */}
                    <div
                        onClick={() => navigate('/summary', { state: { from: '/admin-home' } })}
                        className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group flex-1 min-h-[220px] flex flex-col justify-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity size={100} />
                        </div>
                        <div className="flex items-center gap-4 mb-4 text-accent">
                            <Activity size={28} />
                            <h2 className="text-xl font-bold">Health Tracker</h2>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">Access the summary dashboard to track household health records and history.</p>
                        <div className="flex items-center gap-2 text-accent text-sm font-semibold group-hover:translate-x-2 transition-transform">
                            Go to Summary <ChevronRight size={16} />
                        </div>
                    </div>

                    <div
                        className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all group flex-1 min-h-[220px] flex flex-col justify-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <User size={80} />
                        </div>
                        <div className="flex items-center gap-4 mb-3 text-accent">
                            <User size={24} />
                            <h2 className="text-lg font-bold">Household Management</h2>
                        </div>
                        <p className="text-gray-300 text-xs mb-3">Register new households or update existing family records.</p>
                        <div className="flex flex-col gap-2">
                            <div
                                onClick={() => { setModalMode('add'); setShowAddModal(true); setFormData({ householdId: '', head: '', village: '', status: 'Due', healthFlags: [], familyMembers: [] }); }}
                                className="flex items-center gap-2 text-accent text-sm font-semibold hover:translate-x-2 transition-transform cursor-pointer"
                            >
                                Add New Household <ChevronRight size={16} />
                            </div>
                            <div
                                onClick={() => { setModalMode('update'); setShowAddModal(true); setFormData({ householdId: '', head: '', village: '', status: 'Due', healthFlags: [], familyMembers: [] }); }}
                                className="flex items-center gap-2 text-accent text-sm font-semibold hover:translate-x-2 transition-transform cursor-pointer"
                            >
                                Update Household <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>


                    {/* Bottom Left: Outbreak Prediction */}
                    <div
                        onClick={() => navigate('/admin/outbreak')}
                        className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl flex-1 min-h-[220px] flex flex-col justify-center relative overflow-hidden hover:bg-red-500/15 transition-all cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500">
                            <TrendingUp size={80} />
                        </div>
                        <div className="flex items-center gap-4 mb-3 text-red-400">
                            <AlertTriangle size={24} />
                            <h2 className="text-lg font-bold">Outbreak Prediction</h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs text-gray-300 mb-1">
                                    <span>Dengue Risk</span>
                                    <span className="text-red-400 font-bold">High (85%)</span>
                                </div>
                                <div className="w-full bg-black/30 rounded-full h-1.5">
                                    <div className="bg-red-500 h-1.5 rounded-full w-[85%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-gray-300 mb-1">
                                    <span>Seasonal Flu</span>
                                    <span className="text-yellow-400 font-bold">Moderate (45%)</span>
                                </div>
                                <div className="w-full bg-black/30 rounded-full h-1.5">
                                    <div className="bg-yellow-400 h-1.5 rounded-full w-[45%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Center Column: Doctor / Medi-Bot */}
                <div className="flex items-center justify-center h-full relative">
                    {/* Circular Glow */}
                    <div className="absolute w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px] z-0"></div>
                    <div className="absolute w-[350px] h-[350px] border border-white/5 rounded-full z-0 animate-spin-slow"></div>

                    <img
                        src={mediBot}
                        alt="Medi-Bot"
                        className="h-[550px] w-auto object-contain z-10 drop-shadow-[0_0_50px_rgba(209,240,114,0.3)] animate-float-slow"
                    />
                </div>

                {/* Right Column */}
                <div className="flex flex-col h-full justify-between gap-6 pb-6">

                    {/* Top Right: Edit Patient Symptoms */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex-1 min-h-[350px] flex flex-col relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-4 text-accent">
                            <Edit3 size={24} />
                            <h2 className="text-lg font-bold">Edit Patient Symptoms</h2>
                        </div>

                        {/* Search bar */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Enter Household ID..."
                                value={symptomHouseholdId}
                                onChange={(e) => setSymptomHouseholdId(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchSymptomMembers()}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-accent text-sm"
                            />
                            <button
                                onClick={fetchSymptomMembers}
                                disabled={symptomLoading}
                                className="bg-accent text-[#0a0a1a] px-4 py-2.5 rounded-xl font-bold hover:bg-accent/90 transition-all text-sm flex items-center gap-1.5 disabled:opacity-50"
                            >
                                {symptomLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                                Search
                            </button>
                        </div>

                        {symptomError && <p className="text-red-400 text-xs mb-2">{symptomError}</p>}

                        {/* Members list */}
                        <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                            {symptomMembers.length === 0 && !symptomLoading && !symptomError && (
                                <p className="text-gray-500 text-sm text-center py-8">Search a household to view and edit member symptoms.</p>
                            )}
                            {symptomMembers.map((m) => (
                                <div key={m._id} className="bg-black/20 p-3 rounded-xl border border-white/5">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold">
                                                {m.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white text-sm">{m.name}</p>
                                                <p className="text-[10px] text-gray-400">{m.relation} · {m.age} yrs · {m.gender}</p>
                                            </div>
                                        </div>
                                        {editingMemberId === m._id ? (
                                            <button
                                                onClick={() => saveSymptomEdit(m._id)}
                                                className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2.5 py-1 rounded-lg hover:bg-green-500/30 transition-colors"
                                            >
                                                <Save size={12} /> Save
                                            </button>
                                        ) : saveSuccess === m._id ? (
                                            <span className="flex items-center gap-1 text-xs text-green-400"><Check size={12} /> Saved</span>
                                        ) : (
                                            <button
                                                onClick={() => { setEditingMemberId(m._id); setEditValues({ status: m.status || 'Healthy', flag: m.flag || '' }); }}
                                                className="flex items-center gap-1 text-xs bg-accent/10 text-accent px-2.5 py-1 rounded-lg hover:bg-accent/20 transition-colors"
                                            >
                                                <Edit3 size={12} /> Edit
                                            </button>
                                        )}
                                    </div>

                                    {editingMemberId === m._id ? (
                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                            <select
                                                value={editValues.status}
                                                onChange={(e) => setEditValues({ ...editValues, status: e.target.value })}
                                                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-accent"
                                            >
                                                <option value="Healthy" className="bg-[#0a0a1a]">Healthy</option>
                                                <option value="Follow-up" className="bg-[#0a0a1a]">Follow-up</option>
                                                <option value="Critical" className="bg-[#0a0a1a]">Critical</option>
                                                <option value="Due" className="bg-[#0a0a1a]">Due</option>
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Symptoms / flag"
                                                value={editValues.flag}
                                                onChange={(e) => setEditValues({ ...editValues, flag: e.target.value })}
                                                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-accent"
                                            />
                                        </div>
                                    ) : (
                                        <div className="mt-1 flex items-center gap-2 text-[11px]">
                                            <span className={`px-2 py-0.5 rounded-full border ${
                                                m.status === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                                m.status === 'Follow-up' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                                'bg-green-500/20 text-green-400 border-green-500/30'
                                            }`}>{m.status || 'Healthy'}</span>
                                            {m.flag && <span className="text-gray-400">Symptoms: <span className="text-white">{m.flag}</span></span>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Right: Update Rewards */}
                    <div className="bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 p-8 rounded-3xl flex-1 min-h-[350px] flex flex-col justify-center relative overflow-hidden group hover:border-accent/40 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-accent group-hover:scale-110 transition-transform">
                            <Gift size={80} />
                        </div>
                        <div className="flex items-center gap-4 mb-4 text-accent">
                            <Gift size={28} />
                            <h2 className="text-xl font-bold">Update Rewards</h2>
                        </div>
                        <p className="text-gray-300 text-sm mb-6">Manage and distribute health rewards.</p>

                        <button
                            onClick={() => navigate('/admin/rewards')}
                            className="bg-accent text-[#0a0a1a] py-3 px-6 rounded-xl font-bold hover:bg-accent/90 transition-all shadow-[0_0_20px_rgba(209,240,114,0.2)] text-sm"
                        >
                            Manage Rewards
                        </button>
                    </div>

                </div>

            </div>

            {/* Add Household Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="bg-[#0f2828] border border-white/20 rounded-2xl p-8 max-w-3xl w-full shadow-2xl relative my-8">
                        <button
                            onClick={() => { setShowAddModal(false); setFormError(''); setFormSuccess(false); }}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                            <User size={28} className="text-accent" />
                            {modalMode === 'add' ? 'Add New Household' : 'Update Household'}
                        </h2>

                        {formSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <p className="text-green-400 font-semibold text-lg">
                                    {modalMode === 'add' ? 'Household Created!' : 'Household Updated!'}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                {/* Row 1: Household ID & Village */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <label className="block text-sm text-gray-300 mb-2">Household ID</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., HH-2024-0001"
                                            value={formData.householdId}
                                            onChange={(e) => setFormData({ ...formData, householdId: e.target.value })}
                                            onBlur={() => modalMode === 'update' && fetchHouseholdForUpdate(formData.householdId)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                                        />
                                        {isSearching && (
                                            <div className="absolute right-3 bottom-3">
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-accent"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-2">Village</label>
                                        <input
                                            type="text"
                                            placeholder="Village name"
                                            value={formData.village}
                                            onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Head of Household & Status */}
                                <div className={`grid grid-cols-1 ${modalMode === 'add' ? 'md:grid-cols-2' : ''} gap-4`}>
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-2">Head of Household</label>
                                        <input
                                            type="text"
                                            placeholder="Full name"
                                            value={formData.head}
                                            onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                    {modalMode === 'add' && (
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-2">Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent appearance-none cursor-pointer"
                                            >
                                                <option value="Due" className="bg-[#0f2828]">Due</option>
                                                <option value="Healthy" className="bg-[#0f2828]">Healthy</option>
                                                <option value="Follow-up" className="bg-[#0f2828]">Follow-up</option>
                                                <option value="Critical" className="bg-[#0f2828]">Critical</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Health Flags - HIDDEN IN UPDATE MODE */}
                                {modalMode === 'add' && (
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-2">Health Flags</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add health flag"
                                                value={newFlag}
                                                onChange={(e) => setNewFlag(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHealthFlag())}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                                            />
                                            <button
                                                type="button"
                                                onClick={addHealthFlag}
                                                className="bg-accent text-[#0a0a1a] px-4 py-3 rounded-xl font-bold hover:bg-accent/90 transition-all flex items-center justify-center"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                        {formData.healthFlags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {formData.healthFlags.map((flag, idx) => (
                                                    <span key={idx} className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                                        {flag}
                                                        <button type="button" onClick={() => removeHealthFlag(idx)} className="hover:text-white flex items-center justify-center">
                                                            <X size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Family Members Section */}
                                <div className="border-t border-white/10 pt-6">
                                    <label className="block text-sm text-gray-300 mb-4">Family Members</label>

                                    {/* Added Members List */}
                                    {formData.familyMembers.length > 0 && (
                                        <div className="space-y-2 mb-4">
                                            {formData.familyMembers.map((member, idx) => (
                                                <div key={idx} className="bg-white/5 p-3 rounded-xl flex items-center justify-between">
                                                    <div>
                                                        <span className="font-medium text-white">{member.name}</span>
                                                        <span className="text-gray-400 text-sm ml-2">({member.relation}, {member.age} yrs, {member.gender})</span>
                                                        <span className={`ml-2 text-xs px-2 py-0.5 rounded ${member.status === 'Healthy' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{member.status}</span>
                                                    </div>
                                                    <button type="button" onClick={() => removeFamilyMember(idx)} className="text-red-400 hover:text-red-300 flex items-center justify-center">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add Family Member Form */}
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <p className="text-white font-medium mb-4">Add Family Member</p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={newMember.name}
                                                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent text-sm"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Relation"
                                                value={newMember.relation}
                                                onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent text-sm"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Age"
                                                value={newMember.age}
                                                onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent text-sm"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <select
                                                value={newMember.gender}
                                                onChange={(e) => setNewMember({ ...newMember, gender: e.target.value })}
                                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent text-sm"
                                            >
                                                <option value="Male" className="bg-[#0f2828]">Male</option>
                                                <option value="Female" className="bg-[#0f2828]">Female</option>
                                                <option value="Other" className="bg-[#0f2828]">Other</option>
                                            </select>
                                            <select
                                                value={newMember.status}
                                                onChange={(e) => setNewMember({ ...newMember, status: e.target.value })}
                                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent text-sm"
                                            >
                                                <option value="Healthy" className="bg-[#0f2828]">Healthy</option>
                                                <option value="Follow-up" className="bg-[#0f2828]">Follow-up</option>
                                                <option value="Critical" className="bg-[#0f2828]">Critical</option>
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Health Flag (optional)"
                                                value={newMember.flag}
                                                onChange={(e) => setNewMember({ ...newMember, flag: e.target.value })}
                                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent text-sm"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addFamilyMember}
                                            className="mt-4 bg-accent text-[#0a0a1a] px-4 py-2 rounded-lg font-bold hover:bg-accent/90 transition-all text-sm"
                                        >
                                            Add Member
                                        </button>
                                    </div>
                                </div>

                                {formError && (
                                    <p className="text-red-400 text-sm text-center">{formError}</p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-accent text-[#0a0a1a] font-bold py-3 rounded-xl hover:bg-accent/90 transition-all mt-4"
                                >
                                    {modalMode === 'add' ? 'Create Household' : 'Update Household'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHome;
