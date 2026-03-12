import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from 'recharts';
import {
    ArrowLeft, Activity, Shield, Clock, AlertTriangle,
    ChevronDown, RefreshCw, Zap, TrendingDown, TrendingUp, Sparkles
} from 'lucide-react';

const OutbreakPrediction = () => {
    const navigate = useNavigate();

    // Filter States (Interactive)
    const [timeRange, setTimeRange] = useState('Last 14 Days');
    const [village, setVillage] = useState('All Villages');
    const [analysisType, setAnalysisType] = useState('Trend Analysis');
    const [smoothing, setSmoothing] = useState('None');

    // Chart View States
    const [chartView, setChartView] = useState('Daily'); // Daily | Weekly | Monthly
    const [multiFactorView, setMultiFactorView] = useState('Area'); // Area | Line | Bar

    // Dropdown toggles (Simulated for UI)
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Mock Options
    const options = {
        time: ['Last 7 Days', 'Last 14 Days', 'Last 30 Days', 'Last Quarter'],
        village: ['All Villages', 'Rampur', 'Madhopur', 'Sonpur', 'Kishanpur'],
        analysis: ['Trend Analysis', 'Predictive Modeling', 'Risk Assessment'],
        smoothing: ['None', 'Moving Average', 'Exponential']
    };

    const handleDropdownClick = (key) => {
        setActiveDropdown(activeDropdown === key ? null : key);
    };

    const handleOptionSelect = (setter, value) => {
        setter(value);
        setActiveDropdown(null);
    };

    // Data States
    const [trendData, setTrendData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [aiInsights, setAiInsights] = useState([]);
    const [multiFactorData, setMultiFactorData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [correlationMatrix, setCorrelationMatrix] = useState([]);
    const [stats, setStats] = useState({ cases: '...', risk: '...', responseTime: '...', efficiency: '...' });

    // Fetch Prediction Data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({
                    village: village,
                    days: timeRange
                });
                const response = await fetch(`http://localhost:5000/api/predict?${params.toString()}`);
                const data = await response.json();

                if (data.history && data.forecast) {
                    // Combine history and forecast for charts
                    // We'll take the last 14 days of history + 7 days forecast
                    const recentHistory = data.history.slice(-14).map(d => ({
                        ...d,
                        cases: d.fever_cases, // Map backend 'fever_cases' to 'cases' for charts
                        type: 'Actual'
                    }));

                    const forecast = data.forecast.map(d => ({
                        ...d,
                        type: 'Forecast'
                    }));

                    const combinedTrend = [...recentHistory, ...forecast];
                    setTrendData(combinedTrend);

                    // Generate Table Data (Last 5 Actual + Forecasts)
                    const lastActual = recentHistory[recentHistory.length - 1];
                    const tableRows = [...recentHistory.slice(-2).reverse(), ...forecast.slice(0, 3)].map(row => {
                        // Mock other metrics based on cases for now, since CSV might not have them all or we want to derive them
                        const waterQuality = Math.max(70, 98 - (row.cases * 0.8)).toFixed(1);
                        const isForecast = row.type === 'Forecast';

                        return {
                            date: row.date,
                            cases: row.cases,
                            water: waterQuality,
                            safety: `${Math.round(waterQuality)}/100`,
                            trend: isForecast ? 'N/A' : (row.cases > 10 ? 2 : -2), // Simple mock logic
                            pred: isForecast ? row.cases : '—',
                            isForecast
                        };
                    });
                    setTableData(tableRows);
                    setCorrelationMatrix(data.correlationMatrix || []);

                    // Multi-factor data from real CSV history
                    const mfData = data.history.slice(-14).map(d => ({
                        date: d.date,
                        fever: d.fever_cases,
                        cough: d.cough_cases,
                        diarrhea: d.diarrhea_cases,
                        risk: d.env_risk_index * 5 // scale for visibility
                    }));
                    setMultiFactorData(mfData);

                    // Dynamic Insights
                    const lastCase = lastActual.cases;
                    const nextPred = forecast[0].cases;
                    const trendIcon = nextPred > lastCase ? TrendingUp : TrendingDown;
                    const trendText = nextPred > lastCase ? 'Rising' : 'Declining';
                    const trendColor = nextPred > lastCase ? 'text-red-400' : 'text-green-400';
                    const trendBg = nextPred > lastCase ? 'bg-red-500/10' : 'bg-green-500/10';

                    // Calculate average risk from history
                    const avgRisk = (recentHistory.reduce((sum, d) => sum + (d.env_risk_index || 0), 0) / recentHistory.length).toFixed(1);

                    setAiInsights([
                        { label: 'TREND DIRECTION', val: trendText, icon: trendIcon, color: trendColor, bg: trendBg },
                        { label: 'ENVIRONMENTAL RISK', val: `${avgRisk}/10`, icon: Shield, color: 'text-white', bg: 'bg-white/5' },
                        { label: 'CORRELATION (F/R)', val: `r=${(data.correlationMatrix?.[3] || 0.72).toFixed(2)}`, icon: Activity, color: 'text-white', bg: 'bg-white/5' },
                        { label: 'FORECAST (7-DAY)', val: nextPred > lastCase ? 'Potential Outbreak' : 'Stable Trend', icon: Clock, color: trendColor, bg: trendBg },
                        { label: 'RISK LEVEL', val: nextPred > 30 ? 'High' : 'Low', icon: AlertTriangle, color: nextPred > 30 ? 'text-red-400' : 'text-blue-400', bg: nextPred > 30 ? 'bg-red-500/10' : 'bg-blue-500/10' },
                    ]);

                    // Store stats for KPIs
                    setStats({
                        cases: lastCase,
                        risk: (100 - (avgRisk * 10)).toFixed(1), // Inverse for "Safety"
                        responseTime: (2.0 + (lastCase * 0.05)).toFixed(1),
                        efficiency: (95 - (avgRisk * 0.5)).toFixed(1)
                    });
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch predictions:", error);
                // Set fallback state to indicate error in UI if needed
                setIsLoading(false);
            }
        };

        console.log("Fetching prediction data from API...");
        fetchData();
    }, [timeRange, village]);

    if (isLoading) {
        return <div className="min-h-screen bg-[#0d4648] flex items-center justify-center text-teal-400 animate-pulse">Running AI Prediction Models...</div>;
    }

    return (
        <div className="min-h-screen font-sans bg-gradient-to-br from-[#0d4648] to-[#2b4548] text-white p-6 pb-20 relative overflow-hidden">

            {/* Background Ambient Glows (Matches Home/AdminHome) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/40 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin-home')} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-teal-500">
                            Community Health Monitor
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full hover:bg-green-500/20 transition-colors cursor-default">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">System Operational</span>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Time Range', value: timeRange, options: options.time, setter: setTimeRange, id: 'time' },
                        { label: 'Village Network', value: village, options: options.village, setter: setVillage, id: 'village' },
                        { label: 'Analysis Type', value: analysisType, options: options.analysis, setter: setAnalysisType, id: 'analysis' },
                        { label: 'Smoothing', value: smoothing, options: options.smoothing, setter: setSmoothing, id: 'smoothing' }
                    ].map((filter, idx) => (
                        <div key={idx} className="flex flex-col gap-1 relative z-20">
                            <label className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider pl-1">{filter.label}</label>
                            <div
                                onClick={() => handleDropdownClick(filter.id)}
                                className="bg-[#112828] border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-accent/40 hover:shadow-[0_0_15px_rgba(45,212,191,0.1)] transition-all"
                            >
                                <span className="text-sm text-gray-200 font-medium">{filter.value}</span>
                                <ChevronDown size={14} className={`text-gray-500 transition-transform ${activeDropdown === filter.id ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Dropdown Menu */}
                            {activeDropdown === filter.id && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-[#0f2828] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                    {filter.options.map((opt) => (
                                        <div
                                            key={opt}
                                            onClick={() => handleOptionSelect(filter.setter, opt)}
                                            className="px-4 py-2.5 text-sm text-gray-300 hover:bg-accent/10 hover:text-accent cursor-pointer transition-colors border-b border-white/5 last:border-0"
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: 'Active Cases', value: stats.cases, change: 'Real-time', trend: 'down', color: 'text-red-400', icon: Activity },
                        { title: 'Environmental Safety', value: `${stats.risk}%`, change: 'Based on index', trend: 'up', color: 'text-green-400', icon: Shield },
                        { title: 'Response Time', value: `${stats.responseTime}h`, change: 'Estimated', trend: 'up', color: 'text-blue-400', icon: Clock },
                        { title: 'Alert Efficiency', value: `${stats.efficiency}%`, change: 'Current', trend: 'up', color: 'text-purple-400', icon: Zap }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">{stat.title}</h3>
                                <stat.icon size={16} className={`text-gray-500 group-hover:${stat.color} transition-colors`} />
                            </div>
                            <div className="text-4xl font-light text-white mb-2 tracking-tight">{stat.value}</div>
                            <div className={`text-xs font-medium flex items-center gap-1 ${stat.trend === 'down' ? 'text-green-400' : 'text-green-400'} ${stat.title === 'Active Cases' ? 'text-green-400' : ''}`}>
                                {/* Note: Logic adjusted - generally green is good. For cases, down is good (green). For others, up is good (green). */}
                                {stat.trend === 'down' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                                {stat.change}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Charts Section - Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                    {/* Fever Case Trends (2/3 Width) */}
                    <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-colors">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-serif text-white flex items-center gap-2">
                                <TrendingUp size={20} className="text-teal-400" />
                                Fever Case Trends
                            </h2>
                            <div className="flex bg-[#0d4648] rounded-lg p-1 border border-white/10">
                                {['Daily', 'Weekly', 'Monthly'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setChartView(tab)}
                                        className={`px-4 py-1.5 text-xs rounded-md transition-all font-medium ${chartView === tab ? 'bg-teal-500/20 text-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.2)]' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-[300px] w-full min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                                    <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0d4648', borderColor: '#ffffff20', color: '#fff', borderRadius: '8px' }}
                                        itemStyle={{ color: '#2dd4bf' }}
                                        cursor={{ stroke: '#ffffff20' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="cases"
                                        stroke="#2dd4bf"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorCases)"
                                        activeDot={{ r: 6, fill: '#2dd4bf', stroke: '#fff', strokeWidth: 2 }}
                                        dot={(props) => {
                                            const { cx, cy, payload } = props;
                                            if (payload.type === 'Forecast') {
                                                return <circle cx={cx} cy={cy} r={4} fill="#fb923c" stroke="#fff" strokeWidth={1} />;
                                            }
                                            return <circle cx={cx} cy={cy} r={0} />;
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Correlation Matrix (1/3 Width) - Moved Here */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-colors flex flex-col">
                        <h2 className="text-xl font-serif text-white mb-4">Correlation Matrix</h2>
                        <div className="flex-1 flex items-center justify-center">
                            <div className="grid grid-cols-4 gap-1 w-full aspect-square max-w-[300px]">
                                {(correlationMatrix.length > 0 ? correlationMatrix : new Array(16).fill(0)).map((val, i) => (
                                    <div key={i} className="rounded flex items-center justify-center text-[10px] font-mono text-black font-bold transition-transform hover:scale-105"
                                        style={{ backgroundColor: `rgba(45, 212, 191, ${Math.abs(val)})`, opacity: Math.abs(val) < 0.2 ? 0.3 : 1 }}>
                                        {val.toFixed(2)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Main Charts Section - Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                    {/* Multi-Factor Analysis (2/3 Width) */}
                    <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-colors">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-serif text-white flex items-center gap-2">
                                <Activity size={20} className="text-pink-400" />
                                Multi-Factor Analysis
                            </h2>
                            <div className="flex bg-[#0d4648] rounded-lg p-1 border border-white/10">
                                {['Area', 'Line', 'Bar'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setMultiFactorView(tab)}
                                        className={`px-3 py-1.5 text-xs rounded-md transition-all font-medium ${multiFactorView === tab ? 'bg-pink-500/20 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-6 mb-4 text-xs justify-center">
                            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span> <span className="text-gray-300">Fever</span></div>
                            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-400"></span> <span className="text-gray-300">Cough</span></div>
                            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span> <span className="text-gray-300">Diarrhea</span></div>
                            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> <span className="text-gray-300">Risk Index</span></div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {multiFactorView === 'Bar' ? (
                                    <BarChart data={multiFactorData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                                        <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                                        <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0d4648', borderColor: '#ffffff20', borderRadius: '8px' }} cursor={{ fill: '#ffffff05' }} />
                                        <Bar dataKey="fever" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="cough" fill="#f472b6" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="diarrhea" fill="#fb923c" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="risk" fill="#facc15" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                ) : (
                                    <LineChart data={multiFactorData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                                        <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                                        <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0d4648', borderColor: '#ffffff20', borderRadius: '8px' }} />
                                        <Line type="monotone" dataKey="fever" stroke="#2dd4bf" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="cough" stroke="#f472b6" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="diarrhea" stroke="#fb923c" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="risk" stroke="#facc15" strokeWidth={2} dot={false} />
                                    </LineChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AI Insights (1/3 Width) - Moved Here */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-colors">
                        <h2 className="text-xl font-serif text-white mb-1 flex items-center gap-2">
                            <Sparkles size={18} className="text-yellow-400" />
                            Insights
                        </h2>
                        <p className="text-xs text-gray-500 mb-4">Real-time predictive analysis</p>

                        <div className="space-y-3">
                            {aiInsights.map((insight, i) => (
                                <div key={i} className={`p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors ${insight.bg}`}>
                                    <div className="text-[10px] uppercase text-gray-400 tracking-wider mb-1">{insight.label}</div>
                                    <div className="flex items-center gap-2">
                                        {insight.icon && <insight.icon size={14} className={insight.color} />}
                                        <div className={`text-lg font-bold ${insight.color}`}>{insight.val}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Data Table */}
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                    <div className="grid grid-cols-6 gap-4 p-4 border-b border-white/10 text-[10px] uppercase text-gray-400 font-semibold tracking-wider bg-black/20">
                        <div>Date</div>
                        <div>Cases Reported</div>
                        <div>Water Quality</div>
                        <div>Env. Safety</div>
                        <div>Trend</div>
                        <div>Prediction</div>
                    </div>
                    {tableData.map((row, idx) => (
                        <div key={idx} className="grid grid-cols-6 gap-4 p-4 border-b border-white/5 text-sm hover:bg-white/5 transition-colors items-center last:border-0">
                            <div className="text-gray-300 font-medium">{row.date}</div>
                            <div className="text-white font-bold">{row.cases}</div>
                            <div className="text-gray-300">{row.water}</div>
                            <div className="text-gray-300">{row.safety}</div>
                            <div>
                                {row.trend === 'N/A' ? (
                                    <span className="text-gray-500">N/A</span>
                                ) : row.trend < 0 ? (
                                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 w-fit">
                                        <TrendingDown size={12} /> {Math.abs(row.trend)}%
                                    </span>
                                ) : (
                                    <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 w-fit">
                                        <TrendingUp size={12} /> {row.trend}%
                                    </span>
                                )}
                            </div>
                            <div className="text-teal-300 font-medium">{row.pred}</div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default OutbreakPrediction;
