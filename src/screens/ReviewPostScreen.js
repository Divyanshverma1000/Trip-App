// src/screens/ReviewPostScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView } from 'react-native';
import { createTrip } from '../lib/trips';
import { createBlogPost } from '../lib/blogs';
import Toast from 'react-native-toast-message';

const ReviewPostScreen = ({ navigation, route }) => {
  const { tripDetails, itinerary, photos } = route.params;
  const [caption, setCaption] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {
    if (!caption || !content) {
      Toast.show({
        type: 'error',
        text1: 'Please fill in all fields'
      });
      return;
    }

    setLoading(true);
    try {
      // Create trip first
      const tripFormData = new FormData();
      
      // Add basic trip details
      tripFormData.append('title', tripDetails.title);
      tripFormData.append('status', 'planning');
      tripFormData.append('isPublic', 'false');
      
      // Add metadata and other objects as JSON strings
      tripFormData.append('metadata', JSON.stringify(tripDetails.metadata));
      tripFormData.append('itinerary', JSON.stringify(itinerary));
      if (tripDetails.tags) {
        tripFormData.append('tags', JSON.stringify(tripDetails.tags));
      }

      // Add cover photo
      if (photos && photos.length > 0) {
        const coverPhoto = photos[0];
        tripFormData.append('coverPhoto', {
          uri: coverPhoto.uri,
          name: coverPhoto.name || 'photo.jpg',
          type: coverPhoto.type || 'image/jpeg'
        });
      }

      // Create the trip
      const createdTrip = await createTrip(tripFormData);
      console.log('Created trip:', createdTrip);

      // Now create the blog post
      // We'll use the URLs returned from the trip creation
      const blogPhotos = photos.map((photo, index) => ({
        url: index === 0 ? createdTrip.coverPhoto : photo.uri, // Use coverPhoto URL for first photo
        caption: '' // Optional caption for each photo
      }));

      // Create blog post with the trip's ID and processed photos
      await createBlogPost(
        createdTrip._id,
        caption,
        blogPhotos, // Use the processed photos array
        content
      );

      Toast.show({
        type: 'success',
        text1: 'Trip and blog post created successfully!'
      });

      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error creating post:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to create post',
        text2: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Review Your Post</Text>

      {/* Trip Details Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Trip Details</Text>
        <Text style={styles.summaryText}>Title: {tripDetails.title}</Text>
        <Text style={styles.summaryText}>Description: {tripDetails.description}</Text>
        <Text style={styles.summaryText}>Destination: {tripDetails.metadata?.destination}</Text>
        <Text style={styles.summaryText}>Duration: {itinerary.length} days</Text>
        <Text style={styles.summaryText}>Estimated Budget: ${tripDetails.estimatedBudget}</Text>
      </View>

      {/* Cover Photo Preview */}
      {tripDetails.coverPhoto && (
        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>Cover Photo</Text>
          <Image 
            source={{ uri: tripDetails.coverPhoto.uri }}
            style={styles.coverPhoto}
          />
        </View>
      )}

      {/* Blog Content */}
      <View style={styles.blogSection}>
        <Text style={styles.sectionTitle}>Blog Content</Text>
        <TextInput
          style={styles.captionInput}
          placeholder="Add a caption..."
          value={caption}
          onChangeText={setCaption}
          multiline
        />

        <TextInput
          style={[styles.captionInput, styles.contentInput]}
          placeholder="Write your blog content..."
          value={content}
          onChangeText={setContent}
          multiline
        />
      </View>

      <Button
        title={loading ? "Creating..." : "Create Post"}
        onPress={handleCreatePost}
        disabled={loading || !caption || !content}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  summarySection: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444'
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5
  },
  photoSection: {
    marginBottom: 20
  },
  coverPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10
  },
  blogSection: {
    marginBottom: 20
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    height: 200,
    textAlignVertical: 'top',
    fontSize: 16
  }
});

export default ReviewPostScreen;
