import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

export const fetchPosts = async (ticker, limit = 50, source = null) => {
  try {
    const response = await api.get(`/sentiment/posts/${ticker}`, {
      params: { limit, source }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
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

export const fetchTopPosts = async (ticker, sentiment = 'positive', limit = 10, hours = 24) => {
  try {
    const response = await api.get(`/sentiment/top/${ticker}`, {
      params: { sentiment, limit, hours }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching top posts:', error);
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

export default api;

