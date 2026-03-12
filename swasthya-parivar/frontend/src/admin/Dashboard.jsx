import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, TrendingUp, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { getDashboardStats, getHouseholds, getCommunityAlerts } from '../../utils/api';
import { getTranslation } from '../../utils/translations';

export default function Dashboard({ language }) {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [households, setHouseholds] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVillage, setSelectedVillage] = useState(null);

    const t = (key) => getTranslation(language, key);

    useEffect(() => {
        loadData();
    }, [selectedVillage]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [statsData, householdsData, alertsData] = await Promise.all([
                getDashboardStats(selectedVillage),
                getHouseholds(selectedVillage ? { village: selectedVillage } : {}),
                getCommunityAlerts(selectedVillage)
            ]);
            setStats(statsData);
            setHouseholds(householdsData);
            setAlerts(alertsData);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '400px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
            {/* Stats Grid */}
            <div className="grid grid-4 mb-4 fade-in">
                <div className="stat-card">
                    <div className="flex-between mb-2">
                        <Users size={32} color="var(--primary)" />
                        <div className="stat-value">{stats?.totalHouseholds || 0}</div>
                    </div>
                    <div className="stat-label">{t('totalHouseholds')}</div>
                </div>

                <div className="stat-card">
                    <div className="flex-between mb-2">
                        <CheckCircle size={32} color="var(--success)" />
                        <div className="stat-value" style={{ color: 'var(--success)' }}>
                            {stats?.doneCount || 0}
                        </div>
                    </div>
                    <div className="stat-label">{t('checkupsDone')}</div>
                </div>

                <div className="stat-card">
                    <div className="flex-between mb-2">
                        <Clock size={32} color="var(--warning)" />
                        <div className="stat-value" style={{ color: 'var(--warning)' }}>
                            {stats?.dueCount || 0}
                        </div>
                    </div>
                    <div className="stat-label">{t('checkupsDue')}</div>
                </div>

                <div className="stat-card">
                    <div className="flex-between mb-2">
                        <XCircle size={32} color="var(--danger)" />
                        <div className="stat-value" style={{ color: 'var(--danger)' }}>
                            {stats?.missedCount || 0}
                        </div>
                    </div>
                    <div className="stat-label">{t('checkupsMissed')}</div>
                </div>
            </div>

            {/* Completion Rate */}
            {stats && (
                <div className="card mb-4 slide-up">
                    <div className="flex-between mb-2">
                        <h3 className="card-title">{t('completionRate')}</h3>
                        <span className="text-2xl font-bold text-primary">{stats.completionRate}%</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${stats.completionRate}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Community Alerts */}
            {alerts.length > 0 && (
                <div className="mb-4 slide-up">
                    <h3 className="text-xl font-bold mb-3 flex gap-2" style={{ alignItems: 'center' }}>
                        <AlertTriangle size={24} color="var(--danger)" />
                        {t('communityAlerts')}
                    </h3>
                    <div className="grid grid-2 gap-3">
                        {alerts.slice(0, 4).map((alert) => (
                            <div
                                key={alert._id}
                                className={`alert ${alert.severity === 'high' ? 'alert-danger' : 'alert-warning'}`}
                            >
                                <AlertTriangle size={20} />
                                <div style={{ flex: 1 }}>
                                    <div className="font-semibold">
                                        {alert.type === 'disease' ? t('diseaseAlert') : t('medicationAlert')}: {alert.issue}
                                    </div>
                                    <div className="text-sm text-secondary">
                                        {alert.affectedHouseholds} {t('affectedHouseholds')}
                                    </div>
                                </div>
                                <span className={`badge badge-${alert.severity === 'high' ? 'danger' : 'warning'}`}>
                                    {t(alert.severity)}
                                </span>
                            </div>
                        ))}
                    </div>
                    {alerts.length > 4 && (
                        <button
                            className="btn btn-secondary mt-3"
                            onClick={() => navigate('/alerts')}
                        >
                            {t('viewDetails')}
                        </button>
                    )}
                </div>
            )}

            {/* Recent Households */}
            <div className="card slide-up">
                <div className="flex-between mb-3">
                    <h3 className="card-title">{t('households')}</h3>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate('/households')}
                    >
                        {t('viewDetails')}
                    </button>
                </div>

                <div className="grid gap-3">
                    {households.slice(0, 6).map((household) => (
                        <div
                            key={household._id}
                            className="flex-between"
                            style={{
                                padding: '16px',
                                background: 'var(--bg-secondary)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => navigate(`/household/${household.householdId}`)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--bg-card)';
                                e.currentTarget.style.transform = 'translateX(4px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--bg-secondary)';
                                e.currentTarget.style.transform = 'translateX(0)';
                            }}
                        >
                            <div className="flex gap-3" style={{ alignItems: 'center' }}>
                                <Home size={24} color="var(--primary)" />
                                <div>
                                    <div className="font-semibold">{household.householdId}</div>
                                    <div className="text-sm text-secondary">{household.village}</div>
                                </div>
                            </div>
                            <div className="flex gap-2" style={{ alignItems: 'center' }}>
                                <span className={`badge badge-${household.checkupStatus === 'Done' ? 'success' :
                                    household.checkupStatus === 'Due' ? 'warning' : 'danger'
                                    }`}>
                                    <span className={`status-dot ${household.checkupStatus.toLowerCase()}`}></span>
                                    {t(household.checkupStatus.toLowerCase())}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
