import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Animated, { useSharedValue, FadeInUp } from 'react-native-reanimated';
import { useRoute } from '@react-navigation/native';
import { getTrip, joinTrip as joinTripApi } from '../lib/trips';
import { TripHeader } from '../components/TripHeader';
import { TripTag } from '../components/TripTag';
import { MaterialIcons } from '@expo/vector-icons';
import { getStorageItem } from '../lib/storage';

const TripDetailsScreen = () => {
  const route = useRoute();
  const tripId = route?.params?.tripId;
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState(null);
  const [userId, setUserId] = useState(null);
  const [joining, setJoining] = useState(false);
  const scrollY = useSharedValue(0);

  // Fetch current user ID from storage when component mounts
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUserId = await getStorageItem('userId');
        setUserId(currentUserId);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    getCurrentUser();
  }, []);

  // Fetch trip details when tripId changes
  useEffect(() => {
    if (tripId) {
      setLoading(true);
      getTrip(tripId)
        .then((data) => {
          setTrip(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch trip:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [tripId]);

  // Determine if the user is already a member of this trip (with accepted status)
  const isMember = trip?.members?.some(
    (member) => member.user.toString() === userId && member.status === "accepted"
  );

  const joinTrip = async (tripId) => {
    if (joining) return; // Prevent multiple clicks
    try {
      setJoining(true);
      // Call the axios-based API function from lib/trips.ts
      await joinTripApi(tripId);
      // Refresh trip details after successful join
      const updatedTrip = await getTrip(tripId);
      setTrip(updatedTrip);
    } catch (error) {
      Alert.alert('Join Failed', error.message || 'Unable to join the trip. Please try again later.');
    } finally {
      setJoining(false);
    }
  };

  const toggleDayExpansion = (dayIndex) => {
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };

  if (!tripId || loading || !trip) {
    return (
      <View style={styles.centered}>
        {loading ? (
          <ActivityIndicator size="large" color="#6366F1" />
        ) : (
          <Text style={styles.errorText}>
            {!tripId ? 'Error: No trip selected.' : 'Trip not found'}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TripHeader coverPhoto={trip.coverPhoto} title={trip.title} scrollY={scrollY} />
      
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.contentPadding} />
        <View style={styles.content}>
          <Text style={styles.description}>{trip.description}</Text>

          {trip.metadata && (
            <View style={styles.highlightCard}>
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <MaterialIcons name="location-on" size={24} color="#6366F1" />
                  <Text style={styles.detailLabel}>Destination</Text>
                  <Text style={styles.detailValue}>{trip.metadata.destination}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialIcons name="timer" size={24} color="#6366F1" />
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>{trip.metadata.duration} days</Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialIcons name="attach-money" size={24} color="#6366F1" />
                  <Text style={styles.detailLabel}>Total Cost</Text>
                  <Text style={styles.detailValue}>${trip.metadata.cost}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Join Button Section */}
          {trip.isPublic && (
            <>
              {!isMember ? (
                <TouchableOpacity 
                  style={[styles.joinButton, joining && styles.joinButtonDisabled]}
                  onPress={() => joinTrip(trip._id)}
                  disabled={joining}
                >
                  {joining ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <MaterialIcons name="group-add" size={24} color="#FFF" />
                      <Text style={styles.joinButtonText}>Join This Trip</Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.joinedButton}
                  onPress={() => Alert.alert('Already Joined', 'You have already joined this trip.')}
                >
                  <MaterialIcons name="check-circle" size={24} color="#FFF" />
                  <Text style={styles.joinedButtonText}>Already Joined</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {trip.itinerary?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Trip Itinerary</Text>
              {trip.itinerary.map((dayItem, index) => (
                <Animated.View
                  key={index}
                  entering={Platform.OS !== 'web' ? FadeInUp.delay(index * 200) : undefined}
                >
                  <TouchableOpacity 
                    style={styles.dayHeader}
                    onPress={() => toggleDayExpansion(index)}
                  >
                    <View style={styles.dayHeaderLeft}>
                      <Text style={styles.dayNumber}>Day {dayItem.day || index + 1}</Text>
                      <Text style={styles.dayPlaces} numberOfLines={1}>
                        {dayItem.places?.join(', ') || 'Places covered'}
                      </Text>
                    </View>
                    <MaterialIcons 
                      name={expandedDay === index ? "expand-less" : "expand-more"} 
                      size={24} 
                      color="#6366F1"
                    />
                  </TouchableOpacity>

                  {expandedDay === index && (
                    <View style={styles.dayContent}>
                      <Text style={styles.dayNotes}>{dayItem.dayNotes}</Text>
                      
                      {dayItem.stay && (
                        <View style={styles.stayCard}>
                          <View style={styles.stayHeader}>
                            <MaterialIcons name="hotel" size={24} color="#6366F1" />
                            <Text style={styles.stayTitle}>{dayItem.stay.hotelName}</Text>
                          </View>
                          <Text style={styles.stayAddress}>{dayItem.stay.address}</Text>
                          <Text style={styles.stayDescription}>{dayItem.stay.description}</Text>
                          <View style={styles.stayDetails}>
                            <Text style={styles.stayCost}>${dayItem.stay.cost}/night</Text>
                            <View style={styles.ratingContainer}>
                              <MaterialIcons name="star" size={18} color="#FFD700" />
                              <Text style={styles.stayRating}>{dayItem.stay.rating}</Text>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </Animated.View>
              ))}
            </View>
          )}

          {trip.tags?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Trip Tags</Text>
              <View style={styles.tagsContainer}>
                {trip.tags.map((tag, index) => (
                  <TripTag key={index} tag={tag} index={index} />
                ))}
              </View>
            </View>
          )}

          {trip.host && (
            <View style={styles.hostCard}>
              <Text style={styles.sectionTitle}>Trip Host</Text>
              <View style={styles.hostContainer}>
                {trip.host.photo && (
                  <Image source={{ uri: trip.host.photo }} style={styles.hostImage} />
                )}
                <View style={styles.hostInfo}>
                  <Text style={styles.hostName}>{trip.host.name}</Text>
                  <Text style={styles.hostEmail}>{trip.host.email}</Text>
                  <TouchableOpacity style={styles.contactButton}>
                    <Text style={styles.contactButtonText}>Contact Host</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollView: { flex: 1 },
  contentPadding: { height: 300 },
  content: { padding: 16 },
  description: { 
    fontSize: 16, 
    marginBottom: 16,
    lineHeight: 24,
    color: '#374151'
  },
  highlightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 16,
    color: '#1F2937'
  },
  detailsGrid: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  detailItem: { 
    flex: 1,
    alignItems: 'center'
  },
  detailLabel: { 
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4
  },
  detailValue: { 
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 2
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  dayHeaderLeft: { flex: 1 },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  dayPlaces: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  dayContent: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  dayNotes: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 16,
    lineHeight: 24,
  },
  stayCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
  },
  stayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#1F2937',
  },
  stayAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  stayDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  stayDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  stayCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stayRating: {
    fontSize: 16,
    marginLeft: 4,
    color: '#1F2937',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#DC2626',
  },
  hostCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  hostInfo: { flex: 1 },
  hostName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  hostEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  contactButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  joinButtonDisabled: {
    backgroundColor: '#A5A6F6',
    opacity: 0.8,
  },
  joinButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  joinedButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  joinedButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default TripDetailsScreen;
