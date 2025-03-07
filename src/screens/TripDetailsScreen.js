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
  Dimensions,
  Pressable,
} from 'react-native';
import Animated, { useSharedValue, FadeInUp, withSpring } from 'react-native-reanimated';
import { useRoute } from '@react-navigation/native';
import { getTrip } from '../lib/trips';
import { TripHeader } from '../components/TripHeader';
import { TripTag } from '../components/TripTag';
import { MaterialIcons } from '@expo/vector-icons';

const TripDetailsScreen = () => {
  const route = useRoute();
  const tripId = route?.params?.tripId;
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState(null);
  const scrollY = useSharedValue(0);

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

  const toggleDayExpansion = (dayIndex) => {
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };

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
  dayHeaderLeft: {
    flex: 1,
  },
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
  hostInfo: {
    flex: 1,
  },
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
});

export default TripDetailsScreen;
