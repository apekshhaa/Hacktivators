import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RefreshCw, Loader2, ShieldAlert } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;

// --- Simulated lat/lng positions for households around a village center ---
const VILLAGE_CENTER = [12.8712, 74.8425];
const HOUSE_COORDS = [
    [12.8712, 74.8425], [12.8705, 74.8430], [12.8721, 74.8412],
    [12.8698, 74.8440], [12.8730, 74.8418], [12.8715, 74.8450],
    [12.8700, 74.8410], [12.8725, 74.8435], [12.8690, 74.8422],
    [12.8735, 74.8445], [12.8708, 74.8405], [12.8718, 74.8460],
    [12.8695, 74.8448], [12.8740, 74.8408], [12.8702, 74.8455],
    [12.8728, 74.8400], [12.8692, 74.8435], [12.8738, 74.8428],
    [12.8710, 74.8415], [12.8720, 74.8440],
];

const CLUSTER_RADIUS_METERS = 200;
const CLUSTER_MIN_COUNT = 3;

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

const RISK_COLORS = {
    High: '#ef4444',
    Moderate: '#eab308',
    Low: '#22c55e',
};

// Haversine distance in meters
const haversineDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const createHouseIcon = (riskLevel, isOwn = false, isInCluster = false) => {
    const color = RISK_COLORS[riskLevel] || RISK_COLORS.Low;
    const ring = isOwn ? `<circle cx="16" cy="16" r="15" fill="none" stroke="#d1f072" stroke-width="2.5" stroke-dasharray="4 2"/>` : '';
    const glowFilter = isInCluster
        ? `<defs><filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`
        : '';
    const filterAttr = isInCluster ? ' filter="url(#glow)"' : '';
    const outerGlow = isInCluster
        ? `<circle cx="16" cy="16" r="14" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="0.5" stroke-opacity="0.4"/>`
        : '';
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            ${glowFilter}
            ${ring}
            ${outerGlow}
            <circle cx="16" cy="16" r="12" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="1.5"${filterAttr}/>
            <path d="M16 8 L24 15 L22 15 L22 22 L18 22 L18 18 L14 18 L14 22 L10 22 L10 15 L8 15 Z" fill="${color}" fill-opacity="0.9"${filterAttr}/>
        </svg>`;
    return L.divIcon({
        html: svg,
        className: `custom-house-marker ${isInCluster ? 'cluster-glow-marker' : ''}`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
    });
};

const detectOutbreakClusters = (householdsWithCoords) => {
    const highRisk = householdsWithCoords.filter(h => h.risk === 'High');
    if (highRisk.length < CLUSTER_MIN_COUNT) return [];

    const clusters = [];
    const visited = new Set();

    for (let i = 0; i < highRisk.length; i++) {
        if (visited.has(i)) continue;
        const cluster = [highRisk[i]];
        visited.add(i);

        // Find all high-risk households within radius from any member of the cluster
        let expanded = true;
        while (expanded) {
            expanded = false;
            for (let j = 0; j < highRisk.length; j++) {
                if (visited.has(j)) continue;
                const isNearby = cluster.some(c =>
                    haversineDistance(c.lat, c.lng, highRisk[j].lat, highRisk[j].lng) <= CLUSTER_RADIUS_METERS
                );
                if (isNearby) {
                    cluster.push(highRisk[j]);
                    visited.add(j);
                    expanded = true;
                }
            }
        }

        if (cluster.length >= CLUSTER_MIN_COUNT) {
            // Calculate cluster center
            const centerLat = cluster.reduce((s, h) => s + h.lat, 0) / cluster.length;
            const centerLng = cluster.reduce((s, h) => s + h.lng, 0) / cluster.length;
            clusters.push({
                members: cluster,
                center: [centerLat, centerLng],
                ids: cluster.map(h => h.householdId),
            });
        }
    }
    return clusters;
};

// Auto-fit map bounds
const FitBounds = ({ households }) => {
    const map = useMap();
    useEffect(() => {
        if (households.length > 0) {
            const bounds = L.latLngBounds(households.map(h => [h.lat, h.lng]));
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
        }
    }, [households, map]);
    return null;
};

const VillageHealthMap = ({ role = 'user' }) => {
    const isAdmin = role === 'admin';
    const [households, setHouseholds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clusters, setClusters] = useState([]);
    const [riskFilter, setRiskFilter] = useState('All');
    const userHouseholdId = localStorage.getItem('userHouseholdId');

    // Set of household IDs that are inside a cluster (for glow effect)
    const clusterHouseholdIds = useMemo(() => {
        const ids = new Set();
        clusters.forEach(c => c.ids.forEach(id => ids.add(id)));
        return ids;
    }, [clusters]);

    const fetchHouseholds = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://localhost:5000/api/households');
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();

            const mapped = data.map((h, idx) => ({
                ...h,
                lat: HOUSE_COORDS[idx % HOUSE_COORDS.length][0],
                lng: HOUSE_COORDS[idx % HOUSE_COORDS.length][1],
                risk: getRiskLevel(h),
            }));

            setHouseholds(mapped);
            setClusters(detectOutbreakClusters(mapped));
        } catch {
            setError('Unable to load village data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchHouseholds(); }, []);

    const riskCounts = useMemo(() => ({
        High: households.filter(h => h.risk === 'High').length,
        Moderate: households.filter(h => h.risk === 'Moderate').length,
        Low: households.filter(h => h.risk === 'Low').length,
    }), [households]);

    const displayedHouseholds = riskFilter === 'All'
        ? households
        : households.filter(h => h.risk === riskFilter);

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 flex-wrap gap-2">
                <div>
                    <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent inline-block"></span>
                        Village Health Map
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                        {isAdmin ? 'Monitor all household health risks' : 'Your village health overview'}
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-3 text-[10px]">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Low ({riskCounts.Low})</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Moderate ({riskCounts.Moderate})</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> High ({riskCounts.High})</span>
                    </div>

                    {isAdmin && (
                        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
                            {['All', 'High', 'Moderate', 'Low'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setRiskFilter(f)}
                                    className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${riskFilter === f ? 'bg-accent text-[#0a0a1a]' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={fetchHouseholds}
                        className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <RefreshCw size={12} />
                    </button>
                </div>
            </div>

            {/* Outbreak Alert Banners */}
            {isAdmin && clusters.length > 0 && (
                <div className="mx-4 mt-4 space-y-2">
                    {clusters.map((cluster, idx) => (
                        <div key={idx} className="bg-red-500/15 border border-red-500/30 rounded-xl p-3 flex items-start gap-3 outbreak-alert-pulse">
                            <ShieldAlert size={20} className="text-red-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-red-400">Potential Outbreak Detected</p>
                                <p className="text-xs text-red-300/80 mt-0.5">
                                    {cluster.members.length} nearby high-risk households: {cluster.ids.join(', ')}
                                </p>
                                <p className="text-[10px] text-red-300/60 mt-1 italic">
                                    Clustered within {CLUSTER_RADIUS_METERS}m radius. Immediate investigation recommended.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Admin: Stats */}
            {isAdmin && !loading && households.length > 0 && (
                <div className="mx-4 mt-3 grid grid-cols-4 gap-2">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-white">{households.length}</p>
                        <p className="text-[9px] text-gray-500 uppercase">Total</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-red-400">{riskCounts.High}</p>
                        <p className="text-[9px] text-gray-500 uppercase">High</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-yellow-400">{riskCounts.Moderate}</p>
                        <p className="text-[9px] text-gray-500 uppercase">Moderate</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-green-400">{riskCounts.Low}</p>
                        <p className="text-[9px] text-gray-500 uppercase">Low</p>
                    </div>
                </div>
            )}

            {/* Map */}
            <div className="relative" style={{ height: '450px' }}>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center z-[500] bg-black/40">
                        <Loader2 size={28} className="animate-spin text-accent" />
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center z-[500]">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <MapContainer
                    center={VILLAGE_CENTER}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={true}
                    className="rounded-b-2xl"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    <FitBounds households={displayedHouseholds} />

                    {/* Outbreak cluster circles */}
                    {clusters.map((cluster, idx) => (
                        <Circle
                            key={`cluster-${idx}`}
                            center={cluster.center}
                            radius={CLUSTER_RADIUS_METERS}
                            pathOptions={{
                                color: '#ef4444',
                                weight: 2,
                                opacity: 0.7,
                                fillColor: '#ef4444',
                                fillOpacity: 0.12,
                                dashArray: '6 4',
                                className: 'outbreak-zone-circle',
                            }}
                        />
                    ))}

                    {/* Household markers */}
                    {displayedHouseholds.map((h) => {
                        const isOwn = h.householdId === userHouseholdId;
                        const isInCluster = clusterHouseholdIds.has(h.householdId);
                        return (
                            <Marker
                                key={h.householdId}
                                position={[h.lat, h.lng]}
                                icon={createHouseIcon(h.risk, isOwn, isInCluster)}
                            >
                                <Popup className="custom-dark-popup">
                                    <div style={{
                                        background: '#1a1a2e',
                                        color: 'white',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        minWidth: '180px',
                                        fontFamily: 'Inter, sans-serif',
                                        border: `1px solid ${RISK_COLORS[h.risk]}40`,
                                    }}>
                                        <p style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                                            {isOwn && <span style={{ color: '#d1f072', marginRight: '6px' }}>★</span>}
                                            {h.householdId}
                                        </p>
                                        <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px' }}>
                                            Head: {h.head} · {h.village}
                                        </p>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '3px 10px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            color: RISK_COLORS[h.risk],
                                            background: `${RISK_COLORS[h.risk]}20`,
                                            border: `1px solid ${RISK_COLORS[h.risk]}40`,
                                        }}>
                                            Risk Level: {h.risk.toUpperCase()}
                                        </div>
                                        {isInCluster && (
                                            <div style={{
                                                marginTop: '6px',
                                                padding: '3px 8px',
                                                background: '#ef444420',
                                                border: '1px solid #ef444440',
                                                borderRadius: '8px',
                                                fontSize: '10px',
                                                color: '#f87171',
                                                fontWeight: 600,
                                            }}>
                                                ⚠ Inside outbreak cluster zone
                                            </div>
                                        )}
                                        {isAdmin && h.familyMembers?.length > 0 && (
                                            <div style={{ marginTop: '8px', borderTop: '1px solid #ffffff15', paddingTop: '8px' }}>
                                                <p style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Members</p>
                                                {h.familyMembers.map((m) => (
                                                    <div key={m._id} style={{
                                                        fontSize: '11px',
                                                        padding: '2px 0',
                                                        color: m.status === 'Critical' ? '#f87171' : m.status === 'Follow-up' ? '#fbbf24' : '#86efac'
                                                    }}>
                                                        {m.name}: {m.status}{m.flag ? ` — ${m.flag}` : ''}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>

            {/* Styles */}
            <style>{`
                .custom-house-marker { background: none !important; border: none !important; }
                .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; padding: 0 !important; border-radius: 12px !important; }
                .leaflet-popup-content { margin: 0 !important; }
                .leaflet-popup-tip { background: #1a1a2e !important; }
                .leaflet-container { background: #0a0a1a !important; }
                .leaflet-control-zoom a { background: #1a1a2e !important; color: white !important; border-color: #ffffff15 !important; }
                .leaflet-control-zoom a:hover { background: #2d1b69 !important; }
                .leaflet-control-attribution { background: rgba(10,10,26,0.8) !important; color: #6b7280 !important; }
                .leaflet-control-attribution a { color: #9ca3af !important; }

                /* Cluster glow marker animation */
                .cluster-glow-marker {
                    animation: marker-glow 2s ease-in-out infinite;
                }
                @keyframes marker-glow {
                    0%, 100% { filter: drop-shadow(0 0 4px rgba(239,68,68,0.4)); }
                    50% { filter: drop-shadow(0 0 12px rgba(239,68,68,0.8)); }
                }

                /* Outbreak zone circle pulsing */
                .outbreak-zone-circle {
                    animation: zone-pulse 3s ease-in-out infinite;
                }
                @keyframes zone-pulse {
                    0%, 100% { stroke-opacity: 0.7; fill-opacity: 0.08; }
                    50% { stroke-opacity: 1; fill-opacity: 0.18; }
                }

                /* Alert banner pulse */
                .outbreak-alert-pulse {
                    animation: alert-pulse 2.5s ease-in-out infinite;
                }
                @keyframes alert-pulse {
                    0%, 100% { border-color: rgba(239,68,68,0.3); background-color: rgba(239,68,68,0.08); }
                    50% { border-color: rgba(239,68,68,0.6); background-color: rgba(239,68,68,0.15); }
                }
            `}</style>
        </div>
    );
};

export default VillageHealthMap;
