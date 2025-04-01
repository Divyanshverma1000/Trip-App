import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Feather } from "@expo/vector-icons";

const NotificationCard = ({ notification, onAccept, onDecline, onViewTrip }) => {
  // Determine notification type
  const isJoinRequest = notification.type === "request";
  const isInvitation = notification.type === "invitation";

  // Icon settings for fallback
  const iconName = isJoinRequest ? "user" : "map";
  const iconColor = isJoinRequest ? "#3F51B5" : "#FF9800";
  const containerStyle = isInvitation ? styles.invitationCard : styles.requestCard;

  // Render the message based on notification type
  const renderMessage = () => {
    if (isInvitation) {
      return (
        <Text style={styles.cardText}>
          You're invited to{" "}
          <Text style={styles.emphasis}>{notification.tripName}</Text>.
        </Text>
      );
    } else if (isJoinRequest) {
      return (
        <Text style={styles.cardText}>
          <Text style={styles.emphasis}>
            {notification.userName || "A user"}
          </Text>{" "}
          requested to join your trip{" "}
          <Text style={styles.emphasis}>{notification.tripName}</Text>.
        </Text>
      );
    } else {
      return <Text style={styles.cardText}>{notification.text}</Text>;
    }
  };

  return (
    <View style={[styles.card, containerStyle, styles.cardShadow]}>
      <View style={styles.headerContainer}>
        <View style={styles.cardHeader}>
          {isJoinRequest && notification.userProfileImage ? (
            <Image
              source={{ uri: notification.userProfileImage }}
              style={styles.profileImage}
            />
          ) : isInvitation && notification.tripCoverPhoto ? (
            <Image
              source={{ uri: notification.tripCoverPhoto }}
              style={styles.coverImage}
            />
          ) : (
            <Feather name={iconName} size={24} color={iconColor} />
          )}
          <Text style={styles.cardTitle}>
            {isJoinRequest ? "Join Request" : "Trip Invitation"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onViewTrip(notification.tripId)}>
          <Text style={styles.viewTripText}>View Trip</Text>
        </TouchableOpacity>
      </View>
      {renderMessage()}
      <Text style={styles.timestamp}>{notification.timestamp}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => onAccept(notification)}
        >
          <Feather name="check" size={16} color="#fff" />
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.declineButton]}
          onPress={() => onDecline(notification)}
        >
          <Feather name="x" size={16} color="#fff" />
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  invitationCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  requestCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3F51B5",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
  },
  viewTripText: {
    fontSize: 16,
    color: "#2196F3",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  cardText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  emphasis: {
    fontWeight: "700",
    color: "#000",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  acceptButton: { backgroundColor: "#4CAF50" },
  declineButton: { backgroundColor: "#FF5252" },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 5,
    fontWeight: "500",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  coverImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
});

export default NotificationCard;
