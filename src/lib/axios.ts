// axios.ts
import axios from 'axios';
import { getStorageItem } from './storage';

const API_BASE_URL = 'https://elite-toothpaste-production.up.railway.app/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getStorageItem('token'); // Handles AsyncStorage (Mobile) & localStorage (Web)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
