// axios.ts
import axios from 'axios';
import { getStorageItem } from './storage';


const API_BASE_URL = 'https://wander-backend-production.up.railway.app/api';
// const API_BASE_URL = process.env.API_BASE_URL ;
console.log(API_BASE_URL);


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getStorageItem('authToken'); // Handles AsyncStorage (Mobile) & localStorage (Web)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
