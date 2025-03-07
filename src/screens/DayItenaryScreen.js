// src/screens/DayItineraryScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const DayItineraryScreen = ({ navigation, route }) => {
  const { tripDetails } = route.params;
  const [currentDay, setCurrentDay] = useState({
    stay: {
      hotelName: '',
      address: '',
      description: '',
      cost: 0,
      rating: 0
    },
    day: 1,
    dayNotes: '',
    places: [],
    restaurant: [],
    activities: []
  });
  const [itinerary, setItinerary] = useState([]);

  const handleAddDay = (isLastDay = false) => {
    // Add current day to itinerary
    const updatedItinerary = [...itinerary, currentDay];
    setItinerary(updatedItinerary);

    if (isLastDay) {
      // Navigate to photo upload with trip details and itinerary
      navigation.navigate('PhotoUpload', {
        tripDetails,
        itinerary: updatedItinerary
      });
    } else {
      // Reset current day and increment day number
      setCurrentDay({
        ...currentDay,
        day: currentDay.day + 1,
        stay: { hotelName: '', address: '', description: '', cost: 0, rating: 0 },
        dayNotes: '',
        places: [],
        restaurant: [],
        activities: []
      });
    }
  };

  const handlePlaceChange = (index, field, value) => {
    const updatedPlaces = [...currentDay.places];
    updatedPlaces[index][field] = value;
    setCurrentDay({ ...currentDay, places: updatedPlaces });
  };

  const addPlaceEntry = () => {
    setCurrentDay({ ...currentDay, places: [...currentDay.places, { name: '', notes: '' }] });
  };

  const handleAddNextDay = () => {
    handleAddDay();
  };

  const handleFinishItinerary = () => {
    handleAddDay(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Day {currentDay.day} Itinerary</Text>
      {currentDay.places.map((item, index) => (
        <View key={index} style={styles.placeContainer}>
          <TextInput
            style={styles.input}
            placeholder="Place Name"
            value={item.name}
            onChangeText={(text) => handlePlaceChange(index, 'name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Notes"
            value={item.notes}
            onChangeText={(text) => handlePlaceChange(index, 'notes', text)}
          />
        </View>
      ))}
      <Button title="Add Another Place" onPress={addPlaceEntry} />
      <View style={styles.buttonContainer}>
        <Button title="Add Next Day" onPress={handleAddNextDay} />
        <Button title="Finish Itinerary" onPress={handleFinishItinerary} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  placeContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  input: {
    height: 40,
    borderColor: '#aaa',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default DayItineraryScreen;
