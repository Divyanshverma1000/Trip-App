import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { createBlogPost } from '../../lib/blogs';
import { AuthContext } from '../../navigation/AppNavigator';
import { getMyTrips } from '../../lib/trips';
import { useContext } from 'react';
import Toast from 'react-native-toast-message';

const CreateBlogTripScreen = ({ navigation, route }) => {
  const { blogData } = route.params;
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); // Track which option is selected

  useEffect(() => {
    fetchUserTrips();
  }, []);

  const fetchUserTrips = async () => {
    try {
      const trips = await getMyTrips(user.id); 
      setUserTrips(trips);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const handleCreateNewTrip = () => {
    navigation.navigate('CreateTrip', {
      fromBlogCreation: true,
      onTripCreated: (newTrip) => {
        setSelectedTripId(newTrip._id);
        setSelectedOption('new'); // Set selected option to 'new'
        Toast.show({
          type: 'success',
          text1: 'Trip selected for blog'
        });
      }
    });
  };

  const handleCreateBlog = async () => {
    setLoading(true);
    try {
      if (selectedTripId) {
        blogData.append('tripId', selectedTripId);
      }

      const response = await createBlogPost(blogData);
      
      Alert.alert(
        'Success',
        'Your blog post has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Feed')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create blog post. Please try again.');
      console.error('Error creating blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTripOption = () => (
    <View style={styles.optionsContainer}>
      <TouchableOpacity
        style={[
          styles.optionButton,
          selectedOption === 'none' && styles.optionButtonSelected
        ]}
        onPress={() => {
          setSelectedTripId(null);
          setSelectedOption('none');
        }}
      >
        <MaterialIcons
          name="post-add"
          size={24}
          color={selectedOption === 'none' ? '#FFF' : '#666'}
        />
        <Text style={[
          styles.optionText,
          selectedOption === 'none' && styles.optionTextSelected
        ]}>
          Create Blog Without Trip
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionButton,
          selectedOption === 'existing' && styles.optionButtonSelected
        ]}
        onPress={() => {
          setSelectedTripId(null);
          setSelectedOption('existing');
        }}
      >
        <MaterialIcons
          name="collections-bookmark"
          size={24}
          color={selectedOption === 'existing' ? '#FFF' : '#666'}
        />
        <Text style={[
          styles.optionText,
          selectedOption === 'existing' && styles.optionTextSelected
        ]}>
          Select Existing Trip
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionButton,
          selectedOption === 'new' && styles.optionButtonSelected
        ]}
        onPress={() => {
          setSelectedTripId(null);
          setSelectedOption('new');
          handleCreateNewTrip();
        }}
      >
        <MaterialIcons
          name="add-location"
          size={24}
          color={selectedOption === 'new' ? '#FFF' : '#666'}
        />
        <Text style={[
          styles.optionText,
          selectedOption === 'new' && styles.optionTextSelected
        ]}>
          Create New Trip
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderExistingTrips = () => (
    <View style={styles.tripsContainer}>
      <Text style={styles.sectionTitle}>Select a Trip</Text>
      <ScrollView style={styles.tripsList}>
        {userTrips.map((trip) => (
          <TouchableOpacity
            key={trip._id}
            style={[
              styles.tripItem,
              selectedTripId === trip._id && styles.tripItemSelected
            ]}
            onPress={() => setSelectedTripId(trip._id)}
          >
            <Image 
              source={trip.coverPhoto ? {uri: trip.coverPhoto} : require('../../../assets/bali.jpg')}
              style={styles.tripCoverPhoto}
            />
            <View style={styles.tripInfo}>
              <Text style={styles.tripTitle}>{trip.title}</Text>
              <Text style={styles.tripDates}>
                {new Date(trip.startDate).toLocaleDateString()} - 
                {new Date(trip.endDate).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trip Details</Text>
        <Text style={styles.headerSubtitle}>Step 3: Add trip information (Optional)</Text>
      </View>

      <ScrollView style={styles.content}>
        {renderTripOption()}
        {selectedOption === 'existing' && renderExistingTrips()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.publishButton}
          onPress={handleCreateBlog}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.publishButtonText}>Publish Blog</Text>
              <MaterialIcons name="publish" size={24} color="#FFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  optionsContainer: {
    padding: 16,
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    gap: 12,
  },
  optionButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#FFF',
  },
  tripsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tripsList: {
    maxHeight: 300,
  },
  tripItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripItemSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  tripCoverPhoto: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  tripInfo: {
    flex: 1,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  tripDates: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  backButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  publishButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  publishButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreateBlogTripScreen;