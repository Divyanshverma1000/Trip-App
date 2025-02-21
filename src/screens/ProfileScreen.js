// src/screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';

const dummyTrips = [
  { id: '1', title: 'Trip to the Mountains', image: require('../../assets/trip1.jpg') },
  { id: '2', title: 'Beach Getaway', image: require('../../assets/trip2.jpg') },
];

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/campus.jpg')} style={styles.profileImage} />
        <Text style={styles.name}>Divyansh | New to Campus</Text>
        <Text style={styles.bio}>Exploring campus and beyond!</Text>
      </View>
      <View style={styles.stats}>
        <Text style={styles.stat}>Trips: 5</Text>
        <Text style={styles.stat}>Likes: 20</Text>
        <Text style={styles.stat}>Followers: 100</Text>
      </View>
      <Text style={styles.sectionTitle}>My Trips</Text>
      <FlatList
        data={dummyTrips}
        horizontal
        renderItem={({ item }) => (
          <View style={styles.tripCard}>
            <Image source={item.image} style={styles.tripImage} />
            <Text style={styles.tripTitle}>{item.title}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: 'bold' },
  bio: { fontSize: 14, color: '#666' },
  stats: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 15 },
  stat: { fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  tripCard: { marginRight: 10, alignItems: 'center' },
  tripImage: { width: 120, height: 80, borderRadius: 8 },
  tripTitle: { fontSize: 14, marginTop: 5 },
  editButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: { color: '#fff', fontSize: 16 },
});

export default ProfileScreen;
