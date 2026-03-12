import React, { useState, useEffect, useRef } from 'react';
import {
    Brain, User, Baby, Users, Sparkles, Loader2,
    Lock, Unlock, AlertCircle, AlertTriangle,
    ShieldCheck, ShieldAlert, ShieldOff,
    ChevronDown, ChevronUp, Phone
} from 'lucide-react';
import { getRiskAnalysis } from '../../services/api';
import SymptomChecker from './SymptomChecker';

// ─────────────────────────────────────────────
// Simple labels for rural users
// ─────────────────────────────────────────────
const RISK_LABELS = {
    Low:      { label: 'Safe',            hint: 'Health looks good right now.',             color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  bar: 'bg-green-500'  },
    Mild:     { label: 'Watch Out',       hint: 'Keep an eye on this person.',              color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', bar: 'bg-yellow-400' },
    Moderate: { label: 'Needs Attention', hint: 'Should visit health centre soon.',         color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', bar: 'bg-orange-500' },
    High:     { label: 'See Doctor Now',  hint: 'Please go to a doctor or call ASHA worker.', color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    bar: 'bg-red-500'    },
    Hidden:   { label: 'Locked',          hint: 'Record is private.',                       color: 'text-gray-400',   bg: 'bg-gray-500/10',   border: 'border-gray-500/20',   bar: 'bg-gray-500'   },
};
const RL = (level) => RISK_LABELS[level] || RISK_LABELS.Low;

// Translate technical risk reasons to plain simple language
const simplifyReason = (reason) => {
    if (!reason) return reason;
    const r = reason.toLowerCase();
    if (r.includes('infant'))         return 'Very young child — needs extra care';
    if (r.includes('elderly'))        return 'Elderly person — immune system is weaker';
    if (r.includes('child'))          return 'Child — growing body needs monitoring';
    if (r.includes('middle-aged'))    return 'Middle age — some risk factors';
    if (r.includes('critical'))       return 'Serious health condition — see doctor now';
    if (r.includes('follow-up'))      return 'Doctor said to come back — not done yet';
    if (r.includes('overdue'))        return 'Missed health checkup visit';
    if (r.includes('active flag'))    return `Health problem noticed: ${reason.split(': ')[1] || ''}`;
    if (r.includes('recurring'))      return `Same illness coming back: ${reason.split(': ')[1] || ''}`;
    return reason;
};

// ─────────────────────────────────────────────
// Health Advisory
// ─────────────────────────────────────────────
const HealthAdvisory = ({ prompt }) => {
    const [tip, setTip] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);

    const get = async () => {
        if (fetched) return;
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: prompt, language: 'English' })
            });
            const d = await res.json();
            setTip(d.reply || d.response || d.message || 'No advice available.');
            setFetched(true);
        } catch {
            setTip('Advisory not available right now. Try again later.');
            setFetched(true);
        } finally { setLoading(false); }
    };

    return (
        <div className="mt-3 rounded-xl border border-accent/20 overflow-hidden">
            <button onClick={get} className="w-full flex items-center gap-2 px-4 py-2.5 bg-accent/5 hover:bg-accent/10 transition-colors text-left">
                <Sparkles size={14} className="text-accent shrink-0" />
                <span className="text-sm text-gray-200 font-medium flex-1">
                    {loading ? 'Getting advisory details…' : fetched ? 'Health Advisory (tap to refresh)' : 'Get Health Advisory'}
                </span>
                {loading && <Loader2 size={14} className="text-accent animate-spin shrink-0" />}
            </button>
            {(tip || loading) && (
                <div className="px-4 py-3 text-sm text-gray-200 leading-relaxed bg-black/20">
                    {loading
                        ? <span className="text-gray-500 flex items-center gap-2 text-xs"><Loader2 size={10} className="animate-spin" /> Analyzing data…</span>
                        : <>{tip}</>}
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────
// Inline password gate for locked record
// ─────────────────────────────────────────────
const PasswordGate = ({ member, householdId, onUnlocked }) => {
    const [pw, setPw] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true); setErr('');
        try {
            const res = await fetch(
                `http://localhost:5000/api/households/${householdId}/members/${member.memberId}/unlock`,
                { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) }
            );
            const d = await res.json();
            if (res.ok) onUnlocked({ status: d.status, flag: d.flag });
            else setErr(d.message || 'Wrong password. Try again.');
        } catch { setErr('Server error. Please try again.'); }
        finally { setLoading(false); }
    };

    return (
        <div className="mt-3 bg-blue-500/5 border border-blue-500/25 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
                <Lock size={16} className="text-blue-400" />
                <p className="text-sm text-blue-300 font-medium">This is your private record. Enter your password to see your health risk.</p>
            </div>
            <form onSubmit={submit} className="flex gap-2">
                <input
                    type="password" value={pw} onChange={e => setPw(e.target.value)}
                    placeholder="Your password…"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-accent/50"
                    required
                />
                <button type="submit" disabled={loading}
                    className="flex items-center gap-1.5 bg-accent text-[#0a0a1a] px-4 py-2 rounded-lg text-sm font-bold hover:bg-accent/90 disabled:opacity-50">
                    {loading ? <Loader2 size={13} className="animate-spin" /> : <Unlock size={13} />}
                    {loading ? '…' : 'Open'}
                </button>
            </form>
            {err && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle size={12} />{err}</p>}
        </div>
    );
};

