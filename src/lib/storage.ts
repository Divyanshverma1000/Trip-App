// storage.ts
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStorageItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await AsyncStorage.setItem(key, value);
  }
};

export const getStorageItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await AsyncStorage.getItem(key);
  }
};

export const removeStorageItem = async (key: string) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await AsyncStorage.removeItem(key);
  }
};
