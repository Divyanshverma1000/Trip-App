// src/screens/PhotoUploadScreen.js
import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

const PhotoUploadScreen = ({ navigation, route }) => {
  const { tripDetails, itinerary } = route.params;
  const [photos, setPhotos] = useState([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Reduce quality to help with payload size
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      // Get file name and type
      const name = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(name);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      setPhotos([...photos, {
        uri,
        name,
        type
      }]);
    }
  };

  const handleNext = () => {
    if (photos.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please select at least one photo'
      });
      return;
    }

    navigation.navigate('ReviewPost', {
      tripDetails,
      itinerary,
      photos
    });
  };

  const handleFinishUpload = () => {
    navigation.navigate('ReviewPost', {
      blogData: route.params.blogData,
      itineraryData: route.params.itineraryData,
      photos: photos
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Cover Photo</Text>
      
      {photos.length > 0 && (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photos[0].uri }} style={styles.image} />
        </View>
      )}

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={pickImage}
      >
        <Text style={styles.addButtonText}>
          {photos.length > 0 ? 'Change Photo' : 'Add Cover Photo'}
        </Text>
      </TouchableOpacity>

      <Button 
        title="Next" 
        onPress={handleNext}
        disabled={photos.length === 0} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  photoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 20,
  },
  addButtonText: {
    color: '#fff',
  }
});

export default PhotoUploadScreen;
