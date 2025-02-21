// HomeScreen.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// Use local image requires for featured trips and trending destinations
const featuredTrips = [
  {
    id: 1,
    title: "Beach Getaway",
    image: require('../../assets/beach.jpg'),
  },
  {
    id: 2,
    title: "Mountain Adventure",
    image: require('../../assets/mountain.jpg'),
  },
  {
    id: 3,
    title: "City Lights",
    image: require('../../assets/city.jpg'),
  },
];

const trendingDestinations = [
  {
    id: 1,
    name: "Paris",
    image: require('../../assets/paris.jpg'),
  },
  {
    id: 2,
    name: "Bali",
    image: require('../../assets/bali.jpg'),
  },
  {
    id: 3,
    name: "Kenya",
    image: require('../../assets/kenya.jpg'),
  },
];

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Trips..."
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.carouselContainer}>
          <Text style={styles.sectionTitle}>Featured Trips</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredTrips.map((trip) => (
              <View key={trip.id} style={styles.carouselItem}>
                <Image source={trip.image} style={styles.carouselImage} />
                <Text style={styles.carouselText}>{trip.title}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.trendingContainer}>
          <Text style={styles.sectionTitle}>Trending Destinations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trendingDestinations.map((destination) => (
              <View key={destination.id} style={styles.trendingItem}>
                <Image
                  source={destination.image}
                  style={styles.trendingImage}
                />
                <Text style={styles.trendingText}>{destination.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.ctaContainer}>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Share Your Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Plan a Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Join a Trip</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 80, // Reserve space for the navigation menu
  },
  // Search bar styling
  searchContainer: {
    margin: 10,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  // Carousel styling
  carouselContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 5,
  },
  carouselItem: {
    marginHorizontal: 10,
    width: width * 0.8,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ccc',
  },
  carouselImage: {
    width: '100%',
    height: 150,
  },
  carouselText: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  // Trending destinations styling
  trendingContainer: {
    marginTop: 20,
  },
  trendingItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  trendingImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  trendingText: {
    marginTop: 5,
    fontSize: 14,
  },
  // CTA buttons styling
  ctaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  ctaButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  ctaButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Navigation menu styling
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 16,
    color: '#333',
  },
});

export default HomeScreen;
