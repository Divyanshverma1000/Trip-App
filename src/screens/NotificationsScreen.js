import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";
import BackButton from "../components/BackButton";
import NotificationCard from "../components/NotificationCard";
import { respondToInvitation, respondToJoinRequest } from "../lib/notifications";
import { getUnrespondedNotifications } from "../lib/user";

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUnrespondedNotifications();
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

  const handleAccept = async (notification) => {
    try {
      if (notification.type === "invitation") {
        await respondToInvitation(notification._id, "accept");
      } else if (notification.type === "request") {
        await respondToJoinRequest(notification._id, "accept");
      }
      setNotifications((prev) =>
        prev.filter((n) => n._id !== notification._id)
      );
      Toast.show({
        type: "success",
        text1: "Request accepted",
        text2: "You responded successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to accept",
        text2: error.message || "An error occurred",
      });
    }
  };

  const handleDecline = async (notification) => {
    try {
      if (notification.type === "invitation") {
        await respondToInvitation(notification._id, "reject");
      } else if (notification.type === "request") {
        await respondToJoinRequest(notification._id, "reject");
      }
      setNotifications((prev) =>
        prev.filter((n) => n._id !== notification._id)
      );
      Toast.show({
        type: "success",
        text1: "Request rejected",
        text2: "You declined the request",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to decline",
        text2: error.message || "An error occurred",
      });
    }
  };

  const handleViewTrip = (tripId) => {
    navigation.navigate("TripDetailsScreen", { tripId });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderItem = ({ item }) => (
    <NotificationCard
      notification={item}
      onAccept={handleAccept}
      onDecline={handleDecline}
      onViewTrip={handleViewTrip}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <BackButton onPress={handleBack} />
          <View style={styles.headerContainer}>
            <Feather name="bell" size={28} color="#4CAF50" />
            <Text style={styles.headerTitle}>Notifications</Text>
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
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchNotifications();
            }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Feather name="inbox" size={64} color="#BDBDBD" />
                <Text style={styles.emptyTitle}>No Notifications</Text>
                <Text style={styles.emptyText}>
                  You don't have any pending notifications.
                </Text>
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
  safeArea: { flex: 1, backgroundColor: "#f8f9fa" },
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerContainer: { flexDirection: "row", alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "700", marginLeft: 10, color: "#4CAF50" },
  placeholder: { width: 24 },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffe6e6",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: { color: "#FF5252", marginLeft: 8, fontSize: 14 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 50 },
  emptyTitle: { fontSize: 20, fontWeight: "600", color: "#BDBDBD", marginTop: 20 },
  emptyText: { fontSize: 16, color: "#BDBDBD", textAlign: "center", marginTop: 10 },
  listContainer: { paddingBottom: 20 },
});

export default NotificationsScreen;
