const API_BASE_URL = 'http://localhost:5000/api';

// Households
export const getHouseholds = async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/households?${params}`);
    if (!response.ok) throw new Error('Failed to fetch households');
    return response.json();
};

export const getHousehold = async (householdId) => {
    const response = await fetch(`${API_BASE_URL}/households/${householdId}`);
    if (!response.ok) throw new Error('Household not found');
    return response.json();
};

export const createHousehold = async (data) => {
    const response = await fetch(`${API_BASE_URL}/households`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create household');
    }
    return response.json();
};

export const updateHousehold = async (householdId, data) => {
    const response = await fetch(`${API_BASE_URL}/households/${householdId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update household');
    return response.json();
};

// Checkups
export const recordCheckup = async (data) => {
    const response = await fetch(`${API_BASE_URL}/checkups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to record checkup');
    return response.json();
};

export const getCheckupHistory = async (householdId) => {
    const response = await fetch(`${API_BASE_URL}/checkups/${householdId}`);
    if (!response.ok) throw new Error('Failed to fetch checkup history');
    return response.json();
};

// Rewards
export const getRewards = async (householdId) => {
    const response = await fetch(`${API_BASE_URL}/rewards/${householdId}`);
    if (!response.ok) throw new Error('Failed to fetch rewards');
    return response.json();
};

// Community Alerts
export const getCommunityAlerts = async (village = '') => {
    const params = village ? `?village=${encodeURIComponent(village)}` : '';
    const response = await fetch(`${API_BASE_URL}/community-alerts${params}`);
    if (!response.ok) throw new Error('Failed to fetch community alerts');
    return response.json();
};

export const dismissAlert = async (alertId) => {
    const response = await fetch(`${API_BASE_URL}/community-alerts/${alertId}/dismiss`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error('Failed to dismiss alert');
    return response.json();
};

// Analytics
export const getDashboardStats = async (village = '') => {
    const params = village ? `?village=${encodeURIComponent(village)}` : '';
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard${params}`);
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
};

export const getVillages = async () => {
    const response = await fetch(`${API_BASE_URL}/villages`);
    if (!response.ok) throw new Error('Failed to fetch villages');
    return response.json();
};

// Status Update (Admin only)
export const updateStatuses = async () => {
    const response = await fetch(`${API_BASE_URL}/update-statuses`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to update statuses');
    return response.json();
};
