import { useState } from 'react';
import { Search, Star, Zap, Award, Gift, Info, CheckCircle, Lock, Lightbulb, Activity, Medal, CheckCircle2, Trophy } from 'lucide-react';
import { getRewards } from '../../utils/api';
import { getTranslation } from '../../utils/translations';

export default function UserRewardsPage({ language }) {
    const [householdId, setHouseholdId] = useState('');
    const [rewards, setRewards] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const t = (key) => getTranslation(language, key);

    const handleSearch = async () => {
        if (!householdId.trim()) {
            setError('Please enter a Household ID');
            return;
        }

        setError('');
        setLoading(true);
        setRewards(null);

        try {
            const data = await getRewards(householdId);
            setRewards(data);
            setTimeout(() => {
                document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            setError('Household ID not found. Please verify and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
            {/* Page Header */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold">{language === 'en' ? 'My Healthcare Rewards' : language === 'hi' ? 'मेरे स्वास्थ्य पुरस्कार' : 'எனது சுகாதார வெகுமதிகள்'}</h1>
                <p className="text-secondary">{language === 'en' ? 'View your accumulated benefits and reward eligibility' : language === 'hi' ? 'अपने संचित लाभ और पुरस्कार पात्रता देखें' : 'உங்கள் திரட்டப்பட்ட நன்மைகள் மற்றும் வெகுமதி தகுதியைக் காண்க'}</p>
            </div>

            {/* Search Card */}
            <div className="card mb-4 fade-in">
                <label className="input-label">{language === 'en' ? 'Household Identification Number' : language === 'hi' ? 'परिवार पहचान संख्या' : 'குடும்ப அடையாள எண்'}</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="input-field"
                        style={{ flex: 1 }}
                        placeholder={language === 'en' ? 'Enter your Household ID (e.g., HH-12345)' : language === 'hi' ? 'अपनी परिवार आईडी दर्ज करें (उदा. HH-12345)' : 'உங்கள் குடும்ப ஐடியை உள்ளிடவும் (எ.கா., HH-12345)'}
                        value={householdId}
                        onChange={(e) => setHouseholdId(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {language === 'en' ? 'View My Rewards' : language === 'hi' ? 'मेरे पुरस्कार देखें' : 'எனது வெகுமதிகளைக் காண்க'}
                    </button>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="alert alert-danger mb-4">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex-center" style={{ padding: '60px' }}>
                    <div className="spinner"></div>
                    <p className="text-secondary mt-3">{language === 'en' ? 'Loading your rewards information...' : language === 'hi' ? 'आपकी पुरस्कार जानकारी लोड हो रही है...' : 'உங்கள் வெகுமதி தகவல் ஏற்றப்படுகிறது...'}</p>
                </div>
            )}

            {/* Results */}
            {rewards && !loading && (
                <div id="results" className="slide-up">
                    {/* ID Card */}
                    <div
                        className="card mb-4"
                        style={{
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '-50%',
                                right: '-10%',
                                width: '300px',
                                height: '300px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '50%'
                            }}
                        ></div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div className="text-sm" style={{ opacity: 0.9, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                {t('householdId')}
                            </div>
                            <div className="text-2xl font-bold" style={{ letterSpacing: '2px' }}>
                                {rewards.householdId}
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-2 gap-3 mb-4">
                        <div className="stat-card">
                            <div className="flex-between mb-2">
                                <Star size={32} color="var(--primary)" />
                                <div className="stat-value" style={{ color: 'var(--primary)' }}>
                                    {rewards.totalPoints}
                                </div>
                            </div>
                            <div className="stat-label">{language === 'en' ? 'Total Reward Points' : language === 'hi' ? 'कुल पुरस्कार अंक' : 'மொத்த வெகுமதி புள்ளிகள்'}</div>
                        </div>

                        <div className="stat-card">
                            <div className="flex-between mb-2">
                                <Zap size={32} color="var(--warning)" />
                                <div className="stat-value" style={{ color: 'var(--warning)' }}>
                                    {rewards.currentStreak}
                                </div>
                            </div>
                            <div className="stat-label">{language === 'en' ? 'Checkup Streak' : language === 'hi' ? 'जांच स्ट्रीक' : 'பரிசோதனை தொடர்'}</div>
                        </div>
                    </div>

                    {/* Badges Section */}
                    {rewards.badges && rewards.badges.length > 0 && (
                        <div className="card mb-4">
                            <div className="flex gap-2 mb-4" style={{ alignItems: 'center' }}>
                                <Award size={24} color="var(--warning)" />
                                <h2 className="card-title" style={{ marginBottom: 0 }}>{language === 'en' ? 'Achievement Badges' : language === 'hi' ? 'उपलब्धि बैज' : 'சாதனை பேட்ஜ்கள்'}</h2>
                            </div>
                            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                                {rewards.badges.map((badge, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: '20px',
                                            background: badge.unlocked ? 'linear-gradient(135deg, var(--success-light), #d1fae5)' : 'var(--bg-secondary)',
                                            border: `2px solid ${badge.unlocked ? 'var(--success)' : 'var(--border)'}`,
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            opacity: badge.unlocked ? 1 : 0.5,
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <div
                                            style={{
                                                width: '56px',
                                                height: '56px',
                                                borderRadius: '12px',
                                                background: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '28px',
                                                flexShrink: 0,
                                                border: `2px solid ${badge.unlocked ? 'var(--success)' : 'var(--border)'}`,
                                                boxShadow: badge.unlocked ? '0 0 0 4px rgba(16, 185, 129, 0.1)' : 'none',
                                                color: badge.unlocked ? 'var(--success)' : 'var(--text-light)'
                                            }}
                                        >
                                            {badge.icon && typeof badge.icon === 'string' && badge.icon.length > 2 && badge.icon.includes('/') ?
                                                <img src={badge.icon} alt="" style={{ width: '32px' }} /> :
                                                (badge.unlocked ?
                                                    (badge.icon === '👨‍👩‍👧‍👦' ? <Award size={28} /> :
                                                        badge.icon === '💪' ? <Zap size={28} /> :
                                                            badge.icon === '💉' ? <Activity size={28} /> :
                                                                badge.icon === '✨' ? <Star size={28} /> :
                                                                    <Medal size={28} />) :
                                                    <Lock size={28} />
                                                )
                                            }
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div className="font-bold">{badge.name}</div>
                                            <div className="text-sm text-secondary mb-1">{badge.desc}</div>
                                            <div
                                                className="text-xs font-bold flex items-center gap-1"
                                                style={{
                                                    color: badge.unlocked ? 'var(--success-dark)' : 'var(--text-light)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}
                                            >
                                                {badge.unlocked ? <><CheckCircle size={12} /> {t('unlocked')}</> : <><Lock size={12} /> {t('unlocked').replace('UN', '')}</>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Benefits Section */}
                    <div className="card mb-4">
                        <div className="flex gap-2 mb-4" style={{ alignItems: 'center' }}>
                            <Gift size={24} color="var(--primary)" />
                            <h2 className="card-title" style={{ marginBottom: 0 }}>{language === 'en' ? 'Available Benefits' : language === 'hi' ? 'उपलब्ध लाभ' : 'கிடைக்கும் நன்மைகள்'}</h2>
                        </div>
                        <div className="grid gap-3">
                            {rewards.rewardTiers?.map((item, index) => {
                                const percentage = Math.min((rewards.totalPoints / item.pointsRequired) * 100, 100);
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            padding: '24px',
                                            background: item.unlocked ? 'linear-gradient(135deg, var(--success-light), #d1fae5)' : 'var(--bg-secondary)',
                                            border: `2px solid ${item.unlocked ? 'var(--success)' : 'var(--border)'}`,
                                            borderRadius: '12px',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => !item.unlocked && (e.currentTarget.style.boxShadow = 'var(--shadow)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                                    >
                                        <div className="flex-between mb-3" style={{ gap: '16px', flexWrap: 'wrap' }}>
                                            <div style={{ flex: 1 }}>
                                                <div className="font-bold text-lg">{item.name}</div>
                                                <div className="text-sm text-secondary">{item.description || `Reward at ${item.pointsRequired} points`}</div>
                                            </div>
                                            <span
                                                className={`badge ${item.unlocked ? 'badge-success' : 'badge-secondary'} flex items-center gap-1`}
                                                style={{ fontSize: '13px', padding: '8px 16px', borderRadius: '20px', whiteSpace: 'nowrap' }}
                                            >
                                                {item.unlocked ? <><CheckCircle size={14} /> {t('unlocked')}</> : t('pointsNeeded').replace('points needed', 'Not Eligible')}
                                            </span>
                                        </div>
                                        {!item.unlocked && (
                                            <div>
                                                <div className="flex-between text-sm font-semibold text-secondary mb-2">
                                                    <span>{rewards.totalPoints} / {item.pointsRequired} {language === 'en' ? 'points' : language === 'hi' ? 'अंक' : 'புள்ளிகள்'}</span>
                                                    <span>{Math.round(percentage)}%</span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="alert alert-info mt-4 flex items-start gap-3" style={{ marginBottom: 0 }}>
                            <Lightbulb size={24} className="shrink-0 text-yellow-500" />
                            <span>
                                {language === 'en'
                                    ? 'Visit your nearest healthcare center to claim eligible benefits. Bring your Household ID for verification.'
                                    : language === 'hi'
                                        ? 'पात्र लाभ प्राप्त करने के लिए अपने निकटतम स्वास्थ्य केंद्र पर जाएँ। सत्यापन के लिए अपनी परिवार आईडी लाएँ।'
                                        : 'தகுதியான நன்மைகளைப் பெற உங்களுக்கு அருகிலுள்ள சுகாதார மையத்தைப் பார்வையிடவும். சரிபார்ப்பிற்காக உங்கள் குடும்ப ஐடியைக் கொண்டு வாருங்கள்.'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
