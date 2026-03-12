import { useState, useEffect } from 'react';
import { AlertTriangle, Filter, XCircle, Info } from 'lucide-react';
import { getCommunityAlerts, dismissAlert, getVillages } from '../../utils/api';
import { getTranslation } from '../../utils/translations';

export default function CommunityAlerts({ language }) {
    const [alerts, setAlerts] = useState([]);
    const [villages, setVillages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterVillage, setFilterVillage] = useState('');
    const [filterType, setFilterType] = useState('');

    const t = (key) => getTranslation(language, key);

    useEffect(() => {
        loadData();
    }, [filterVillage]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [alertsData, villagesData] = await Promise.all([
                getCommunityAlerts(filterVillage),
                getVillages()
            ]);
            setAlerts(alertsData);
            setVillages(villagesData);
        } catch (error) {
            console.error('Error loading alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDismiss = async (alertId) => {
        try {
            await dismissAlert(alertId);
            loadData();
        } catch (error) {
            alert(error.message);
        }
    };

    const filteredAlerts = alerts.filter(a =>
        !filterType || a.type === filterType
    );

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '400px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
            <h1 className="text-2xl font-bold mb-4">{t('communityAlerts')}</h1>

            <div className="alert alert-info mb-4">
                <Info size={20} />
                <div>
                    <strong>{t('aboutAlerts')}</strong>
                    <p className="text-sm mt-1" style={{ marginBottom: 0 }}>
                        {language === 'en'
                            ? 'These alerts are automatically generated when 3 or more households in the same village report the same disease or medication within 30 days. This helps identify potential health outbreaks early.'
                            : language === 'hi'
                                ? 'जब एक ही गाँव में 30 दिनों के भीतर 3 या अधिक परिवार एक ही बीमारी या दवा की रिपोर्ट करते हैं, तो ये अलर्ट स्वचालित रूप से उत्पन्न होते हैं। यह संभावित स्वास्थ्य प्रकोपों की जल्दी पहचान करने में मदद करता है।'
                                : 'ஒரே கிராமத்தில் 30 நாட்களுக்குள் 3 அல்லது அதற்கு மேற்பட்ட குடும்பங்கள் ஒரே நோய் அல்லது மருந்தைப் புகாரளிக்கும்போது இந்த எச்சரிக்கைகள் தானாக உருவாக்கப்படுகின்றன.'}
                    </p>
                </div>
            </div>

            <div className="card mb-4">
                <div className="grid grid-3 gap-3">
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">
                            <Filter size={16} style={{ display: 'inline', marginRight: '8px' }} />
                            {t('village')}
                        </label>
                        <select
                            className="select-field"
                            value={filterVillage}
                            onChange={(e) => setFilterVillage(e.target.value)}
                        >
                            <option value="">All Villages</option>
                            {villages.map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">
                            <Filter size={16} style={{ display: 'inline', marginRight: '8px' }} />
                            {t('type')}
                        </label>
                        <select
                            className="select-field"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="disease">{t('diseaseAlert')}</option>
                            <option value="medication">{t('medicationAlert')}</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <div className="stat-card" style={{ width: '100%', padding: '12px' }}>
                            <div className="text-sm text-secondary">{t('activeAlerts')}</div>
                            <div className="text-2xl font-bold text-primary">{filteredAlerts.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            {filteredAlerts.length === 0 ? (
                <div className="card text-center" style={{ padding: '48px' }}>
                    <AlertTriangle size={48} style={{ margin: '0 auto 16px', opacity: 0.3, color: 'var(--success)' }} />
                    <h3 className="font-bold mb-2">{t('noActiveAlerts')}</h3>
                    <p className="text-secondary">
                        {language === 'en'
                            ? 'No community health patterns detected. This is good news!'
                            : language === 'hi'
                                ? 'कोई सामुदायिक स्वास्थ्य पैटर्न नहीं मिला। यह अच्छी खबर है!'
                                : 'சமூக சுகாதார முறைகள் எதுவும் கண்டறியப்படவில்லை. இது நல்ல செய்தி!'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {filteredAlerts.map((alert) => (
                        <div
                            key={alert._id}
                            className={`card ${alert.severity === 'high' ? 'border-danger' : ''}`}
                            style={{
                                borderLeft: `4px solid ${alert.severity === 'high' ? 'var(--danger)' :
                                    alert.severity === 'medium' ? 'var(--warning)' : 'var(--primary)'
                                    }`
                            }}
                        >
                            <div className="flex-between mb-3">
                                <div className="flex gap-3" style={{ alignItems: 'center', flex: 1 }}>
                                    <div
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: alert.severity === 'high'
                                                ? 'oklch(0.65 0.25 20 / 0.15)'
                                                : 'oklch(0.75 0.20 60 / 0.15)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <AlertTriangle
                                            size={24}
                                            color={alert.severity === 'high' ? 'var(--danger)' : 'var(--warning)'}
                                        />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div className="flex gap-2 mb-1" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                            <h3 className="font-bold text-lg">{alert.issue}</h3>
                                            <span className={`badge badge-${alert.type === 'disease' ? 'danger' : 'warning'
                                                }`}>
                                                {t(alert.type === 'disease' ? 'diseaseAlert' : 'medicationAlert')}
                                            </span>
                                            <span className={`badge badge-${alert.severity === 'high' ? 'danger' :
                                                alert.severity === 'medium' ? 'warning' : 'primary'
                                                }`}>
                                                {t(alert.severity)} {t('severity')}
                                            </span>
                                        </div>

                                        <div className="text-sm text-secondary">
                                            {alert.village} • {alert.affectedHouseholds} {t('affectedHouseholds')}
                                        </div>

                                        <div className="text-xs text-secondary mt-1">
                                            {t('detected')}: {new Date(alert.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleDismiss(alert._id)}
                                    title={t('dismiss')}
                                >
                                    <XCircle size={16} />
                                    {t('dismiss')}
                                </button>
                            </div>

                            {alert.severity === 'high' && (
                                <div className="alert alert-danger" style={{ marginBottom: 0, marginTop: '12px' }}>
                                    <Info size={16} />
                                    <span className="text-sm">
                                        {language === 'en'
                                            ? 'High priority alert! Immediate investigation recommended.'
                                            : language === 'hi'
                                                ? 'उच्च प्राथमिकता अलर्ट! तत्काल जांच की सिफारिश की जाती है।'
                                                : 'உயர் முன்னுரிமை எச்சரிக்கை! உடனடி விசாரணை பரிந்துரைக்கப்படுகிறது.'}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
