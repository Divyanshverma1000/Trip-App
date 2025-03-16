import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Feather, MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { getTrip, updateTrip } from '../lib/trips';
import Toast from 'react-native-toast-message';

const ItineraryPlanningScreen = ({ route, navigation }) => {
  const { tripId } = route.params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [expandedDay, setExpandedDay] = useState(null);

  useEffect(() => {
    loadTripDetails();
  }, [tripId]);

  const loadTripDetails = async () => {
    try {
      const tripData = await getTrip(tripId);
      setTrip(tripData);
      setItinerary(tripData.itinerary || []);
      setLoading(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load trip details'
      });
    }
  };

  const validateRequiredFields = (day) => {
    // Required fields validation
    if (!day.stay.hotelName) {
      Alert.alert('Missing Information', 'Please enter hotel name for Day ' + day.day);
      return false;
    }
    if (day.places.length === 0) {
      Alert.alert('Missing Information', 'Please add at least one place to visit for Day ' + day.day);
      return false;
    }
    return true;
  };

  const addDay = () => {
    const newDay = {
      day: itinerary.length + 1,
      dayNotes: '',
      stay: {
        hotelName: '',
        address: '',
        description: '',
        cost: '',
        rating: 5
      },
      places: [],
      restaurant: [],
      activities: []
    };
    setItinerary([...itinerary, newDay]);
    setExpandedDay(itinerary.length); // Auto expand new day
  };

  const addPlace = (dayIndex) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[dayIndex].places.push({
      name: '',
      address: '',
      time: '',
      description: '',
      expense: ''
    });
    setItinerary(updatedItinerary);
  };

  const addRestaurant = (dayIndex) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[dayIndex].restaurant.push({
      name: '',
      address: '',
      description: '',
      cost: '',
      mealType: ''
    });
    setItinerary(updatedItinerary);
  };

  const addActivity = (dayIndex) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[dayIndex].activities.push({
      activityName: '',
      description: '',
      cost: ''
    });
    setItinerary(updatedItinerary);
  };

  const updatePlaceDetails = (dayIndex, placeIndex, field, value) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[dayIndex].places[placeIndex][field] = value;
    setItinerary(updatedItinerary);
  };

  const updateRestaurantDetails = (dayIndex, restaurantIndex, field, value) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[dayIndex].restaurant[restaurantIndex][field] = value;
    setItinerary(updatedItinerary);
  };

  const updateActivityDetails = (dayIndex, activityIndex, field, value) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[dayIndex].activities[activityIndex][field] = value;
    setItinerary(updatedItinerary);
  };

  const updateStayDetails = (dayIndex, field, value) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[dayIndex].stay[field] = value;
    setItinerary(updatedItinerary);
  };

  const saveItinerary = async () => {
    try {
      setSaving(true);
      
      if (!itinerary || itinerary.length === 0) {
        throw new Error('Itinerary cannot be empty');
      }

      // Validate required fields for each day
      for (let day of itinerary) {
        if (!validateRequiredFields(day)) {
          setSaving(false);
          return;
        }
      }

      await updateTrip(tripId, { itinerary });
      Toast.show({
        type: 'success',
        text1: 'Itinerary saved successfully'
      });
      navigation.goBack();
    } catch (error) {
      console.error('Save itinerary error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to save itinerary',
        text2: error.message || 'Please try again'
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleDayExpansion = (dayIndex) => {
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan Itinerary</Text>
        <TouchableOpacity onPress={saveItinerary} disabled={saving} style={styles.headerButton}>
          <Feather name="save" size={24} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {itinerary.map((day, dayIndex) => (
          <View key={dayIndex} style={styles.dayContainer}>
            <TouchableOpacity 
              style={[styles.dayHeader, expandedDay === dayIndex && styles.activeDayHeader]}
              onPress={() => toggleDayExpansion(dayIndex)}
            >
              <View style={styles.dayHeaderLeft}>
                <FontAwesome5 name="calendar-day" size={20} color="#6366F1" />
                <Text style={styles.dayTitle}>Day {day.day}</Text>
              </View>
              <Feather 
                name={expandedDay === dayIndex ? "chevron-up" : "chevron-down"} 
                size={24} 
                color="#6366F1"
              />
            </TouchableOpacity>

            {expandedDay === dayIndex && (
              <View style={styles.dayContent}>
                <View style={styles.notesContainer}>
                  <Feather name="edit-3" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.dayNotes}
                    placeholder="Add notes for this day..."
                    value={day.dayNotes}
                    onChangeText={(text) => {
                      const updatedItinerary = [...itinerary];
                      updatedItinerary[dayIndex].dayNotes = text;
                      setItinerary(updatedItinerary);
                    }}
                    multiline
                  />
                </View>

                {/* Stay Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Feather name="home" size={20} color="#6366F1" />
                    <Text style={styles.sectionTitle}>Stay</Text>
                  </View>
                  <View style={styles.cardContainer}>
                    <View style={styles.inputContainer}>
                      <Feather name="bookmark" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Hotel name *"
                        value={day.stay.hotelName}
                        onChangeText={(text) => updateStayDetails(dayIndex, 'hotelName', text)}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Feather name="map-pin" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Address"
                        value={day.stay.address}
                        onChangeText={(text) => updateStayDetails(dayIndex, 'address', text)}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Feather name="file-text" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Description"
                        value={day.stay.description}
                        onChangeText={(text) => updateStayDetails(dayIndex, 'description', text)}
                        multiline
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Feather name="dollar-sign" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Cost"
                        value={day.stay.cost.toString()}
                        onChangeText={(text) => updateStayDetails(dayIndex, 'cost', text)}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>

                {/* Places Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Feather name="map" size={20} color="#6366F1" />
                    <Text style={styles.sectionTitle}>Places to Visit *</Text>
                  </View>
                  {day.places.map((place, placeIndex) => (
                    <View key={placeIndex} style={styles.cardContainer}>
                      <Text style={styles.cardTitle}>Place {placeIndex + 1}</Text>
                      <View style={styles.inputContainer}>
                        <Feather name="map-pin" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Place name"
                          value={place.name}
                          onChangeText={(text) => updatePlaceDetails(dayIndex, placeIndex, 'name', text)}
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Ionicons name="time-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Time"
                          value={place.time}
                          onChangeText={(text) => updatePlaceDetails(dayIndex, placeIndex, 'time', text)}
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Feather name="map-pin" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Address"
                          value={place.address}
                          onChangeText={(text) => updatePlaceDetails(dayIndex, placeIndex, 'address', text)}
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Feather name="file-text" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Description"
                          value={place.description}
                          onChangeText={(text) => updatePlaceDetails(dayIndex, placeIndex, 'description', text)}
                          multiline
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Feather name="dollar-sign" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Expense"
                          value={place.expense.toString()}
                          onChangeText={(text) => updatePlaceDetails(dayIndex, placeIndex, 'expense', text)}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  ))}
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => addPlace(dayIndex)}
                  >
                    <Feather name="plus" size={20} color="#FFF" />
                    <Text style={styles.addButtonText}>Add Place</Text>
                  </TouchableOpacity>
                </View>

                {/* Restaurants Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <MaterialIcons name="restaurant" size={20} color="#6366F1" />
                    <Text style={styles.sectionTitle}>Restaurants</Text>
                  </View>
                  {day.restaurant.map((restaurant, restaurantIndex) => (
                    <View key={restaurantIndex} style={styles.cardContainer}>
                      <Text style={styles.cardTitle}>Restaurant {restaurantIndex + 1}</Text>
                      <View style={styles.inputContainer}>
                        <Feather name="coffee" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Restaurant name"
                          value={restaurant.name}
                          onChangeText={(text) => updateRestaurantDetails(dayIndex, restaurantIndex, 'name', text)}
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Feather name="map-pin" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Address"
                          value={restaurant.address}
                          onChangeText={(text) => updateRestaurantDetails(dayIndex, restaurantIndex, 'address', text)}
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Feather name="file-text" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Description"
                          value={restaurant.description}
                          onChangeText={(text) => updateRestaurantDetails(dayIndex, restaurantIndex, 'description', text)}
                          multiline
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Feather name="dollar-sign" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Cost"
                          value={restaurant.cost.toString()}
                          onChangeText={(text) => updateRestaurantDetails(dayIndex, restaurantIndex, 'cost', text)}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <MaterialIcons name="restaurant-menu" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Meal Type (breakfast/lunch/dinner)"
                          value={restaurant.mealType}
                          onChangeText={(text) => updateRestaurantDetails(dayIndex, restaurantIndex, 'mealType', text)}
                        />
                      </View>
                    </View>
                  ))}
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => addRestaurant(dayIndex)}
                  >
                    <Feather name="plus" size={20} color="#FFF" />
                    <Text style={styles.addButtonText}>Add Restaurant</Text>
                  </TouchableOpacity>
                </View>

                {/* Activities Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <MaterialIcons name="local-activity" size={20} color="#6366F1" />
                    <Text style={styles.sectionTitle}>Activities</Text>
                  </View>
                  {day.activities.map((activity, activityIndex) => (
                    <View key={activityIndex} style={styles.cardContainer}>
                      <Text style={styles.cardTitle}>Activity {activityIndex + 1}</Text>
                      <View style={styles.inputContainer}>
                        <Feather name="activity" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Activity name"
                          value={activity.activityName}
                          onChangeText={(text) => updateActivityDetails(dayIndex, activityIndex, 'activityName', text)}
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Feather name="file-text" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Description"
                          value={activity.description}
                          onChangeText={(text) => updateActivityDetails(dayIndex, activityIndex, 'description', text)}
                          multiline
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Feather name="dollar-sign" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Cost"
                          value={activity.cost.toString()}
                          onChangeText={(text) => updateActivityDetails(dayIndex, activityIndex, 'cost', text)}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  ))}
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => addActivity(dayIndex)}
                  >
                    <Feather name="plus" size={20} color="#FFF" />
                    <Text style={styles.addButtonText}>Add Activity</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity 
          style={styles.addDayButton}
          onPress={addDay}
        >
          <Feather name="plus" size={24} color="#FFF" />
          <Text style={styles.addDayButtonText}>Add Day</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  dayContainer: {
    marginBottom: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  activeDayHeader: {
    backgroundColor: '#F1F5F9',
  },
  dayHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginLeft: 8,
  },
  dayContent: {
    padding: 16,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    marginBottom: 16,
    padding: 8,
  },
  dayNotes: {
    flex: 1,
    minHeight: 60,
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginLeft: 8,
  },
  cardContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    padding: 8,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  addDayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  addDayButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ItineraryPlanningScreen;