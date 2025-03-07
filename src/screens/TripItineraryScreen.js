import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const TripItineraryScreen = ({ navigation, route }) => {
  const { tripDetails } = route.params;
  const [currentDay, setCurrentDay] = useState({
    day: 1,
    dayNotes: '',
    stay: {
      hotelName: '',
      address: '',
      description: '',
      cost: 0,
      rating: 0
    },
    places: [],
    restaurant: [],
    activities: []
  });

  const [expandedSections, setExpandedSections] = useState({});
  const [showStaySection, setShowStaySection] = useState(false);

  const [itinerary, setItinerary] = useState([]);

  const addPlace = () => {
    const newIndex = currentDay.places.length;
    setCurrentDay(prev => ({
      ...prev,
      places: [...prev.places, {
        name: '',
        address: '',
        time: '',
        description: '',
        expense: 0
      }]
    }));
    // Automatically expand the new section
    setExpandedSections(prev => ({
      ...prev,
      [`place_${newIndex}`]: true
    }));
  };

  const addRestaurant = () => {
    const newIndex = currentDay.restaurant.length;
    setCurrentDay(prev => ({
      ...prev,
      restaurant: [...prev.restaurant, {
        name: '',
        address: '',
        description: '',
        cost: 0,
        mealType: ''
      }]
    }));
    // Automatically expand the new section
    setExpandedSections(prev => ({
      ...prev,
      [`restaurant_${newIndex}`]: true
    }));
  };

  const addActivity = () => {
    const newIndex = currentDay.activities.length;
    setCurrentDay(prev => ({
      ...prev,
      activities: [...prev.activities, {
        activityName: '',
        description: '',
        cost: 0
      }]
    }));
    // Automatically expand the new section
    setExpandedSections(prev => ({
      ...prev,
      [`activity_${newIndex}`]: true
    }));
  };

  const updatePlace = (index, field, value) => {
    setCurrentDay(prev => ({
      ...prev,
      places: prev.places.map((place, i) => 
        i === index ? { ...place, [field]: value } : place
      )
    }));
  };

  const updateRestaurant = (index, field, value) => {
    setCurrentDay(prev => ({
      ...prev,
      restaurant: prev.restaurant.map((rest, i) => 
        i === index ? { ...rest, [field]: value } : rest
      )
    }));
  };

  const updateActivity = (index, field, value) => {
    setCurrentDay(prev => ({
      ...prev,
      activities: prev.activities.map((activity, i) => 
        i === index ? { ...activity, [field]: value } : activity
      )
    }));
  };

  const updateStay = (field, value) => {
    setCurrentDay(prev => ({
      ...prev,
      stay: {
        ...prev.stay,
        [field]: value
      }
    }));
  };

  const handleShowStaySection = () => {
    setShowStaySection(true);
    setExpandedSections(prev => ({
      ...prev,
      stay: true
    }));
  };

  const handleAddDay = (isLastDay = false) => {
    const updatedItinerary = [...itinerary, currentDay];
    setItinerary(updatedItinerary);

    if (isLastDay) {
      navigation.navigate('PhotoUpload', {
        tripDetails: {
          ...tripDetails,
          itinerary: updatedItinerary,
          }
      });
    } else {
      setCurrentDay({
        day: currentDay.day + 1,
        dayNotes: '',
        stay: {
          hotelName: '',
          address: '',
          description: '',
          cost: 0,
          rating: 0
        },
        places: [],
        restaurant: [],
        activities: []
      });
      // Reset expanded sections for the new day
      setExpandedSections({});
      setShowStaySection(false);
    }
  };

  // Add Item Menu Component
  const AddItemMenu = () => (
    <View style={styles.addItemMenu}>
      <Text style={styles.addItemTitle}>Add to your itinerary:</Text>
      <View style={styles.addItemGrid}>
        {!showStaySection && (
          <TouchableOpacity 
            style={styles.addItemButton} 
            onPress={handleShowStaySection}
          >
            <Ionicons name="bed-outline" size={24} color="#4CAF50" />
            <Text style={styles.addItemText}>Stay</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.addItemButton} 
          onPress={addPlace}
        >
          <Ionicons name="location-outline" size={24} color="#2196F3" />
          <Text style={styles.addItemText}>Place</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.addItemButton} 
          onPress={addRestaurant}
        >
          <Ionicons name="restaurant-outline" size={24} color="#FF9800" />
          <Text style={styles.addItemText}>Restaurant</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.addItemButton} 
          onPress={addActivity}
        >
          <Ionicons name="bicycle-outline" size={24} color="#9C27B0" />
          <Text style={styles.addItemText}>Activity</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Collapsible Section Component
  const CollapsibleSection = ({ title, children, isExpanded, onToggle, onDelete }) => (
    <View style={styles.section}>
      <TouchableOpacity 
        style={styles.sectionHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.headerButtons}>
          {onDelete && (
            <TouchableOpacity 
              onPress={onDelete} 
              style={styles.deleteButton}
              activeOpacity={0.7}
            >
              <MaterialIcons name="delete-outline" size={24} color="#ff4444" />
            </TouchableOpacity>
          )}
          <MaterialIcons 
            name={isExpanded ? 'expand-less' : 'expand-more'} 
            size={24} 
            color="#666"
          />
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <View onStartShouldSetResponder={() => true}>
          {children}
        </View>
      )}
    </View>
  );

  // Stay Section
  const StaySection = () => (
    showStaySection && (
      <CollapsibleSection
        title={currentDay.stay?.hotelName || "Stay Details"}
        isExpanded={expandedSections.stay}
        onToggle={() => toggleSection('stay')}
        onDelete={() => {
          setShowStaySection(false);
          setCurrentDay(prev => ({ 
            ...prev, 
            stay: { hotelName: '', address: '', description: '', cost: 0, rating: 0 }
          }));
        }}
      >
        <View style={styles.sectionContent}>
          <TextInput
            style={styles.input}
            placeholder="Hotel Name"
            value={currentDay.stay?.hotelName}
            onChangeText={(text) => updateStay('hotelName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={currentDay.stay?.address}
            onChangeText={(text) => updateStay('address', text)}
          />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Description"
            value={currentDay.stay?.description}
            onChangeText={(text) => updateStay('description', text)}
            multiline
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.flex1]}
              placeholder="Cost"
              value={currentDay.stay?.cost?.toString()}
              onChangeText={(text) => updateStay('cost', parseFloat(text) || 0)}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.flex1]}
              placeholder="Rating (1-5)"
              value={currentDay.stay?.rating?.toString()}
              onChangeText={(text) => updateStay('rating', parseInt(text) || 0)}
              keyboardType="numeric"
            />
          </View>
        </View>
      </CollapsibleSection>
    )
  );

  // Places Section
  const PlacesSection = () => (
    currentDay.places.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Places ({currentDay.places.length})</Text>
        {currentDay.places.map((place, index) => (
          <CollapsibleSection
            key={index}
            title={place.name || `Place ${index + 1}`}
            isExpanded={expandedSections[`place_${index}`]}
            onToggle={() => toggleSection(`place_${index}`)}
            onDelete={() => removePlace(index)}
          >
            <View style={styles.sectionContent}>
              <TextInput
                style={styles.input}
                placeholder="Place Name"
                value={place.name}
                onChangeText={(text) => updatePlace(index, 'name', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={place.address}
                onChangeText={(text) => updatePlace(index, 'address', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Visit Time"
                value={place.time}
                onChangeText={(text) => updatePlace(index, 'time', text)}
              />
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Description"
                value={place.description}
                onChangeText={(text) => updatePlace(index, 'description', text)}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Expected Expense"
                value={place.expense?.toString()}
                onChangeText={(text) => updatePlace(index, 'expense', parseFloat(text) || 0)}
                keyboardType="numeric"
              />
            </View>
          </CollapsibleSection>
        ))}
      </View>
    )
  );

  // Restaurants Section
  const RestaurantsSection = () => (
    currentDay.restaurant.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Restaurants ({currentDay.restaurant.length})</Text>
        {currentDay.restaurant.map((rest, index) => (
          <CollapsibleSection
            key={index}
            title={rest.name || `Restaurant ${index + 1}`}
            isExpanded={expandedSections[`restaurant_${index}`]}
            onToggle={() => toggleSection(`restaurant_${index}`)}
            onDelete={() => removeRestaurant(index)}
          >
            <View style={styles.sectionContent}>
              <TextInput
                style={styles.input}
                placeholder="Restaurant Name"
                value={rest.name}
                onChangeText={(text) => updateRestaurant(index, 'name', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={rest.address}
                onChangeText={(text) => updateRestaurant(index, 'address', text)}
              />
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Description (cuisine, special dishes, etc.)"
                value={rest.description}
                onChangeText={(text) => updateRestaurant(index, 'description', text)}
                multiline
              />
              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Text style={styles.inputLabel}>Meal Type</Text>
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => {
                      const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
                      const currentIndex = mealTypes.indexOf(rest.mealType);
                      const nextType = mealTypes[(currentIndex + 1) % mealTypes.length];
                      updateRestaurant(index, 'mealType', nextType);
                    }}
                  >
                    <Text style={styles.selectButtonText}>
                      {rest.mealType || 'Select Meal Type'}
                    </Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={[styles.input, styles.flex1]}
                  placeholder="Cost"
                  value={rest.cost?.toString()}
                  onChangeText={(text) => updateRestaurant(index, 'cost', parseFloat(text) || 0)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </CollapsibleSection>
        ))}
      </View>
    )
  );

  // Activities Section
  const ActivitiesSection = () => (
    currentDay.activities.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activities ({currentDay.activities.length})</Text>
        {currentDay.activities.map((activity, index) => (
          <CollapsibleSection
            key={index}
            title={activity.activityName || `Activity ${index + 1}`}
            isExpanded={expandedSections[`activity_${index}`]}
            onToggle={() => toggleSection(`activity_${index}`)}
            onDelete={() => removeActivity(index)}
          >
            <View style={styles.sectionContent}>
              <TextInput
                style={styles.input}
                placeholder="Activity Name"
                value={activity.activityName}
                onChangeText={(text) => updateActivity(index, 'activityName', text)}
              />
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Description (what to expect, requirements, etc.)"
                value={activity.description}
                onChangeText={(text) => updateActivity(index, 'description', text)}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Cost"
                value={activity.cost?.toString()}
                onChangeText={(text) => updateActivity(index, 'cost', parseFloat(text) || 0)}
                keyboardType="numeric"
              />
            </View>
          </CollapsibleSection>
        ))}
      </View>
    )
  );

  // Add these remove functions near your other state update functions
  const removeRestaurant = (index) => {
    setCurrentDay(prev => ({
      ...prev,
      restaurant: prev.restaurant.filter((_, i) => i !== index)
    }));
    setExpandedSections(prev => {
      const { [`restaurant_${index}`]: _, ...rest } = prev;
      return rest;
    });
  };

  const removeActivity = (index) => {
    setCurrentDay(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
    setExpandedSections(prev => {
      const { [`activity_${index}`]: _, ...rest } = prev;
      return rest;
    });
  };

  // Add these to your styles
  const additionalStyles = {
    inputLabel: {
      fontSize: 14,
      color: '#666',
      marginBottom: 4,
    },
    selectButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#dee2e6',
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      backgroundColor: '#fff',
    },
    selectButtonText: {
      color: '#495057',
    },
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const removePlace = (index) => {
    setCurrentDay(prev => ({
      ...prev,
      places: prev.places.filter((_, i) => i !== index)
    }));
    setExpandedSections(prev => {
      const { [`place_${index}`]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>Day {currentDay.day}</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Add notes for this day..."
          value={currentDay.dayNotes}
          onChangeText={(text) => setCurrentDay(prev => ({ ...prev, dayNotes: text }))}
          multiline
        />
      </View>

      <AddItemMenu />
      
      <StaySection />
      <PlacesSection />
      <RestaurantsSection />
      <ActivitiesSection />

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={() => handleAddDay(false)}
        >
          <Text style={styles.buttonText}>Add Another Day</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={() => handleAddDay(true)}
        >
          <Text style={styles.buttonText}>Finish Itinerary</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  dayHeader: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addItemMenu: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  addItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  addItemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  addItemButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  addItemText: {
    marginTop: 8,
    color: '#495057',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionContent: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  selectButtonText: {
    color: '#495057',
  },
});

export default TripItineraryScreen; 