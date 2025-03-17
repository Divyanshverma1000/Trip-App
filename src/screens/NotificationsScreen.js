import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";
import {
  getUnrespondedInvites,
  acceptTripInvitation,
  declineTripInvitation,
} from "../lib/user";

const BackButton = ({ onPress }) => (
  <TouchableOpacity style={styles.backButton} onPress={onPress}>
    <Feather name="arrow-left" size={24} color="#333" />
  </TouchableOpacity>
);

const NotificationCard = ({
  notification,
  onAccept,
  onDecline,
  onViewTrip,
}) => (
  <View style={[styles.card, styles.invitation]}>
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Feather name="users" size={18} color="#FF9800" />
        <Text style={styles.cardTitle}>Trip Invitation</Text>
      </View>
      <Text style={styles.cardText}>{notification.text}</Text>
      <Text style={styles.timestamp}>{notification.timestamp}</Text>
    </View>
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={[styles.actionButton, styles.acceptButton]}
        onPress={() => onAccept(notification._id)}
      >
        <Feather name="check" size={16} color="#fff" />
        <Text style={styles.buttonText}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.declineButton]}
        onPress={() => onDecline(notification._id)}
      >
        <Feather name="x" size={16} color="#fff" />
        <Text style={styles.buttonText}>Decline</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.viewTripButton]}
        onPress={() => onViewTrip(notification.tripId)}
      >
        <Feather name="eye" size={16} color="#fff" />
        <Text style={styles.viewTripButtonText}>View Trip</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUnrespondedInvites();
      setNotifications(response);
    } catch (error) {
      setError(error.message || "Failed to load notifications");
      Toast.show({
        type: "error",
        text1: "Failed to fetch notifications",
        text2: error.message || "An error occurred",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleAccept = async (notificationId) => {
    try {
      await acceptTripInvitation(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      Toast.show({
        type: "success",
        text1: "Trip invitation accepted",
        text2: "You've been added to the trip!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to accept invitation",
        text2: error.message || "An error occurred",
      });
    }
  };

  const handleDecline = async (notificationId) => {
    try {
      await declineTripInvitation(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      Toast.show({
        type: "success",
        text1: "Trip invitation declined",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to decline invitation",
        text2: error.message || "An error occurred",
      });
    }
  };

  const handleViewTrip = (tripId) => {
    navigation.navigate("TripDetailsScreen", { tripId: tripId });
  };

  const handleBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <BackButton onPress={handleBack} />
          <View style={styles.headerContainer}>
            <Feather name="bell" size={28} color="#4CAF50" />
            <Text style={styles.headerTitle}>Trip Invitations</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={20} color="#FF5252" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading your invitations...</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={({ item }) => (
              <NotificationCard
                notification={item}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onViewTrip={handleViewTrip}
              />
            )}
            keyExtractor={(item) => item._id}
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await fetchNotifications();
            }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Feather name="inbox" size={64} color="#BDBDBD" />
                <Text style={styles.emptyTitle}>No Invitations</Text>
                <Text style={styles.emptyText}>
                  You don't have any pending trip invitations at the moment.
                </Text>
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={fetchNotifications}
                >
                  <Feather name="refresh-cw" size={16} color="#fff" />
                  <Text style={styles.refreshButtonText}>Refresh</Text>
                </TouchableOpacity>
              </View>
            }
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f8f9fa",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    ...Platform.select({
      web: { boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)" },
      default: { elevation: 2 },
    }),
  },
  placeholder: {
    width: 40,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#4CAF50",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: "#D32F2F",
    marginLeft: 8,
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  listContainer: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
    ...Platform.select({
      web: { boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" },
      default: { elevation: 4 },
    }),
  },
  invitation: {
    borderLeftWidth: 4,
    borderColor: "#FF9800",
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF9800",
    marginLeft: 8,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 12,
    lineHeight: 24,
  },
  tripDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  tripDetailText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  declineButton: {
    backgroundColor: "#FF5252",
  },
  viewTripButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  viewTripButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginBottom: 24,
    maxWidth: 280,
    lineHeight: 22,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  refreshButtonText: {
    color: "white",
    fontWeight: "500",
  },
  tripSummaryCard: {
    // Not used now since we removed the card in favor of a button.
    // Instead, we provide a "View Trip" button inside actionButtons.
    // (This style is no longer needed.)
  },
  tripImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  tripInfo: {
    flex: 1,
  },
  tripName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});

export default NotificationsScreen;
