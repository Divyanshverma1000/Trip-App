import axios from './axios';
import Toast from 'react-native-toast-message';

export interface ChatMessage {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    photo?: string;
  };
  content: string;
  createdAt: string;
}

export interface ChatRoom {
  _id: string;
  trip: string;
  participants: string[];
  messages: ChatMessage[];
}

export const getChatRoom = async (tripId: string): Promise<ChatRoom> => {
  try {
    const response = await axios.get<ChatRoom>(`/chat/trip/${tripId}`);
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to get chat room',
      text2: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

export const postMessage = async (tripId: string, content: string): Promise<ChatMessage> => {
  try {
    const response = await axios.post<ChatMessage>(`/chat/trip/${tripId}/message`, { content });
    Toast.show({
      type: 'success',
      text1: 'Message sent',
    });
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to send message',
      text2: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

export const getMessages = async (tripId: string): Promise<ChatMessage[]> => {
  try {
    const response = await axios.get<ChatMessage[]>(`/chat/trip/${tripId}/all-messages`);
    if (response.data && response.data.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'No messages yet',
        text2: 'Start the conversation now!',
      });
    }
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to get messages',
      text2: error.response?.data?.message || error.message,
    });
    throw error;
  }
};
