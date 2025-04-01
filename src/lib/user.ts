import axios from "./axios";
import Toast from "react-native-toast-message";

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
  const response = await axios.get<User>("/users/profile");
  return response.data;
};

export const addFriend = async (friendId: string): Promise<any> => {
  const response = await axios.post("/users/add-friend", { friendId });
  return response.data;
};

export const updateProfilePhoto = async (photo: {
  uri: string;
  fileName?: string;
  type?: string;
}): Promise<any> => {
  const formData = new FormData();
  formData.append("photo", {
    uri: photo.uri,
    name: photo.fileName || "profile.jpg",
    type: photo.type || "image/jpeg",
  } as any); // casting as any for React Native FormData

  const response = await axios.put("/users/profile-photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const searchUsers = async (query: string): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>("/users/search", {
      params: { query },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to search users";
    Toast.show({
      type: "error",
      text1: "Search failed",
      text2: errorMessage,
    });
    throw error;
  }
};

export const getUnrespondedNotifications = async (): Promise<any[]> => {
  try {
    const response = await axios.get<any[]>('/notifications/unresponded');
    const data = response.data;

    const notifications = data.map((n) => ({
      _id: n._id,
      type: n.type,
      text: n.message,
      timestamp: new Date(n.createdAt).toLocaleString(),
      // For invitation notifications, tripId is populated, so extract coverPhoto and title
      tripId: n.tripId?._id || null,
      tripCoverPhoto: n.tripId?.coverPhoto || null,
      tripName: n.tripId?.title || `Trip Invitation`,
      // For join requests, requestMadeBy is populated with profile info
      userProfileImage: n.requestMadeBy?.photo || null,
      userName: n.requestMadeBy?.name || null,
      date: new Date(n.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }));

    if (notifications.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'No notifications',
        text2: 'You have no pending trip invitations',
      });
    }
    return notifications;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to fetch notifications',
      text2: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

export const acceptTripInvitation = async (
  notificationId: string
): Promise<any> => {
  try {
    const response = await axios.post("/notifications/respond-to-invitation", {
      notificationId,
      response: "accept",
    });
    Toast.show({
      type: "success",
      text1: "Invitation accepted",
      text2: response.data.message,
    });
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: "Failed to accept invitation",
      text2: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

export const declineTripInvitation = async (
  notificationId: string
): Promise<any> => {
  try {
    const response = await axios.post("/notifications/respond-to-invitation", {
      notificationId,
      response: "reject",
    });
    Toast.show({
      type: "success",
      text1: "Invitation declined",
      text2: response.data.message,
    });
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: "Failed to decline invitation",
      text2: error.response?.data?.message || error.message,
    });
    throw error;
  }
};
