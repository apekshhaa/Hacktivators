import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Plus, Search, Filter, Users, Calendar } from 'lucide-react';
import { getHouseholds, createHousehold, getVillages } from '../../utils/api';
import { getTranslation } from '../../utils/translations';

export default function Households({ language }) {
    const navigate = useNavigate();
    const [households, setHouseholds] = useState([]);
    const [villages, setVillages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterVillage, setFilterVillage] = useState('');

    const t = (key) => getTranslation(language, key);

    useEffect(() => {
        loadData();
    }, [filterStatus, filterVillage]);

    const loadData = async () => {
        try {
            setLoading(true);
            const filters = {};
            if (filterStatus) filters.status = filterStatus;
            if (filterVillage) filters.village = filterVillage;

            const [householdsData, villagesData] = await Promise.all([
                getHouseholds(filters),
                getVillages()
            ]);
            setHouseholds(householdsData);
            setVillages(villagesData);
        } catch (error) {
            console.error('Error loading households:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddHousehold = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            await createHousehold({
                householdId: formData.get('householdId'),
                village: formData.get('village'),
                memberCount: parseInt(formData.get('memberCount')) || 1
            });
            setShowAddModal(false);
            loadData();
            alert(t('householdCreated'));
        } catch (error) {
            alert(error.message);
        }
    };

    const filteredHouseholds = households.filter(h =>
        h.householdId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.village.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="flex-between mb-4">
                <h1 className="text-2xl font-bold">{t('households')}</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddModal(true)}
                >
                    <Plus size={20} />
                    {t('addHousehold')}
                </button>
            </div>

            <div className="card mb-4">
                <div className="grid grid-3 gap-3">
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">
                            <Search size={16} style={{ display: 'inline', marginRight: '8px' }} />
                            {t('search')}
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder={t('householdId') + ' / ' + t('village')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">
                            <Filter size={16} style={{ display: 'inline', marginRight: '8px' }} />
                            {t('status')}
                        </label>
                        <select
                            className="select-field"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="Done">{t('done')}</option>
                            <option value="Due">{t('due')}</option>
                            <option value="Missed">{t('missed')}</option>
                        </select>
                    </div>

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
                            <option value="">All</option>
                            {villages.map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-2 gap-3">
                {filteredHouseholds.map((household) => (
                    <div
                        key={household._id}
                        className="card"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/household/${household.householdId}`)}
                    >
                        <div className="flex-between mb-3">
                            <div className="flex gap-2" style={{ alignItems: 'center' }}>
                                <Home size={24} color="var(--primary)" />
                                <div>
                                    <div className="font-bold text-lg">{household.householdId}</div>
                                    <div className="text-sm text-secondary">{household.village}</div>
                                </div>
                            </div>
                            <span className={`badge badge-${household.checkupStatus === 'Done' ? 'success' :
                                household.checkupStatus === 'Due' ? 'warning' : 'danger'
                                }`}>
                                <span className={`status-dot ${household.checkupStatus.toLowerCase()}`}></span>
                                {t(household.checkupStatus.toLowerCase())}
                            </span>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex-between text-sm">
                                <span className="text-secondary">
                                    <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                    {t('memberCount')}:
                                </span>
                                <span className="font-semibold">{household.memberCount}</span>
                            </div>

                            {household.lastCheckupDate && (
                                <div className="flex-between text-sm">
                                    <span className="text-secondary">
                                        <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                        {t('lastCheckup')}:
                                    </span>
                                    <span className="font-semibold">
                                        {new Date(household.lastCheckupDate).toLocaleDateString()}
                                    </span>
                                </div>
                            )}

                            {household.totalPoints > 0 && (
                                <div className="flex-between text-sm">
                                    <span className="text-secondary">{t('totalPoints')}:</span>
                                    <span className="font-bold text-primary">{household.totalPoints}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-3 flex gap-2">
                            <button
                                className="btn btn-primary btn-sm"
                                style={{ flex: 1 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/household/${household.householdId}`);
                                }}
                            >
                                {t('viewDetails')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredHouseholds.length === 0 && (
                <div className="text-center text-secondary" style={{ padding: '48px' }}>
                    <Home size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                    <p>{t('noData')}</p>
                </div>
            )}

            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">{t('createHousehold')}</h2>

                        <form onSubmit={handleAddHousehold}>
                            <div className="input-group">
                                <label className="input-label">{t('householdId')} *</label>
                                <input
                                    type="text"
                                    name="householdId"
                                    className="input-field"
                                    placeholder={t('enterHouseholdId')}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">{t('village')} *</label>
                                <input
                                    type="text"
                                    name="village"
                                    className="input-field"
                                    placeholder={t('enterVillage')}
                                    list="villages-list"
                                    required
                                />
                                <datalist id="villages-list">
                                    {villages.map(v => (
                                        <option key={v} value={v} />
                                    ))}
                                </datalist>
                            </div>

                            <div className="input-group">
                                <label className="input-label">{t('memberCount')}</label>
                                <input
                                    type="number"
                                    name="memberCount"
                                    className="input-field"
                                    placeholder={t('enterMemberCount')}
                                    min="1"
                                    defaultValue="1"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    style={{ flex: 1 }}
                                    onClick={() => setShowAddModal(false)}
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
        </div>
    );
}
