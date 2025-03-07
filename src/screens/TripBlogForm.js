// src/screens/TripDetailsScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

const TripBlogForm = ({ navigation }) => {
  const [tripDetails, setTripDetails] = useState({
    title: '',
    description: '',
    metadata: {
      destination: '',
      cost: 0,
      duration: 0
    },
    estimatedBudget: 0,
    tags: [],
    packingEssentials: [],
    isPublic: true,
    status: 'planning'
  });

  const [packingItem, setPackingItem] = useState('');
  const [tag, setTag] = useState('');

  const addPackingItem = () => {
    if (packingItem.trim()) {
      setTripDetails(prev => ({
        ...prev,
        packingEssentials: [...prev.packingEssentials, packingItem.trim()]
      }));
      setPackingItem('');
    }
  };

  const addTag = () => {
    if (tag.trim()) {
      setTripDetails(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
      setTag('');
    }
  };

  const removePackingItem = (index) => {
    setTripDetails(prev => ({
      ...prev,
      packingEssentials: prev.packingEssentials.filter((_, i) => i !== index)
    }));
  };

  const removeTag = (index) => {
    setTripDetails(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (!tripDetails.title || !tripDetails.metadata.destination) {
      Toast.show({
        type: 'error',
        text1: 'Title and destination are required'
      });
      return;
    }
    navigation.navigate('TripItinerary', { tripDetails });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Basic Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Trip Title *"
        value={tripDetails.title}
        onChangeText={(text) => setTripDetails(prev => ({
          ...prev,
          title: text
        }))}
      />

      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Trip Description"
        value={tripDetails.description}
        onChangeText={(text) => setTripDetails(prev => ({
          ...prev,
          description: text
        }))}
        multiline
      />

      <Text style={styles.sectionTitle}>Trip Metadata</Text>
      <TextInput
        style={styles.input}
        placeholder="Destination *"
        value={tripDetails.metadata.destination}
        onChangeText={(text) => setTripDetails(prev => ({
          ...prev,
          metadata: { ...prev.metadata, destination: text }
        }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Estimated Cost"
        value={tripDetails.metadata.cost.toString()}
        onChangeText={(text) => setTripDetails(prev => ({
          ...prev,
          metadata: { ...prev.metadata, cost: parseFloat(text) || 0 }
        }))}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Duration (days)"
        value={tripDetails.metadata.duration.toString()}
        onChangeText={(text) => setTripDetails(prev => ({
          ...prev,
          metadata: { ...prev.metadata, duration: parseInt(text) || 0 }
        }))}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Packing Essentials</Text>
      <View style={styles.addItemContainer}>
        <TextInput
          style={[styles.input, styles.flex1]}
          placeholder="Add packing item"
          value={packingItem}
          onChangeText={setPackingItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={addPackingItem}>
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.chipContainer}>
        {tripDetails.packingEssentials.map((item, index) => (
          <View key={index} style={styles.chip}>
            <Text>{item}</Text>
            <TouchableOpacity onPress={() => removePackingItem(index)}>
              <MaterialIcons name="close" size={18} color="gray" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Tags</Text>
      <View style={styles.addItemContainer}>
        <TextInput
          style={[styles.input, styles.flex1]}
          placeholder="Add tag"
          value={tag}
          onChangeText={setTag}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTag}>
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.chipContainer}>
        {tripDetails.tags.map((tag, index) => (
          <View key={index} style={styles.chip}>
            <Text>{tag}</Text>
            <TouchableOpacity onPress={() => removeTag(index)}>
              <MaterialIcons name="close" size={18} color="gray" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Button title="Next: Add Itinerary" onPress={handleNext} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  flex1: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 16,
    margin: 4,
  },
});

export default TripBlogForm;
