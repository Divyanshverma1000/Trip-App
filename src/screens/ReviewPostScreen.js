// src/screens/ReviewPostScreen.js
import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { createBlogPost } from '../lib/blogs';
import { createTrip } from '../lib/trips';
import Toast from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';

const ReviewPostScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  
  const { blogData = {}, itineraryData = [], photos = [] } = route.params || {};

  const handlePublish = async () => {
    if (!blogData || !itineraryData) {
      Toast.show({ type: 'error', text1: 'Missing Data', text2: 'Please complete all previous steps' });
      return;
    }

    setLoading(true);
    try {
      // First create the trip
      const tripFormData = new FormData();
      tripFormData.append('title', blogData.title);
      tripFormData.append('description', blogData.description);
      tripFormData.append('itinerary', JSON.stringify(itineraryData));
      
      // Only append first photo to reduce payload size
      if (photos.length > 0) {
        const photo = {
          uri: photos[0].uri,
          type: 'image/jpeg',
          name: 'cover.jpg'
        };
        tripFormData.append('coverPhoto', photo);
      }

      const trip = await createTrip(tripFormData);

      if (!trip?._id) {
        throw new Error('Failed to get trip ID from response');
      }

      // Create blog post with trip ID
      await createBlogPost(
        trip._id,
        blogData.title,
        photos.map(p => ({ url: p.uri })),
        blogData.description
      );
      
      Toast.show({ type: 'success', text1: 'Trip and Blog Posted Successfully!' });
      navigation.navigate('Main');
    } catch (error) {
      console.error('Publishing error:', error);
      Toast.show({ 
        type: 'error', 
        text1: 'Failed to post content', 
        text2: error.message || 'Please try again later'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Blog Post</Text>
        <TouchableOpacity style={styles.publishButton} onPress={handlePublish} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Feather name="check" size={24} color="#FFF" />}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Blog Details</Text>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>{blogData.title || 'No title provided'}</Text>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{blogData.description || 'No description provided'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itinerary</Text>
          {itineraryData.length > 0 ? itineraryData.map((day, index) => (
            <View key={index} style={styles.dayContainer}>
              <Text style={styles.dayTitle}>Day {day.day}</Text>
              <Text style={styles.dayNotes}>{day.dayNotes}</Text>
            </View>
          )) : <Text style={styles.noData}>No itinerary data provided</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <View style={styles.photoGrid}>
            {photos.length > 0 ? photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo.uri }} style={styles.photo} />
              </View>
            )) : <Text style={styles.noData}>No photos added</Text>}
          </View>
          {photos.length > 1 && (
            <Text style={styles.warning}>Note: Only the first photo will be uploaded due to size limitations</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEE', position: 'relative' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  publishButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 8, position: 'absolute', right: 16, top: '50%', transform: [{ translateY: -12 }] },
  content: { flex: 1, padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#333' },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  value: { fontSize: 16, marginBottom: 12 },
  dayContainer: { marginBottom: 16, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8 },
  dayTitle: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  dayNotes: { fontSize: 14, color: '#666' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  photoContainer: { width: '33.33%', padding: 4 },
  photo: { width: '100%', aspectRatio: 1, borderRadius: 4 },
  noData: { fontSize: 14, color: '#666', fontStyle: 'italic' },
  warning: { fontSize: 12, color: '#ff6b6b', marginTop: 8, fontStyle: 'italic' }
});

export default ReviewPostScreen;
