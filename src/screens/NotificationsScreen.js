import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';

const notifications = [
  { id: '1', type: 'like', text: 'Kalyan Sir posted a travel tip.', timestamp: '2h ago' },
  { id: '2', type: 'comment', text: 'Divyansh commented on a trip.', timestamp: '1h ago' },
];

const NotificationCard = ({ notification }) => (
  <View style={[styles.card, styles[notification.type]]}>
    <Text style={styles.cardText}>{notification.text}</Text>
    <Text style={styles.timestamp}>{notification.timestamp}</Text>
  </View>
);

const NotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationCard notification={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f8f9fa' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3, // Android/iOS shadow
    ...Platform.select({
      web: { boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }, // Web shadow
    }),
  },
  like: { borderLeftWidth: 4, borderColor: '#4CAF50' }, // Green for likes
  comment: { borderLeftWidth: 4, borderColor: '#2196F3' }, // Blue for comments
  cardText: { fontSize: 16, fontWeight: 'bold' },
  timestamp: { fontSize: 12, color: '#666', marginTop: 5 },
});

export default NotificationsScreen;
