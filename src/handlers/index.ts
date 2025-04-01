import inviteHandler from "./inviteHandler";
import joinRequestHandler from "./joinRequestHandler";
import { Notification } from "../lib/notifications";   // Import the Notification type

// Define the handler interface to enforce consistent structure
interface NotificationHandler {
  handle: (notification: Notification) => Promise<void>;
}

// Registry mapping notification types to their respective handlers
const handlers: Record<string, NotificationHandler> = {
  invite: inviteHandler,
  request: joinRequestHandler,
};

// Get handler based on notification type
export const getNotificationHandler = (type: string): NotificationHandler | null => {
  return handlers[type] || null;
};
