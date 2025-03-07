// lib/trips.ts
import axios from './axios';
import Toast from 'react-native-toast-message';

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

// --- Other functions remain unchanged ---

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
    const response = await axios.put<Trip>(`/trips/update-trip`, tripData, {
      params: { id: tripId },
    });
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to update trip',
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
    await axios.delete('/trips/delete', { params: { id: tripId } });
    Toast.show({
      type: 'success',
      text1: 'Trip deleted successfully',
    });
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to delete trip',
    });
    throw error;
  }
};

export const inviteToTrip = async (tripId: string, userId: string): Promise<void> => {
  try {
    await axios.post('/trips/invite', { tripId, userId });
    Toast.show({
      type: 'success',
      text1: 'Invitation sent successfully',
    });
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to send invitation',
    });
    throw error;
  }
};

export const respondToInvitation = async (tripId: string, responseStr: 'accept' | 'decline'): Promise<void> => {
  try {
    await axios.post('/trips/respond-to-invitation', { tripId, response: responseStr });
    Toast.show({
      type: 'success',
      text1: `Invitation ${responseStr}ed successfully`,
    });
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to respond to invitation',
    });
    throw error;
  }
};

export const leaveTrip = async (tripId: string): Promise<void> => {
  try {
    await axios.post('/trips/leave-trip', { tripId });
    Toast.show({
      type: 'success',
      text1: 'Successfully left the trip',
    });
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to leave trip',
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

export const getMyTrips = async (): Promise<Trip[]> => {
  try {
    const response = await axios.post<Trip[]>('/trips/my-trips');
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to fetch your trips'
    });
    throw error;
  }
};
