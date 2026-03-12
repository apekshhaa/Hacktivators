import React, { useState, useEffect } from 'react';
import {
    Globe, TrendingUp, TrendingDown, Minus,
    Thermometer, Wind, Droplets, Activity,
    Sparkles, Loader2, ShieldCheck, ShieldAlert, ShieldOff,
    RefreshCw
} from 'lucide-react';

const RISK_COLORS = {
    Low:      { color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20'  },
    Mild:     { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    Moderate: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    High:     { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20'    },
    Unknown:  { color: 'text-gray-400',   bg: 'bg-gray-500/10',   border: 'border-gray-500/20'   },
};
const getRC = (level) => RISK_COLORS[level] || RISK_COLORS.Unknown;

const AIInsight = ({ prompt }) => {
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);

    const fetchInsight = async () => {
        if (fetched) return;
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: prompt, language: 'English' })
            });
            const data = await res.json();
            setInsight(data.reply || data.response || data.message || 'No health advisory available.');
            setFetched(true);
        } catch {
            setInsight('Advisory unavailable — please check your connection.');
            setFetched(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border border-white/10 rounded-xl overflow-hidden mt-4">
            <button
                onClick={fetchInsight}
                className="w-full flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 transition-colors text-xs text-left"
            >
                <Sparkles size={12} className="text-accent shrink-0" />
                <span className="text-gray-300 font-medium flex-1">Community Health Advisory</span>
                {loading
                    ? <Loader2 size={12} className="text-accent animate-spin shrink-0" />
                    : <span className="text-gray-500 text-[10px]">{fetched ? 'Tap to refresh' : 'Tap for advisory'}</span>}
            </button>
            {(insight || loading) && (
                <div className="px-4 py-2.5 text-xs text-gray-300 leading-relaxed bg-black/20">
                    {loading
                        ? <span className="text-gray-500 flex items-center gap-2"><Loader2 size={10} className="animate-spin" /> Analysing…</span>
                        : insight}
                </div>
            )}
        </div>
    );
};

const CommunityRiskWidget = () => {
    const [community, setCommunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const householdId = localStorage.getItem('userHouseholdId');

    const fetchData = () => {
        setLoading(true);
        setError(null);
        fetch(`http://localhost:5000/api/risk/${householdId || 'HH001'}`)
            .then(r => r.json())
            .then(d => {
                if (d.community) setCommunity({ ...d.community, village: d.village });
                else setError('Community data unavailable');
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load community risk data');
                setLoading(false);
            });
    };

    useEffect(() => { fetchData(); }, []);

    const TrendIcon = community?.trend === 'Rising' ? TrendingUp
        : community?.trend === 'Falling' ? TrendingDown : Minus;
    const trendColor = community?.trend === 'Rising' ? 'text-red-400'
        : community?.trend === 'Falling' ? 'text-green-400' : 'text-yellow-400';

    const rc = community ? getRC(community.communityRiskLevel) : getRC('Unknown');

    const metrics = community ? [
        { label: 'Fever/Day', value: community.avgFever, Icon: Thermometer, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
        { label: 'Cough/Day', value: community.avgCough, Icon: Wind, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
        { label: 'Diarrhea/Day', value: community.avgDiarrhea, Icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { label: 'Env. Risk', value: `${community.avgRisk}/10`, Icon: Activity, color: rc.color, bg: rc.bg, border: rc.border },
    ] : [];

    const aiPrompt = community
        ? `Village ${community.village || 'unknown'} has ${community.communityRiskLevel} community health risk. 14-day averages: fever ${community.avgFever}/day, cough ${community.avgCough}/day, diarrhea ${community.avgDiarrhea}/day, env risk ${community.avgRisk}/10. Trend: ${community.trend}. In 2-3 sentences, explain what this means for families and simple precautions. Use plain everyday language.`
        : '';

    return (
        <div className={`rounded-2xl border ${rc.border} ${rc.bg} p-5 backdrop-blur-sm`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rc.bg} border ${rc.border}`}>
                        <Globe size={18} className={rc.color} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-sm">Community Health Risk</h3>
                        <p className="text-[11px] text-gray-400">
                            {community?.village || 'Your Village'} · Last 14 Days
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {community && (
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${rc.border} ${rc.bg}`}>
                            <span className={`text-sm font-bold ${rc.color}`}>{community.communityRiskLevel}</span>
                        </div>
                    )}
                    {community && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10">
                            <TrendIcon size={13} className={trendColor} />
                            <span className={`text-xs font-medium ${trendColor}`}>{community.trend}</span>
                        </div>
                    )}
                    <button
                        onClick={fetchData}
                        className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={12} />
                    </button>
                </div>
            </div>

            {/* States */}
            {loading && (
                <div className="flex items-center gap-2 text-gray-500 text-xs py-4 justify-center">
                    <Loader2 size={14} className="animate-spin text-accent" />
                    Loading community risk data…
                </div>
            )}
            {error && !loading && (
                <p className="text-red-400 text-xs text-center py-4">{error}</p>
            )}

            {community && !loading && (
                <>
                    {/* Message */}
                    <p className="text-sm text-gray-300 leading-relaxed mb-4 border-l-2 border-accent/50 pl-3">
                        {community.message}
                    </p>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-1">
                        {metrics.map((m, i) => {
                            const Icon = m.Icon;
                            return (
                                <div key={i} className={`rounded-xl border ${m.border} ${m.bg} px-3 py-2.5 flex items-center gap-2`}>
                                    <Icon size={14} className={m.color} />
                                    <div>
                                        <p className="text-[10px] text-gray-500 leading-none">{m.label}</p>
                                        <p className={`text-sm font-bold ${m.color} leading-tight`}>{m.value}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <AIInsight prompt={aiPrompt} />
                </>
            )}
        </div>
    );
};

export default CommunityRiskWidget;
