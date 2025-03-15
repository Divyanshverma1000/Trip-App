// src/screens/TripDetailsScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { createTrip } from '../lib/trips';
import { createBlogPost } from '../lib/blogs';

const TripBlogForm = ({ navigation }) => {
  const [tripData, setTripData] = useState({
    title: '',
    description: '',
    metadata: {
      destination: '',
      cost: '',
      duration: ''
    },
    itinerary: [
      {
        day: 1,
        dayNotes: '',
        stay: {
          hotelName: '',
          address: '',
          description: '',
          cost: '',
          rating: ''
        },
        places: [],
        activities: [],
        restaurant: []
      }
    ]
  });

  const [currentDay, setCurrentDay] = useState(0);

  const addPlace = (dayIndex) => {
    const updatedItinerary = [...tripData.itinerary];
    updatedItinerary[dayIndex].places.push({
      name: '',
      address: '',
      time: '',
      description: '',
      expense: ''
    });
    setTripData({ ...tripData, itinerary: updatedItinerary });
  };

  const updatePlace = (dayIndex, placeIndex, field, value) => {
    const updatedItinerary = [...tripData.itinerary];
    updatedItinerary[dayIndex].places[placeIndex][field] = value;
    setTripData({ ...tripData, itinerary: updatedItinerary });
  };

  const updateStay = (dayIndex, field, value) => {
    const updatedItinerary = [...tripData.itinerary];
    updatedItinerary[dayIndex].stay[field] = value;
    setTripData({ ...tripData, itinerary: updatedItinerary });
  };

  const addDay = () => {
    const newDay = {
      day: tripData.itinerary.length + 1,
      dayNotes: '',
      stay: {
        hotelName: '',
        address: '',
        description: '',
        cost: '',
        rating: ''
      },
      places: [],
      activities: [],
      restaurant: []
    };
    setTripData({
      ...tripData,
      itinerary: [...tripData.itinerary, newDay]
    });
  };

  const handleSubmit = async () => {
    try {
      // First create the trip
      const createdTrip = await createTrip(tripData);
      // Then create the blog post
      await createBlogPost(createdTrip._id);
      Alert.alert('Success', 'Trip and blog created successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        {/* Basic Trip Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Trip Title"
            value={tripData.title}
            onChangeText={(text) => setTripData({ ...tripData, title: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            multiline
            value={tripData.description}
            onChangeText={(text) => setTripData({ ...tripData, description: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Destination"
            value={tripData.metadata.destination}
            onChangeText={(text) => setTripData({
              ...tripData,
              metadata: { ...tripData.metadata, destination: text }
            })}
          />
          <TextInput
            style={styles.input}
            placeholder="Estimated Cost"
            keyboardType="numeric"
            value={tripData.metadata.cost}
            onChangeText={(text) => setTripData({
              ...tripData,
              metadata: { ...tripData.metadata, cost: text }
            })}
          />
          <TextInput
            style={styles.input}
            placeholder="Duration (days)"
            keyboardType="numeric"
            value={tripData.metadata.duration}
            onChangeText={(text) => setTripData({
              ...tripData,
              metadata: { ...tripData.metadata, duration: text }
            })}
          />
        </View>

        {/* Itinerary Section */}
        {tripData.itinerary.map((day, dayIndex) => (
          <View key={dayIndex} style={styles.daySection}>
            <Text style={styles.dayTitle}>Day {day.day}</Text>
            
            {/* Stay Details */}
            <View style={styles.staySection}>
              <Text style={styles.subTitle}>Stay</Text>
              <TextInput
                style={styles.input}
                placeholder="Hotel Name"
                value={day.stay.hotelName}
                onChangeText={(text) => updateStay(dayIndex, 'hotelName', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={day.stay.address}
                onChangeText={(text) => updateStay(dayIndex, 'address', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                multiline
                value={day.stay.description}
                onChangeText={(text) => updateStay(dayIndex, 'description', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Cost"
                keyboardType="numeric"
                value={day.stay.cost}
                onChangeText={(text) => updateStay(dayIndex, 'cost', text)}
              />
            </View>

            {/* Places */}
            <View style={styles.placesSection}>
              <Text style={styles.subTitle}>Places</Text>
              {day.places.map((place, placeIndex) => (
                <View key={placeIndex} style={styles.placeItem}>
                  <TextInput
                    style={styles.input}
                    placeholder="Place Name"
                    value={place.name}
                    onChangeText={(text) => updatePlace(dayIndex, placeIndex, 'name', text)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={place.address}
                    onChangeText={(text) => updatePlace(dayIndex, placeIndex, 'address', text)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Time"
                    value={place.time}
                    onChangeText={(text) => updatePlace(dayIndex, placeIndex, 'time', text)}
                  />
                </View>
              ))}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addPlace(dayIndex)}
              >
                <Feather name="plus" size={20} color="#4CAF50" />
                <Text style={styles.addButtonText}>Add Place</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addDayButton}
          onPress={addDay}
        >
          <Feather name="plus-circle" size={20} color="#4CAF50" />
          <Text style={styles.addDayButtonText}>Add Day</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Create Trip & Blog</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  daySection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  staySection: {
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  placesSection: {
    marginBottom: 16,
  },
  placeItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
  },
  addButtonText: {
    marginLeft: 8,
    color: '#4CAF50',
    fontWeight: '500',
  },
  addDayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    marginBottom: 20,
  },
  addDayButtonText: {
    marginLeft: 8,
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TripBlogForm;
