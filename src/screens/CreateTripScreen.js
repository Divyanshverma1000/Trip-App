import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Switch,
  Platform,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createTrip } from '../lib/trips';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { CommonActions } from '@react-navigation/native';

const CreateTripScreen = ({ navigation, route }) => {
  const { fromBlogCreation, onTripCreated } = route.params || {};

  const [tripData, setTripData] = useState({
    title: '',
    description: '',
    metadata: {
      destination: '',
      duration: '',
      cost: ''
    },
    itinerary: [],
    packingEssentials: [],
    estimatedBudget: '',
    actualBudget: '',
    tags: [],
    isPublic: true,
    status: 'planning',
    photos: []
  });
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [currentEssential, setCurrentEssential] = useState('');
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [additionalPhotos, setAdditionalPhotos] = useState([]);

  const togglePrivacy = () => {
    setTripData(prev => ({ ...prev, isPublic: !prev.isPublic }));
  };

  const handleAddTag = () => {
    if (currentTag.trim()) {
      setTripData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTripData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setCoverPhoto(result.assets[0]);
    }
  };

  const pickAdditionalPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newPhotos = result.assets.map(asset => ({
        uri: asset.uri,
        caption: ''
      }));
      setAdditionalPhotos([...additionalPhotos, ...newPhotos]);
    }
  };

  const handleRemovePhoto = (indexToRemove) => {
    setAdditionalPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleAddEssential = () => {
    if (currentEssential.trim()) {
      setTripData(prev => ({
        ...prev,
        packingEssentials: [...prev.packingEssentials, currentEssential.trim()]
      }));
      setCurrentEssential('');
    }
  };

  const handleRemoveEssential = (itemToRemove) => {
    setTripData(prev => ({
      ...prev,
      packingEssentials: prev.packingEssentials.filter(item => item !== itemToRemove)
    }));
  };

  const handleCreateTrip = async () => {
    if (!coverPhoto) {
      Toast.show({
        type: 'error',
        text1: 'Cover photo is required'
      });
      return;
    }

    const formData = new FormData();
    
    formData.append('title', tripData.title);
    formData.append('description', tripData.description);
    formData.append('isPublic', tripData.isPublic);
    formData.append('status', tripData.status);
    formData.append('metadata', JSON.stringify(tripData.metadata));
    formData.append('estimatedBudget', tripData.estimatedBudget);
    formData.append('actualBudget', tripData.actualBudget);
    formData.append('tags', JSON.stringify(tripData.tags));
    formData.append('packingEssentials', JSON.stringify(tripData.packingEssentials));
    formData.append('itinerary', JSON.stringify(tripData.itinerary));
    
    const photoFileName = coverPhoto.uri.split('/').pop();
    const photoType = 'image/' + (photoFileName.split('.').pop() || 'jpeg');
    formData.append('coverPhoto', {
      uri: coverPhoto.uri,
      name: photoFileName,
      type: photoType
    });


    additionalPhotos.forEach((photo, index) => {
      const fileName = photo.uri.split('/').pop();
      const fileType = 'image/' + (fileName.split('.').pop() || 'jpeg');
      
      formData.append("tripPhotos", {
        uri: photo.uri,
        name: fileName,
        type: fileType
      });
    
      // Append captions using array notation
      formData.append(`photosCaptions[${index}]`, photo.caption || '');
    });
    

    try {
      setLoading(true);
      const createdTrip = await createTrip(formData);
      
      Toast.show({
        type: 'success',
        text1: 'Trip created successfully!'
      });

      // Check if we came from blog creation
      if (fromBlogCreation && onTripCreated) {
        // Navigate back to blog creation with the new trip
        onTripCreated(createdTrip);
        navigation.goBack();
      } else {
        // Normal flow - go to Profile
        // navigation.navigate('Profile');
         navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{ name: 'Main', params: { screen: 'Profile' } }]
                        })
                      );
      }

    } catch (error) {
      console.error('Failed to create trip:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to create trip',
        text2: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Trip</Text>
      </View>
 
      {/* Privacy Toggle */}
      <View style={styles.privacyToggleContainer}>
        <Text style={styles.privacyLabel}>{tripData.isPublic ? 'Public Trip' : 'Private Trip'}</Text>
        <Switch value={tripData.isPublic} onValueChange={togglePrivacy} />
      </View>

      <View style={styles.form}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <Text style={styles.label}>Trip Title*</Text>
          <TextInput
            style={styles.input}
            value={tripData.title}
            onChangeText={(text) => setTripData(prev => ({ ...prev, title: text }))}
            placeholder="Enter trip title"
          />

          <Text style={styles.label}>Description*</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={tripData.description}
            onChangeText={(text) => setTripData(prev => ({ ...prev, description: text }))}
            placeholder="Describe your trip"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destination Details</Text>
          
          <Text style={styles.label}>Destination*</Text>
          <TextInput
            style={styles.input}
            value={tripData.metadata.destination}
            onChangeText={(text) => setTripData(prev => ({
              ...prev,
              metadata: { ...prev.metadata, destination: text }
            }))}
            placeholder="Where are you going?"
          />

          <Text style={styles.label}>Duration (days)</Text>
          <TextInput
            style={styles.input}
            value={tripData.metadata.duration}
            onChangeText={(text) => setTripData(prev => ({
              ...prev,
              metadata: { ...prev.metadata, duration: text }
            }))}
            placeholder="How many days?"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Expected Cost</Text>
          <TextInput
            style={styles.input}
            value={tripData.metadata.cost}
            onChangeText={(text) => setTripData(prev => ({
              ...prev,
              metadata: { ...prev.metadata, cost: text }
            }))}
            placeholder="Expected cost per person"
            keyboardType="numeric"
          />
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Information</Text>
          
          <Text style={styles.label}>Estimated Budget</Text>
          <TextInput
            style={styles.input}
            value={tripData.estimatedBudget}
            onChangeText={(text) => setTripData(prev => ({ ...prev, estimatedBudget: text }))}
            placeholder="Enter estimated total budget"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Actual Budget (if known)</Text>
          <TextInput
            style={styles.input}
            value={tripData.actualBudget}
            onChangeText={(text) => setTripData(prev => ({ ...prev, actualBudget: text }))}
            placeholder="Enter actual budget (optional)"
            keyboardType="numeric"
          />
        </View> */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Packing Essentials</Text>
          
          <View style={styles.tagInput}>
            <TextInput
              style={styles.tagTextInput}
              value={currentEssential}
              onChangeText={setCurrentEssential}
              placeholder="Add essential items"
            />
            <TouchableOpacity onPress={handleAddEssential} style={styles.addTagButton}>
              <Feather name="plus" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          <View style={styles.tagsContainer}>
            {tripData.packingEssentials.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tag}
                onPress={() => handleRemoveEssential(item)}
              >
                <Text style={styles.tagText}>{item}</Text>
                <Feather name="x" size={16} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          
          <View style={styles.tagInput}>
            <TextInput
              style={styles.tagTextInput}
              value={currentTag}
              onChangeText={setCurrentTag}
              placeholder="Add tags"
            />
            <TouchableOpacity onPress={handleAddTag} style={styles.addTagButton}>
              <Feather name="plus" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          <View style={styles.tagsContainer}>
            {tripData.tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tag}
                onPress={() => handleRemoveTag(tag)}
              >
                <Text style={styles.tagText}>{tag}</Text>
                <Feather name="x" size={16} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          
          <Text style={styles.label}>Cover Photo*</Text>
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            {coverPhoto ? (
              <Image source={{ uri: coverPhoto.uri }} style={styles.previewImage} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Feather name="camera" size={24} color="#666" />
                <Text style={styles.photoButtonText}>Select Cover Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Additional Photos</Text>
          <TouchableOpacity style={styles.addPhotosButton} onPress={pickAdditionalPhotos}>
            <Feather name="plus" size={24} color="#666" />
            <Text style={styles.addPhotosText}>Add More Photos</Text>
          </TouchableOpacity>

          <ScrollView horizontal style={styles.additionalPhotosContainer}>
            {additionalPhotos.map((photo, index) => (
              <View key={index} style={styles.additionalPhotoItem}>
                <View style={styles.photoContainer}>
                  <Image source={{ uri: photo.uri }} style={styles.additionalPhotoImage} />
                  <TouchableOpacity 
                    style={styles.removePhotoButton}
                    onPress={() => handleRemovePhoto(index)}
                  >
                    <Feather name="x" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.photoCaptionInput}
                  value={photo.caption}
                  onChangeText={(text) => {
                    const newPhotos = [...additionalPhotos];
                    newPhotos[index].caption = text;
                    setAdditionalPhotos(newPhotos);
                  }}
                  placeholder="Add caption"
                />
              </View>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleCreateTrip}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.nextButtonText}>Create Trip</Text>
              <Feather name="arrow-right" size={20} color="#FFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
   header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 || 60 : 60,
      paddingBottom: 16,
      backgroundColor: "#4CAF50",
      ...Platform.select({
        android: {
          elevation: 4,
        },
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
      }),
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
    },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  tagInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tagTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    fontSize: 16,
  },
  addTagButton: {
    padding: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    marginRight: 4,
    color: '#666',
  },
  privacyToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginVertical: 10,
  },
  privacyLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  photoButton: {
    height: 200,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  photoButtonText: {
    marginTop: 8,
    color: '#666',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  addPhotosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 16,
  },
  addPhotosText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  additionalPhotosContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  additionalPhotoItem: {
    marginRight: 16,
    width: 150,
  },
  photoContainer: {
    position: 'relative',
  },
  additionalPhotoImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF0000',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCaptionInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
  },
});

export default CreateTripScreen; 