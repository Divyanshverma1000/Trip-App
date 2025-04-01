import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const TAGS = [
  { id: '1', name: 'RoadTrip', icon: 'directions-car', iconLibrary: 'MaterialIcons' },
  { id: '2', name: 'Trekking', icon: 'hiking', iconLibrary: 'MaterialCommunityIcons' },
  { id: '3', name: 'Rafting', icon: 'kayaking', iconLibrary: 'MaterialCommunityIcons' },
  { id: '4', name: 'Paragliding', icon: 'paragliding', iconLibrary: 'MaterialCommunityIcons' },
  { id: '5', name: 'RiverCruise', icon: 'ferry', iconLibrary: 'MaterialCommunityIcons' },
  { id: '6', name: 'ForestCamping', icon: 'campfire', iconLibrary: 'MaterialCommunityIcons' },
  { id: '7', name: 'ShoppingSpree', icon: 'shopping-cart', iconLibrary: 'MaterialIcons' },
  { id: '8', name: 'BeachTrip', icon: 'umbrella-beach', iconLibrary: 'MaterialCommunityIcons' },
  { id: '9', name: 'PartyNight', icon: 'record-player', iconLibrary: 'MaterialCommunityIcons' },
  { id: '10', name: 'FoodTrail', icon: 'silverware-fork-knife', iconLibrary: 'MaterialCommunityIcons' },
  { id: '11', name: 'HeritageWalk', icon: 'city-variant', iconLibrary: 'MaterialCommunityIcons' },
  { id: '12', name: 'CityTour', icon: 'location-city', iconLibrary: 'MaterialIcons' },
  { id: '13', name: 'WaterfallVisit', icon: 'waterfall', iconLibrary: 'MaterialCommunityIcons' },
  { id: '14', name: 'AdventureSports', icon: 'run-fast', iconLibrary: 'MaterialCommunityIcons' },
  { id: '15', name: 'Backpacking', icon: 'bag-personal', iconLibrary: 'MaterialCommunityIcons' },
  { id: '16', name: 'Camping', icon: 'tent', iconLibrary: 'MaterialCommunityIcons' },
  { id: '17', name: 'NatureTrail', icon: 'tree', iconLibrary: 'MaterialCommunityIcons' },
  { id: '18', name: 'StudyBreak', icon: 'school', iconLibrary: 'MaterialIcons' },
  { id: '19', name: 'ReligiousTrip', icon: 'temple-hindu', iconLibrary: 'MaterialIcons' },
  { id: '20', name: 'WildlifeSafari', icon: 'paw', iconLibrary: 'MaterialCommunityIcons' },
  { id: '21', name: 'WeekendTrip', icon: 'calendar-weekend', iconLibrary: 'MaterialCommunityIcons' },
];

// Helper function to render icon based on iconLibrary
const renderIcon = (tag, color) => {
  if (tag.iconLibrary === 'MaterialIcons') {
    return <MaterialIcons name={tag.icon} size={20} color={color} />;
  } else if (tag.iconLibrary === 'MaterialCommunityIcons') {
    return <MaterialCommunityIcons name={tag.icon} size={20} color={color} />;
  } else if (tag.iconLibrary === 'Feather') {
    return <Feather name={tag.icon} size={20} color={color} />;
  }
  return null;
};

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
              {renderIcon(tag, selectedTags.includes(tag.name) ? '#FFF' : '#666')}
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
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    margin: 6,
  },
  tagButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  tagText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  tagTextSelected: {
    color: '#FFF',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'space-between',
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
    marginLeft: 12,
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default CreateBlogTagsScreen;
