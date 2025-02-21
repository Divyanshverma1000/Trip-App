// src/screens/TripDetailsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const initialLayout = { width: Dimensions.get('window').width };

const TripDetailsScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'itinerary', title: 'Itinerary' },
    { key: 'budget', title: 'Budget' },
    { key: 'packing', title: 'Packing List' },
    { key: 'comments', title: 'Comments' },
  ]);

  const ItineraryRoute = () => (
    <ScrollView style={styles.tabContent}>
      <Text>Step 1: Depart at 8:00 AM</Text>
      <Text>Step 2: Visit the waterfall at 10:00 AM</Text>
      {/* More details */}
    </ScrollView>
  );

  const BudgetRoute = () => (
    <ScrollView style={styles.tabContent}>
      <Text>Total Cost: $150</Text>
      <Text>Transportation: $50</Text>
      {/* More details */}
    </ScrollView>
  );

  const PackingRoute = () => (
    <ScrollView style={styles.tabContent}>
      <Text>- Water Bottle</Text>
      <Text>- Sunscreen</Text>
      {/* More items */}
    </ScrollView>
  );

  const CommentsRoute = () => (
    <ScrollView style={styles.tabContent}>
      <Text>User1: Amazing trip!</Text>
      <Text>User2: I want to join next time.</Text>
      {/* More comments */}
    </ScrollView>
  );

  const renderScene = SceneMap({
    itinerary: ItineraryRoute,
    budget: BudgetRoute,
    packing: PackingRoute,
    comments: CommentsRoute,
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Image Carousel */}
        <ScrollView horizontal pagingEnabled style={styles.carousel}>
          <Image source={require('../../assets/trip1.jpg')} style={styles.carouselImage} />
          <Image source={require('../../assets/trip2.jpg')} style={styles.carouselImage} />
        </ScrollView>
        <View style={styles.summary}>
          <Text style={styles.title}>Waterfall Adventure</Text>
          <Text style={styles.subtitle}>Posted by Kush on 14-02-2025</Text>
        </View>
      </ScrollView>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar {...props} style={styles.tabBar} indicatorStyle={{ backgroundColor: '#007AFF' }} />
        )}
      />
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Join Trip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  carousel: { height: 250 },
  carouselImage: { width: Dimensions.get('window').width, height: 250 },
  summary: { padding: 15 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666', marginVertical: 5 },
  tabBar: { backgroundColor: '#fff' },
  tabContent: { padding: 15 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  actionButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8 },
  actionText: { color: '#fff', fontWeight: 'bold' },
});

export default TripDetailsScreen;
