import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createTrip } from '../lib/trips';
import Toast from 'react-native-toast-message';

const CreateTripScreen = ({ navigation }) => {
  const [tripData, setTripData] = useState({
    title: '',
    description: '',
    metadata: {
      destination: '',
      duration: '',
      cost: ''
    },
    estimatedBudget: '',
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState('');

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

  const handleNext = () => {
    // Validate required fields
    if (!tripData.title || !tripData.description || !tripData.metadata.destination) {
      Toast.show({
        type: 'error',
        text1: 'Required Fields Missing',
        text2: 'Please fill in all required fields'
      });
      return;
    }

    // Navigate to invite friends screen with trip data
    navigation.navigate('InviteFriends', { tripData });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Trip</Text>
      </View>

      <View style={styles.form}>
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

        <Text style={styles.label}>Estimated Budget</Text>
        <TextInput
          style={styles.input}
          value={tripData.estimatedBudget}
          onChangeText={(text) => setTripData(prev => ({ ...prev, estimatedBudget: text }))}
          placeholder="Enter estimated budget"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Tags</Text>
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

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.nextButtonText}>Next: Invite Friends</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
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
});

export default CreateTripScreen; 