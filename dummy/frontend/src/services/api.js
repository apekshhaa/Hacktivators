import axios from 'axios';

const API_Base_URL = 'http://localhost:5000/api';

export const getRecentAppointments = async () => {
    try {
        const response = await axios.get(`${API_Base_URL}/checkups/recent`);
        return response.data;
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return [];
    }
};

export const createHousehold = async (householdData) => {
    try {
        const response = await axios.post(`${API_Base_URL}/households`, householdData);
        return response.data;
    } catch (error) {
        console.error("Error creating household:", error);
        throw error;
    }
};

export const updateHousehold = async (householdId, householdData) => {
    try {
        const response = await axios.put(`${API_Base_URL}/households/${householdId}`, householdData);
        return response.data;
    } catch (error) {
        console.error("Error updating household:", error);
        throw error;
    }
};

export const getHouseholdSummary = async (householdId) => {
    try {
        const response = await axios.get(`${API_Base_URL}/summary/${householdId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching household summary:", error);
        return null;
    }
};

export const getRewards = async (householdId) => {
    try {
        const response = await axios.get(`${API_Base_URL}/rewards/${householdId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching rewards:", error);
        throw error;
    }
};
export const updateRewards = async (householdId, rewardsData) => {
    try {
        const response = await axios.post(`${API_Base_URL}/rewards/${householdId}`, rewardsData);
        return response.data;
    } catch (error) {
        console.error("Error updating rewards:", error);
        throw error;
    }
};

export const getRiskAnalysis = async (householdId) => {
    try {
        const response = await axios.get(`${API_Base_URL}/risk/${householdId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching risk analysis:", error);
        return null;
    }
};
