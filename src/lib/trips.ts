// lib/trips.ts
import axios from './axios';
import Toast from 'react-native-toast-message';
import { getStorageItem } from './storage';

export interface Trip {
  _id: string;
  title: string;
  description: string;
  metadata: {
    destination: string;
    cost: number;
    duration: number;
  };
  itinerary: Array<{
    stay: {
      hotelName: string;
      address: string;
      description: string;
      cost: number;
      rating: number;
    };
    day: number;
    dayNotes: string;
    places: Array<{
      name: string;
      address: string;
      time: string;
      description: string;
      expense: number;
    }>;
    restaurant: Array<{
      name: string;
      address: string;
      description: string;
      cost: number;
      mealType: string;
    }>;
    activities: Array<{
      activityName: string;
      description: string;
      cost: number;
    }>;
  }>;
  packingEssentials: string[];
  estimatedBudget: number;
  actualBudget?: number;
  tags: string[];
  host: {
    _id: string;
    name: string;
    email: string;
    photo: string;
  };
  members: Array<{
    user: {
      _id: string;
      name: string;
      email: string;
      photo: string;
    };
    role: string;
    status: string;
  }>;
  isPublic: boolean;
  status: string;
  coverPhoto: string | File | Blob; // Updated type to allow File/Blob
  photos: Array<{
    url: string;
    caption: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const createTrip = async (formData: FormData): Promise<Trip> => {
  try {
    // Log the request data
    console.log('Sending trip creation request with FormData');
    
    const response = await axios.post<Trip>('/trips', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Trip creation error:', error.response?.data || error.message);
    Toast.show({
      type: 'error',
      text1: 'Failed to create trip',
      text2: error.response?.data?.error || error.message
    });
    throw error;
  }
};



export const getTrip = async (tripId: string): Promise<Trip> => {
  try {
    const response = await axios.get<Trip>(`/trips/${tripId}`);
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to fetch trip',
    });
    throw error;
  }
};

export const updateTrip = async (tripId: string, tripData: Partial<Trip>): Promise<Trip> => {
  try {
    console.log('Updating trip:', { tripId, tripData }); // Debug log
    
    // Send request to /api/trips/[TripID] instead of /trips/update-trip
    const response = await axios.put<Trip>(`/trips/${tripId}`, tripData);
    
    Toast.show({
      type: 'success',
      text1: 'Trip updated successfully',
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Update trip error:', error.response?.data || error);
    Toast.show({
      type: 'error',
      text1: 'Failed to update trip',
      text2: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const copyTrip = async (tripId: string): Promise<Trip> => {
  try {
    const response = await axios.post<Trip>('/trips/copy', { id: tripId });
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to copy trip',
    });
    throw error;
  }
};

export const deleteTrip = async (tripId: string): Promise<void> => {
  try {
    await axios.delete(`/trips/${tripId}`);
    Toast.show({
      type: 'success',
      text1: 'Trip deleted successfully'
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to delete trip';
    Toast.show({
      type: 'error',
      text1: errorMessage
    });
    throw error;
  }
};

export const inviteToTrip = async (tripId: string, memberId: string): Promise<void> => {
  try {
    await axios.post(`/trips/${tripId}/invite`, { memberId });
    Toast.show({
      type: 'success',
      text1: 'Invitation sent successfully',
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to send invitation';
    Toast.show({
      type: 'error',
      text1: errorMessage
    });
    throw error;
  }
};

export const respondToInvitation = async (tripId: string, action: 'accept' | 'reject'): Promise<void> => {
  try {
    await axios.post(`/trips/${tripId}/respond`, { action });
    Toast.show({
      type: 'success',
      text1: `Invitation ${action}ed successfully`,
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || `Failed to ${action} invitation`;
    Toast.show({
      type: 'error',
      text1: errorMessage
    });
    throw error;
  }
};

export const respondToJoinTripRequest = async (
  notificationId: string,
  response: "accept" | "reject"
): Promise<any> => {
  try {
    const res = await axios.post("/notifications/respond-to-request", {
      notificationId,
      response,
    });
    
    Toast.show({
      type: "success",
      text1: response === "accept" ? "Request accepted" : "Request rejected",
      text2: res.data.message,
    });
    
    return res.data;
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: "Failed to respond to request",
      text2: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

export const leaveTrip = async (tripId: string): Promise<void> => {
  try {
    await axios.post(`/trips/${tripId}/leave`);
    Toast.show({
      type: 'success',
      text1: 'Successfully left the trip',
    });
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: error.response?.data?.message || 'Failed to leave trip',
    });
    throw error;
  }
};

export const changeMemberRole = async (tripId: string, memberId: string, newRole: 'viewer' | 'editor'): Promise<Trip> => {
  try {
    const response = await axios.post(`/trips/${tripId}/change-role`, { memberId, newRole });
    Toast.show({
      type: 'success',
      text1: `Member role updated to ${newRole}`,
    });
    return response.data.trip;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to change member role';
    Toast.show({
      type: 'error',
      text1: errorMessage,
    });
    throw error;
  }
};

export const getTrendingTrips = async (): Promise<Trip[]> => {
  try {
    const response = await axios.get<{ trips: Trip[] }>('/trips/trending');
    return response.data.trips;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to load trending trips',
    });
    throw error;
  }
};

export const getOpenTrips = async (): Promise<Trip[]> => {
  try {
    const response = await axios.get<Trip[]>('/trips/open');
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to load open trips',
    });
    throw error;
  }
};

export const searchTrips = async (query: string): Promise<Trip[]> => {
  try {
    const response = await axios.get<Trip[]>('/blogs/search', {
      params: { query },
    });
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to search trips',
    });
    throw error;
  }
};

export const getMyTrips = async (userId: string): Promise<Trip[]> => {
  try {
    console.log('getMyTrips: Sending request with userId:', userId);
    
    const response = await axios.post<Trip[]>('/trips/my-trips', {
      userId: userId // Send the userId in the request body
    });
    
    console.log('getMyTrips: Response received:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('getMyTrips Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    Toast.show({
      type: 'error',
      text1: 'Failed to fetch your trips',
      text2: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const joinTrip = async (tripId: string): Promise<{ message: string; trip?: any }> => {
  try {
    const response = await axios.post(`/trips/${tripId}/join`);
    if (response.status === 201) {
      Toast.show({
        type: "success",
        text1: "Join request sent successfully",
      });
    } else if (response.status === 200) {
      Toast.show({
        type: "info",
        text1: "You have already requested to join this trip",
      });
    }    
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to join trip',
      text2: error.response?.data?.error || error.message,
    });
    throw error;
  }
};