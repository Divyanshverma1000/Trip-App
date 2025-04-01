import { respondToJoinRequest } from "../lib/notifications";
import { Notification } from "lib/notifications";

const joinRequestHandler = {
  handle: async (notification:Notification) => {
    await respondToJoinRequest(notification._id, "accept");  // "accept" or "reject"
  },
};

export default joinRequestHandler;
