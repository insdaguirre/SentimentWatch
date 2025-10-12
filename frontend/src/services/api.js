import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://stocksentiment-e3cfd7d49077.herokuapp.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fetchStats = async (ticker, hours = 24) => {
  try {
    const response = await api.get(`/sentiment/stats/${ticker}`, {
      params: { hours }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export const fetchCurrentSentiment = async (ticker) => {
  try {
    const response = await api.get(`/sentiment/current/${ticker}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching current sentiment:', error);
    throw error;
  }
};

export const fetchSnapshots = async (ticker, limit = 50, timeWindow = '5min') => {
  try {
    const response = await api.get(`/sentiment/snapshots/${ticker}`, {
      params: { limit, timeWindow }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    throw error;
  }
};

export const fetchTimeline = async (ticker, hours = 24) => {
  try {
    const response = await api.get(`/sentiment/timeline/${ticker}`, {
      params: { hours }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching timeline:', error);
    throw error;
  }
};

export const fetchTopSnapshots = async (ticker, sentiment = 'bullish', limit = 10, hours = 24) => {
  try {
    const response = await api.get(`/sentiment/top/${ticker}`, {
      params: { sentiment, limit, hours }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching top snapshots:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/sentiment/health');
    return response.data.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};

export const fetchStorage = async () => {
  try {
    const response = await api.get('/sentiment/storage');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching storage info:', error);
    throw error;
  }
};

export const fetchSPYData = async (timeWindow = '1d') => {
  try {
    const response = await api.get(`/sentiment/spy/${timeWindow}`);
    return response.data.data.data;
  } catch (error) {
    console.error('Error fetching SPY data:', error);
    throw error;
  }
};

export default api;

