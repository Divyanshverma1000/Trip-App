import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';

const NotificationCard = ({ notification, onAccept, onDecline }) => (
  <View style={[styles.card, styles[notification.type]]}>
    <Text style={styles.cardText}>{notification.text}</Text>
    <Text style={styles.timestamp}>{notification.timestamp}</Text>
    {notification.type === 'invitation' && (
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => onAccept(notification.id)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.declineButton]}
          onPress={() => onDecline(notification.id)}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      // TODO: Implement getUnrespondedInvites() in user.ts
      const response = await getUnrespondedInvites();
      setNotifications(response);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch notifications',
        text2: error.message
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
      // TODO: Implement acceptTripInvitation() in user.ts
      await acceptTripInvitation(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
      Toast.show({
        type: 'success',
        text1: 'Trip invitation accepted'
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to accept invitation',
        text2: error.message
      });
    }
  };

  const handleDecline = async (notificationId) => {
    try {
      // TODO: Implement declineTripInvitation() in user.ts
      await declineTripInvitation(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
      Toast.show({
        type: 'success',
        text1: 'Trip invitation declined'
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to decline invitation',
        text2: error.message
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trip Invitations</Text>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationCard 
            notification={item} 
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchNotifications();
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No pending trip invitations</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 15, 
    backgroundColor: '#f8f9fa' 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 15 
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
    ...Platform.select({
      web: { boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' },
    }),
  },
  invitation: { 
    borderLeftWidth: 4, 
    borderColor: '#FF9800' 
  },
  cardText: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  timestamp: { 
    fontSize: 12, 
    color: '#666', 
    marginTop: 5 
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500'
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16
  }
});

export default NotificationsScreen;
