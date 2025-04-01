import { respondToInvitation } from "../lib/notifications";
import { Notification } from "../lib/notifications";  // Import the type

const inviteHandler = {
  handle: async (notification: Notification) => {  // Add explicit type
    await respondToInvitation(notification._id, "accept");  // "accept" or "reject"
  },
};

export default inviteHandler;
