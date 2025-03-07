// TripCard.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TripCard = ({ trip, onPress }) => {
  // Use coverPhoto if available, otherwise use first photo from the photos array
  const photoUrl =
    trip.coverPhoto ||
    (trip.photos && trip.photos.length > 0 ? trip.photos[0].url : 'https://via.placeholder.com/200x120');

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{ uri: photoUrl }} style={styles.image} />
      <View style={styles.overlay}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {trip.title}
          </Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detail}>
              <Ionicons name="people-outline" size={16} color="#FFF" />
              <Text style={styles.detailText}>{trip.members?.length || 0}</Text>
            </View>
            <View style={styles.detail}>
              <Ionicons name="calendar-outline" size={16} color="#FFF" />
              <Text style={styles.detailText}>
                {trip.status === 'planning' ? 'Planning' : 'Ongoing'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 280,
    height: 180,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  textContainer: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    color: '#FFF',
    marginLeft: 4,
    fontSize: 14,
  }
});

export default TripCard;
