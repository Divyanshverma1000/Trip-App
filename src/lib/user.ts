import axios from './axios';
import Toast from 'react-native-toast-message';

export interface User {
  _id: string;
  name: string;
  email: string;
  photo: string;
  friends: Friend[];
  tripHistory: Trip[];
  publicPosts: Post[];
  createdAt: string;
  updatedAt: string;
}

export interface Friend {
  _id: string;
  name: string;
  // add other friend fields as needed
}

export interface Trip {
  _id: string;
  title: string;
  // add other trip fields as needed
}

export interface Post {
  _id: string;
  title: string;
  // add other post fields as needed
}

export const getProfile = async (): Promise<User> => {
  const response = await axios.get<User>('/users/profile');
  return response.data;
};

export const addFriend = async (friendId: string): Promise<any> => {
  const response = await axios.post('/users/add-friend', { friendId });
  return response.data;
};

export const updateProfilePhoto = async (photo: {
  uri: string;
  fileName?: string;
  type?: string;
}): Promise<any> => {
  const formData = new FormData();
  formData.append('photo', {
    uri: photo.uri,
    name: photo.fileName || 'profile.jpg',
    type: photo.type || 'image/jpeg',
  } as any); // casting as any for React Native FormData

  const response = await axios.put('/users/profile-photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const searchUsers = async (query: string): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>('/users/search', {
      params: { query }
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to search users';
    Toast.show({
      type: 'error',
      text1: 'Search failed',
      text2: errorMessage
    });
    throw error;
  }
};