// ─────────────────────────────────────────────
// MEMBER RISK CARD — used for both own & head views
// ─────────────────────────────────────────────
const MemberRiskCard = ({ member, householdId, isOwn = false, isHighlighted = false, expanded: forceExpanded = false, preUnlockedData = null }) => {
    const [expanded, setExpanded] = useState(forceExpanded);
    const [unlockedData, setUnlockedData] = useState(preUnlockedData);
    const cardRef = useRef(null);

    // Auto-scroll + expand when highlighted (head clicked this member in the list)
    useEffect(() => {
        if (isHighlighted) {
            setExpanded(true);
            cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isHighlighted]);

    // Compute risk locally after unlock (for locked members)
    const computeLocalRisk = (status, flag) => {
        let score = 0; const reasons = [];
        if (member.age < 5)        { score += 30; reasons.push('Infant (high vulnerability)'); }
        else if (member.age < 12)  { score += 15; reasons.push('Child (moderate vulnerability)'); }
        else if (member.age >= 60) { score += 30; reasons.push('Elderly (high vulnerability)'); }
        else if (member.age >= 45) { score += 10; reasons.push('Middle-aged'); }
        if (status === 'Critical')      { score += 40; reasons.push('Critical health status'); }
        else if (status === 'Follow-up'){ score += 20; reasons.push('Pending follow-up'); }
        else if (status === 'Due')      { score += 10; reasons.push('Checkup overdue'); }
        if (flag) { score += 20; reasons.push(`Active flag: ${flag}`); }
        score = Math.min(score, 100);
        return { score, level: score >= 70 ? 'High' : score >= 40 ? 'Moderate' : score >= 20 ? 'Mild' : 'Low', reasons };
    };

    const isLocked = member.isLocked && !unlockedData;
    const risk = unlockedData ? computeLocalRisk(unlockedData.status, unlockedData.flag) : member.risk;
    const rl = RL(isLocked ? 'Hidden' : risk.level);

    const aiPrompt = `A ${member.age}-year-old ${member.gender} named ${member.name} (${member.relation}) in a rural Indian village has a ${risk.level} health risk. Reasons: ${risk.reasons.join(', ')}. In 1-2 very simple sentences (no medical jargon), what should the family do right now?`;

    return (
        <div ref={cardRef} className={`rounded-2xl border transition-all duration-300
            ${isHighlighted ? `${rl.border} ring-2 ring-accent/40 ${rl.bg}` : `${rl.border} ${rl.bg}`}`}>

            {/* Top row — always visible */}
            <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => setExpanded(p => !p)}
            >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center border ${rl.border} ${rl.bg} shrink-0`}>
                    {member.age < 12 ? <Baby size={20} className={rl.color} /> : <User size={20} className={rl.color} />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-base leading-tight">{member.name}</p>
                    <p className="text-gray-400 text-xs">
                        {member.relation} · {member.age} yrs
                        {risk?.predictedCondition && risk.predictedCondition !== "Healthy" && (
                             <span className="ml-2 text-accent font-medium bg-accent/10 px-1.5 py-0.5 rounded">
                                  Suspects: {risk.predictedCondition}
                             </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-sm font-bold px-3 py-1 rounded-full border ${rl.color} ${rl.bg} ${rl.border}`}>
                        {rl.label}
                    </span>
                    {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
            </div>

            {/* Expanded content */}
            {expanded && (
                <div className="px-4 pb-4 border-t border-white/10 pt-3 space-y-3">
                    {isLocked && isOwn ? (
                        <PasswordGate member={member} householdId={householdId} onUnlocked={setUnlockedData} />
                    ) : isLocked && !isOwn ? (
                        <div className="flex items-center gap-2 text-sm text-blue-400 py-2">
                            <Lock size={14} />
                            <span>This member has set a private lock on their record.</span>
                        </div>
                    ) : (
                        <>
                            {/* Big simple status hint */}
                            <div className={`rounded-xl px-4 py-3 ${rl.bg} border ${rl.border}`}>
                                <p className={`text-base font-bold ${rl.color}`}>{rl.label}</p>
                                <p className="text-sm text-gray-300 mt-1">{rl.hint}</p>
                            </div>

                            {/* Risk score bar */}
                            <div>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Risk Level</span>
                                    <span className={rl.color}>{risk.score}/100</span>
                                </div>
                                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                    <div className={`h-full ${rl.bar} rounded-full transition-all duration-700`} style={{ width: `${risk.score}%` }} />
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                                    <span>Safe</span><span>Watch Out</span><span>Danger</span>
                                </div>
                            </div>

                            {/* Simplified reasons */}
                            {risk.reasons.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Why this risk?</p>
                                    {risk.reasons.map((r, i) => (
                                        <div key={i} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                                            <span className="text-sm leading-snug text-gray-200">{simplifyReason(r)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Disease Probability Breakdown */}
                            {risk.diseaseRisks && risk.diseaseRisks.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Disease Screening Results</p>
                                    <div className="bg-white/5 rounded-xl p-3 space-y-2.5">
                                        {risk.diseaseRisks.map((dr, i) => {
                                            const pct = dr.probability;
                                            const isHealthy = dr.disease === 'Healthy';
                                            const barColor = isHealthy
                                                ? 'bg-green-500'
                                                : pct >= 50 ? 'bg-red-500'
                                                : pct >= 20 ? 'bg-orange-500'
                                                : pct >= 10 ? 'bg-yellow-500'
                                                : 'bg-gray-500';
                                            const textColor = isHealthy
                                                ? 'text-green-400'
                                                : pct >= 50 ? 'text-red-400'
                                                : pct >= 20 ? 'text-orange-400'
                                                : pct >= 10 ? 'text-yellow-400'
                                                : 'text-gray-400';
                                            return (
                                                <div key={i}>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className={`text-xs font-semibold ${textColor}`}>
                                                            {dr.disease}
                                                        </span>
                                                        <span className={`text-xs font-bold ${textColor}`}>
                                                            {pct}%
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${barColor} rounded-full transition-all duration-700`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ASHA tip for high risk */}
                            {(risk.level === 'High' || risk.level === 'Moderate') && (
                                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                    <Phone size={16} className="text-red-400 shrink-0" />
                                    <p className="text-sm text-red-200">Contact your <strong>ASHA worker</strong> or go to the nearest <strong>health centre</strong> soon.</p>
                                </div>
                            )}

                            <HealthAdvisory prompt={aiPrompt} />

                            {/* Symptom Checker - Only for own profile */}
                            {isOwn && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <SymptomChecker member={member} householdId={householdId} />
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────
// Family risk section (head only)
// ─────────────────────────────────────────────
const FamilyRiskSection = ({ family }) => {
    const rl = RL(family.riskLevel);
    const aiPrompt = `A rural Indian household has a ${family.riskLevel} overall health risk. ${family.alerts.map(a => a.message).join('. ')}. Give 2 very simple actions the family should take. Use plain Hindi-style simple English, no medical terms.`;

    return (
        <div className="space-y-4">
            {/* Overall score card */}
            <div className={`rounded-2xl border ${rl.border} ${rl.bg} p-5`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center ${rl.bg} border ${rl.border}`}>
                        <Users size={20} className={rl.color} />
                    </div>
                    <div>
                        <p className="font-bold text-white text-base">Family Health</p>
                        <p className={`text-sm font-semibold ${rl.color}`}>{rl.label}</p>
                    </div>
                    <div className="ml-auto text-right">
                        <p className={`text-2xl font-black ${rl.color}`}>{family.avgScore}</p>
                        <p className="text-[10px] text-gray-500">out of 100</p>
                    </div>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-1">
                    <div className={`h-full ${rl.bar} rounded-full`} style={{ width: `${family.avgScore}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                    <span>Safe</span><span>Watch Out</span><span>Danger</span>
                </div>
            </div>

            {/* Alerts — in simple language */}
            {family.alerts.length > 0 ? (
                <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Health Alerts in Family</p>
                    {family.alerts.map((alert, i) => {
                        const al = RL(alert.severity);
                        return (
                            <div key={i} className={`rounded-xl border ${al.border} ${al.bg} p-4`}>
                                <p className={`text-base font-bold ${al.color} mb-1`}>
                                    {alert.possibleCondition
                                        ? `Possible ${alert.possibleCondition.charAt(0).toUpperCase() + alert.possibleCondition.slice(1)}`
                                        : 'Health Alert'}
                                </p>
                                <p className="text-sm text-gray-200 leading-relaxed">{alert.message}</p>
                                {alert.recommendation && (
                                    <p className="text-sm text-gray-400 mt-2 bg-white/5 rounded-lg px-3 py-2">
                                        <strong>Recommendation:</strong> {alert.recommendation}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-4">
                    <ShieldCheck size={24} className="text-green-400 shrink-0" />
                    <div>
                        <p className="font-bold text-green-400">Family Looks Good!</p>
                        <p className="text-sm text-gray-300">No common illness found spreading in your family right now.</p>
                    </div>
                </div>
            )}

            <HealthAdvisory prompt={aiPrompt} />
        </div>
    );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const RiskDetector = ({ data: householdData, currentUserName, isHead, selectedMemberId, forceSingleView = false, singleMemberId, preUnlockedData }) => {
    const [riskData, setRiskData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(forceSingleView ? 'individual' : 'individual');

    // Fetch whenever householdId changes
    useEffect(() => {
        if (!householdData?.householdId) return;
        setLoading(true);
        setError(null);
        getRiskAnalysis(householdData.householdId)
            .then(d => { d ? setRiskData(d) : setError('Risk data could not be loaded.'); })
            .catch(() => setError('Failed to load. Check your connection.'))
            .finally(() => setLoading(false));
    }, [householdData?.householdId]);

    // Find own member for non-head user
    const myMember = riskData?.individual?.find(
        m => m.name?.toLowerCase().trim() === currentUserName?.toLowerCase().trim()
    ) ?? riskData?.individual?.[0];

    // Find highlighted member for head (when they clicked a member in the family list above)
    const highlightedId = selectedMemberId;

    // In single view mode, find the specific member
    const targetMember = forceSingleView && riskData?.individual?.find(
        m => m.name?.toLowerCase().trim() === singleMemberId?.toLowerCase().trim()
    );

    const tabs = isHead && !forceSingleView
        ? [{ id: 'individual', label: 'All Members', Icon: Users }, { id: 'family', label: 'Family Health', Icon: ShieldAlert }]
        : [{ id: 'individual', label: forceSingleView ? 'Health Risk' : 'My Health Risk', Icon: User }];

    return (
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            {/* Header */}
            {!forceSingleView && (
                <div className="p-5 border-b border-white/10 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <Brain size={22} className="text-accent" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Health Risk Assessment</h3>
                        <p className="text-xs text-gray-400">
                            {isHead ? 'Check health risk for each family member' : 'Check your own health risk'}
                        </p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            {!forceSingleView && (
                <div className="flex border-b border-white/10">
                    {tabs.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all
                                ${activeTab === id ? 'text-accent border-b-2 border-accent bg-accent/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Icon size={16} />{label}
                        </button>
                    ))}
                </div>
            )}

            {/* Body */}
            <div className="p-5">
                {loading && (
                    <div className="flex flex-col items-center py-14 gap-3">
                        <Loader2 size={36} className="text-accent animate-spin" />
                        <p className="text-gray-300 font-medium">Checking health risks…</p>
                        <p className="text-gray-500 text-sm">This will take a moment</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="flex flex-col items-center py-10 gap-3 text-center">
                        <ShieldOff size={32} className="text-red-400" />
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                )}

                {riskData && !loading && (
                    <>
                        {/* SINGLE MEMBER VIEW MODE */}
                        {forceSingleView && targetMember && (
                            <div className="space-y-2">
                                <MemberRiskCard
                                    member={targetMember}
                                    householdId={householdData.householdId}
                                    isOwn={isHead || targetMember.name?.toLowerCase().trim() === currentUserName?.toLowerCase().trim()} // Head or true owner can check symptoms
                                    expanded={true}
                                    preUnlockedData={preUnlockedData}
                                />
                            </div>
                        )}

                        {/* NORMAL MODE: HEAD - see all members */}
                        {activeTab === 'individual' && isHead && !forceSingleView && (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-400 mb-3">
                                    Tap on any name to see their full health risk details.
                                </p>
                                {riskData.individual.map((member, i) => (
                                    <MemberRiskCard
                                        key={member.memberId || i}
                                        member={member}
                                        householdId={householdData.householdId}
                                        isOwn={member.name?.toLowerCase().trim() === currentUserName?.toLowerCase().trim()}
                                        isHighlighted={
                                            highlightedId &&
                                            (member.memberId?.toString() === highlightedId?.toString() || member.name === highlightedId)
                                        }
                                    />
                                ))}
                            </div>
                        )}

                        {/* NORMAL MODE: NON-HEAD - see only own card */}
                        {activeTab === 'individual' && !isHead && !forceSingleView && myMember && (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400 mb-3">This is your personal health risk summary.</p>
                                <MemberRiskCard
                                    member={myMember}
                                    householdId={householdData.householdId}
                                    isOwn={true}
                                    expanded={true}
                                />
                            </div>
                        )}

                        {/* FAMILY (head only) */}
                        {activeTab === 'family' && isHead && riskData.family && (
                            <FamilyRiskSection family={riskData.family} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default RiskDetector;
