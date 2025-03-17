import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const CreateBlogPhotosScreen = ({ route, navigation }) => {
  const { blogData } = route.params;
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [blogPhotos, setBlogPhotos] = useState([]);
  const [photosCaptions, setPhotosCaptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async (isCover = false) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: !isCover,
        quality: 0.8,
        aspect: isCover ? [16, 9] : undefined,
      });

      if (!result.canceled) {
        if (isCover) {
          // Handle cover photo
          const asset = result.assets[0];
          setCoverPhoto({
            uri: asset.uri,
            type: 'image/jpeg',
            name: `cover-${Date.now()}.jpg`,
          });
        } else {
          // Handle blog photos
          const newPhotos = result.assets.map(asset => ({
            uri: asset.uri,
            type: 'image/jpeg',
            name: `blog-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`,
          }));
          setBlogPhotos(prev => [...prev, ...newPhotos]);
          setPhotosCaptions(prev => [...prev, ...newPhotos.map(() => '')]);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error('Error picking image:', error);
    }
  };

  const removePhoto = (index, isCover = false) => {
    if (isCover) {
      setCoverPhoto(null);
    } else {
      setBlogPhotos(prev => prev.filter((_, i) => i !== index));
      setPhotosCaptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateCaption = (index, caption) => {
    setPhotosCaptions(prev => {
      const updated = [...prev];
      updated[index] = caption;
      return updated;
    });
  };

  const handleNext = () => {
    if (!coverPhoto) {
      Alert.alert('Cover Photo Required', 'Please select a cover photo for your blog.');
      return;
    }

    // Create FormData
    const formData = new FormData();

    // Append all text fields
    formData.append('title', blogData.title);
    formData.append('summary', blogData.summary || '');
    formData.append('description', blogData.description || '');
    formData.append('recommendations', blogData.recommendations || '');
    formData.append('advisory', blogData.advisory || '');
    // formData.append('tags', JSON.stringify(blogData.tags || []));
     // Append tags correctly - append each tag individually
  if (blogData.tags && blogData.tags.length > 0) {
    blogData.tags.forEach(tag => {
      formData.append('tags[]', tag);
    });
  }
    if (blogData.budget) {
      formData.append('budget', blogData.budget.toString());
    }

    // Append cover photo
    const coverPhotoFileName = coverPhoto.uri.split('/').pop();
    const coverPhotoType = 'image/' + (coverPhotoFileName.split('.').pop() || 'jpeg');
    formData.append('blogCoverPhoto', {
      uri: coverPhoto.uri,
      name: coverPhotoFileName,
      type: coverPhotoType
    });

    // Append blog photos and their captions
    blogPhotos.forEach((photo, index) => {
      const fileName = photo.uri.split('/').pop();
      const fileType = 'image/' + (fileName.split('.').pop() || 'jpeg');
      
      formData.append('blogPhotos', {
        uri: photo.uri,
        name: fileName,
        type: fileType
      });

      if (photosCaptions[index]) {
        formData.append(`photosCaptions[${index}]`, photosCaptions[index]);
      }
    });

    // Navigate to trip selection with the FormData
    navigation.navigate('CreateBlogTrip', {
      blogData: formData
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Cover Photo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cover Photo*</Text>
          <Text style={styles.sectionSubtitle}>
            Choose an attractive cover photo for your blog
          </Text>

          {coverPhoto ? (
            <View style={styles.coverPhotoContainer}>
              <Image
                source={{ uri: coverPhoto.uri }}
                style={styles.coverPhoto}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePhoto(0, true)}
              >
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={() => pickImage(true)}
              >
                <MaterialIcons name="edit" size={20} color="#fff" />
                <Text style={styles.changeButtonText}>Change Cover</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickImage(true)}
            >
              <MaterialIcons name="add-photo-alternate" size={40} color="#4CAF50" />
              <Text style={styles.uploadText}>Add Cover Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Blog Photos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Blog Photos</Text>
          <Text style={styles.sectionSubtitle}>
            Add photos with captions to enhance your blog
          </Text>

          {blogPhotos.map((photo, index) => (
            <View key={index} style={styles.photoItem}>
              <Image
                source={{ uri: photo.uri }}
                style={styles.blogPhoto}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePhoto(index)}
              >
                <MaterialIcons name="close" size={20} color="#fff" />
              </TouchableOpacity>
              <TextInput
                style={styles.captionInput}
                value={photosCaptions[index]}
                onChangeText={(text) => updateCaption(index, text)}
                placeholder="Add a caption (optional)"
                placeholderTextColor="#666"
              />
            </View>
          ))}

          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={() => pickImage(false)}
          >
            <MaterialIcons name="add-photo-alternate" size={32} color="#4CAF50" />
            <Text style={styles.addPhotoText}>Add More Photos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, !coverPhoto && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!coverPhoto || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.nextButtonText}>Next</Text>
              <MaterialIcons name="arrow-forward" size={24} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  coverPhotoContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  coverPhoto: {
    width: '100%',
    height: 200,
  },
  uploadButton: {
    height: 200,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  uploadText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4CAF50',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoContainer: {
    width: '31%',
    aspectRatio: 1,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  addPhotoButton: {
    width: '31%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  addPhotoText: {
    marginTop: 8,
    fontSize: 12,
    color: '#4CAF50',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 4,
  },
  changeButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
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
  nextButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  photoItem: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  blogPhoto: {
    width: '100%',
    height: 200,
  },
  captionInput: {
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default CreateBlogPhotosScreen; 