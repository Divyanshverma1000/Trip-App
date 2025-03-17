import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';

const TAGS = [
  { id: '1', name: 'SummerTrip', icon: 'sun' },
  { id: '2', name: 'SafeForWomen', icon: 'shield' },
  { id: '3', name: 'BudgetTravel', icon: 'dollar-sign' },
  { id: '4', name: 'Adventure', icon: 'compass' },
  { id: '5', name: 'CulturalExperience', icon: 'globe' },
  { id: '6', name: 'FamilyFriendly', icon: 'users' },
  { id: '7', name: 'SoloTravel', icon: 'user' },
  { id: '8', name: 'CityBreak', icon: 'home' },
  { id: '9', name: 'NatureEscape', icon: 'map-pin' },
  { id: '10', name: 'BeachVacation', icon: 'umbrella' },
  { id: '11', name: 'HistoricalSites', icon: 'book' },
  { id: '12', name: 'FoodieJourney', icon: 'coffee' },
  { id: '13', name: 'LuxuryTravel', icon: 'star' },
  { id: '14', name: 'RoadTrip', icon: 'map' },
  { id: '15', name: 'EcoTourism', icon: 'droplet' },
  { id: '16', name: 'Nightlife', icon: 'moon' },
  { id: '17', name: 'OffTheBeatenPath', icon: 'compass' },
  { id: '18', name: 'WinterGetaway', icon: 'cloud-snow' },
  { id: '19', name: 'Backpacking', icon: 'briefcase' },
  { id: '20', name: 'WellnessRetreat', icon: 'heart' },
];

const CreateBlogTagsScreen = ({ route, navigation }) => {
  const { blogData } = route.params;
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagPress = (tagName) => {
    setSelectedTags(prev => {
      if (prev.includes(tagName)) {
        return prev.filter(tag => tag !== tagName);
      }
      return [...prev, tagName];
    });
  };

  const handleNext = () => {
    if (selectedTags.length > 0) {
      navigation.navigate('CreateBlogPhotos', {
        blogData: { ...blogData, tags: selectedTags }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Tags</Text>
        <Text style={styles.headerSubtitle}>Step 2: Choose relevant tags for your blog</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.tagsContainer}>
          {TAGS.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.tagButton,
                selectedTags.includes(tag.name) && styles.tagButtonSelected
              ]}
              onPress={() => handleTagPress(tag.name)}
            >
              <Feather
                name={tag.icon}
                size={20}
                color={selectedTags.includes(tag.name) ? '#FFF' : '#666'}
              />
              <Text
                style={[
                  styles.tagText,
                  selectedTags.includes(tag.name) && styles.tagTextSelected
                ]}
              >
                {tag.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedTags.length === 0 && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={selectedTags.length === 0}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#FFF" />
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
  scrollView: {
    flex: 1,
  },
  tagsContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  tagButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
  tagTextSelected: {
    color: '#FFF',
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
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreateBlogTagsScreen; 