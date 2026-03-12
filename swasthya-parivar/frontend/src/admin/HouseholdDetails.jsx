import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, Users, Calendar, Star, Award, Zap, Plus, ArrowLeft, Dumbbell, Syringe, Sparkles, Activity } from 'lucide-react';
import { getHousehold, getCheckupHistory, recordCheckup, getRewards } from '../../utils/api';
import { getTranslation } from '../../utils/translations';

export default function HouseholdDetails({ language }) {
    const { householdId } = useParams();
    const navigate = useNavigate();
    const [household, setHousehold] = useState(null);
    const [checkupHistory, setCheckupHistory] = useState([]);
    const [showCheckupModal, setShowCheckupModal] = useState(false);
    const [showRewardsModal, setShowRewardsModal] = useState(false);
    const [rewards, setRewards] = useState(null);
    const [loading, setLoading] = useState(true);

    const t = (key) => getTranslation(language, key);

    useEffect(() => {
        loadData();
    }, [householdId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [householdData, historyData] = await Promise.all([
                getHousehold(householdId),
                getCheckupHistory(householdId)
            ]);
            setHousehold(householdData);
            setCheckupHistory(historyData);
        } catch (error) {
            console.error('Error loading household:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRecordCheckup = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            await recordCheckup({
                householdId,
                diseases: formData.get('diseases').split(',').map(d => d.trim()).filter(Boolean),
                medications: formData.get('medications').split(',').map(m => m.trim()).filter(Boolean)
            });
            setShowCheckupModal(false);
            loadData();
            alert(t('checkupRecorded'));
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCheckRewards = async () => {
        try {
            const rewardsData = await getRewards(householdId);
            setRewards(rewardsData);
            setShowRewardsModal(true);
        } catch (error) {
            console.error('Error loading rewards:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '400px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!household) {
        return (
            <div className="container" style={{ paddingTop: '32px' }}>
                <div className="text-center">
                    <p className="text-secondary">{t('householdNotFound')}</p>
                    <button className="btn btn-primary mt-3" onClick={() => navigate('/households')}>
                        {t('backToHouseholds')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
            <button
                className="btn btn-secondary btn-sm mb-4"
                onClick={() => navigate('/households')}
            >
                <ArrowLeft size={16} />
                {t('back')}
            </button>

            <div className="grid grid-2 gap-4 mb-4">
                <div className="card">
                    <div className="flex gap-3 mb-4" style={{ alignItems: 'center' }}>
                        <div
                            style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Home size={32} color="white" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h1 className="text-xl font-bold">{household.householdId}</h1>
                            <p className="text-secondary">{household.village}</p>
                        </div>
                        <span className={`badge badge-${household.checkupStatus === 'Done' ? 'success' :
                            household.checkupStatus === 'Due' ? 'warning' : 'danger'
                            }`}>
                            {t(household.checkupStatus.toLowerCase())}
                        </span>
                    </div>

                    <div className="grid gap-2">
                        <div className="flex-between">
                            <span className="text-secondary">
                                <Users size={16} style={{ display: 'inline', marginRight: '8px' }} />
                                {t('memberCount')}
                            </span>
                            <span className="font-semibold">{household.memberCount}</span>
                        </div>

                        {household.lastCheckupDate && (
                            <div className="flex-between">
                                <span className="text-secondary">
                                    <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} />
                                    {t('lastCheckup')}
                                </span>
                                <span className="font-semibold">
                                    {new Date(household.lastCheckupDate).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            onClick={() => setShowCheckupModal(true)}
                        >
                            <Plus size={20} />
                            {t('recordCheckup')}
                        </button>
                        <button
                            className="btn btn-success"
                            style={{ flex: 1 }}
                            onClick={handleCheckRewards}
                        >
                            <Award size={20} />
                            {t('checkRewards')}
                        </button>
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-title">{t('gamificationProgress')}</h3>

                    <div className="grid gap-3">
                        <div
                            style={{
                                padding: '16px',
                                background: 'var(--bg-secondary)',
                                borderRadius: '12px'
                            }}
                        >
                            <div className="flex-between mb-1">
                                <span className="text-sm text-secondary">{t('totalPoints')}</span>
                                <Star size={20} color="var(--primary)" />
                            </div>
                            <div className="text-2xl font-bold text-primary">
                                {household.totalPoints || 0}
                            </div>
                        </div>

                        <div
                            style={{
                                padding: '16px',
                                background: 'var(--bg-secondary)',
                                borderRadius: '12px'
                            }}
                        >
                            <div className="flex-between mb-1">
                                <span className="text-sm text-secondary">{t('currentStreak')}</span>
                                <Zap size={20} color="var(--warning)" />
                            </div>
                            <div className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>
                                {household.currentStreak || 0}
                            </div>
                        </div>
                    </div>

                    {household.badges && household.badges.length > 0 && (
                        <div className="mt-3">
                            <div className="text-sm font-semibold mb-2">{t('badges')}</div>
                            <div className="flex gap-2 flex-wrap">
                                {household.badges.map((badge, i) => (
                                    <div
                                        key={i}
                                        className="badge badge-success flex items-center gap-1"
                                        title={badge.desc}
                                    >
                                        {badge.icon === '👨‍👩‍👧‍👦' ? <Users size={14} /> :
                                            badge.icon === '💪' ? <Dumbbell size={14} /> :
                                                badge.icon === '💉' ? <Syringe size={14} /> :
                                                    badge.icon === '✨' ? <Sparkles size={14} /> :
                                                        badge.icon === '🏥' ? <Activity size={14} /> :
                                                            <Award size={14} />}
                                        {badge.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="flex-between mb-4">
                    <h3 className="card-title">{t('checkupHistory')}</h3>
                    <span className="text-sm text-secondary">
                        {checkupHistory.length} {t('total')}
                    </span>
                </div>

                {checkupHistory.length === 0 ? (
                    <div className="text-center text-secondary" style={{ padding: '32px' }}>
                        <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                        <p>{t('noCheckupHistory')}</p>
                    </div>
                ) : (
                    <div className="grid gap-2">
                        {checkupHistory.map((checkup) => (
                            <div
                                key={checkup._id}
                                style={{
                                    padding: '16px',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '12px'
                                }}
                            >
                                <div className="flex-between mb-2">
                                    <span className="font-semibold">
                                        {new Date(checkup.checkupDate).toLocaleDateString()}
                                    </span>
                                    <span className="badge badge-success">
                                        +{checkup.pointsEarned} {t('points')}
                                    </span>
                                </div>

                                {checkup.diseases && checkup.diseases.length > 0 && (
                                    <div className="text-sm mb-1">
                                        <span className="text-secondary">{t('diseases')}: </span>
                                        <span>{checkup.diseases.join(', ')}</span>
                                    </div>
                                )}

                                {checkup.medications && checkup.medications.length > 0 && (
                                    <div className="text-sm">
                                        <span className="text-secondary">{t('medications')}: </span>
                                        <span>{checkup.medications.join(', ')}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showCheckupModal && (
                <div className="modal-overlay" onClick={() => setShowCheckupModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">{t('recordCheckup')}</h2>

                        <form onSubmit={handleRecordCheckup}>
                            <div className="input-group">
                                <label className="input-label">{t('diseases')} ({t('optional')})</label>
                                <input
                                    type="text"
                                    name="diseases"
                                    className="input-field"
                                    placeholder={t('enterDiseases')}
                                />
                                <small className="text-secondary">{t('separateByComma')}</small>
                            </div>

                            <div className="input-group">
                                <label className="input-label">{t('medications')} ({t('optional')})</label>
                                <input
                                    type="text"
                                    name="medications"
                                    className="input-field"
                                    placeholder={t('enterMedications')}
                                />
                                <small className="text-secondary">{t('separateByComma')}</small>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    style={{ flex: 1 }}
                                    onClick={() => setShowCheckupModal(false)}
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    {t('submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showRewardsModal && rewards && (
                <div className="modal-overlay" onClick={() => setShowRewardsModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">{t('rewards')}</h2>

                        <div className="grid grid-2 gap-3 mb-4">
                            <div className="stat-card">
                                <div className="flex-between mb-2">
                                    <Star size={24} color="var(--primary)" />
                                    <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
                                        {rewards.totalPoints}
                                    </div>
                                </div>
                                <div className="stat-label">{t('totalPoints')}</div>
                            </div>

                            <div className="stat-card">
                                <div className="flex-between mb-2">
                                    <Zap size={24} color="var(--warning)" />
                                    <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--warning)' }}>
                                        {rewards.currentStreak}
                                    </div>
                                </div>
                                <div className="stat-label">{t('currentStreak')}</div>
                            </div>
                        </div>

                        {rewards.badges && rewards.badges.length > 0 && (
                            <div className="mb-4">
                                <h3 className="font-bold mb-2">{t('unlockedBadges')}</h3>
                                <div className="flex gap-2 flex-wrap">
                                    {rewards.badges.filter(b => b.unlocked).map((badge, i) => (
                                        <div key={i} className="badge badge-success reward-badge flex items-center gap-1">
                                            {badge.icon === '👨‍👩‍👧‍👦' ? <Users size={14} /> :
                                                badge.icon === '💪' ? <Dumbbell size={14} /> :
                                                    badge.icon === '💉' ? <Syringe size={14} /> :
                                                        badge.icon === '✨' ? <Sparkles size={14} /> :
                                                            badge.icon === '🏥' ? <Activity size={14} /> :
                                                                <Award size={14} />}
                                            {badge.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {rewards.rewardTiers && rewards.rewardTiers.length > 0 && (
                            <div>
                                <h3 className="font-bold mb-2">{t('availableRewards')}</h3>
                                <div className="grid gap-2">
                                    {rewards.rewardTiers.map((tier, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                padding: '12px',
                                                background: tier.unlocked ? 'var(--success-light)' : 'var(--bg-secondary)',
                                                borderRadius: '8px',
                                                border: tier.unlocked ? '2px solid var(--success)' : '2px solid var(--border)'
                                            }}
                                        >
                                            <div className="flex-between">
                                                <span className="font-semibold">{tier.name}</span>
                                                <span className={`badge ${tier.unlocked ? 'badge-success' : 'badge-secondary'}`}>
                                                    {tier.unlocked ? t('unlocked') : `${tier.pointsRequired} pts`}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            className="btn btn-secondary mt-4"
                            style={{ width: '100%' }}
                            onClick={() => setShowRewardsModal(false)}
                        >
                            {t('close')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
