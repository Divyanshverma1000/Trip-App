import axios from "./axios";
import Toast from "react-native-toast-message";

export interface Notification {
  _id: string;
  type: string;
  message: string;
  tripId?: string;           // Trip ID is optional for general notifications
  requestMadeBy?: string;    // For join requests
  createdAt: string;
}


// Fetch all unresponded notifications
export const getUnrespondedNotifications = async (): Promise<any[]> => {
    try {
      const response = await axios.get<any[]>('/notifications/unresponded');
      const data = response.data;
  
      const notifications = data.map((n) => ({
        _id: n._id,
        type: n.type,
        text: n.message,
        timestamp: new Date(n.createdAt).toLocaleString(),
        tripId: n.tripId,
        requestMadeBy: n.requestMadeBy || null, // Include requestor info
        tripName: `Trip (${n.tripId})`,
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

// API handler for invitation response
export const respondToInvitation = async (
  notificationId: string,
  response: "accept" | "reject"
): Promise<any> => {
  try {
    const res = await axios.post("/notifications/respond-to-invitation", {
      notificationId,
      response,
    });

    Toast.show({
      type: "success",
      text1: response === "accept" ? "Invitation Accepted" : "Invitation Rejected",
      text2: res.data.message,
    });

    return res.data;
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: "Failed to respond to invitation",
      text2: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// API handler for join request response
export const respondToJoinRequest = async (
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
      text1: response === "accept" ? "Request Accepted" : "Request Rejected",
      text2: res.data.message,
    });

    return res.data;
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: "Failed to respond to join request",
      text2: error.response?.data?.message || error.message,
    });
    throw error;
  }
};
