import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CreateBlogContentScreen = ({ navigation }) => {
  const [blogData, setBlogData] = useState({
    title: '',
    summary: '',
    description: '',
    recommendations: '',
    advisory: '',
    // concerns: {
    //   womenSafety: 0,
    //   affordability: 0,
    //   culturalExperience: 0,
    //   accessibility: 0,
    // },
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!blogData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!blogData.summary.trim()) {
      newErrors.summary = 'Summary is required';
    }
    if (!blogData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      navigation.navigate('CreateBlogTags', { blogData });
    }
  };

  const handleRating = (field, value) => {
    setBlogData(prev => ({
      ...prev,
      concerns: {
        ...prev.concerns,
        [field]: value,
      },
    }));
  };

  const renderInput = (field, label, placeholder, multiline = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          errors[field] && styles.errorInput,
        ]}
        value={blogData[field]}
        onChangeText={(text) => setBlogData(prev => ({ ...prev, [field]: text }))}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  const StarRating = ({ rating, onPress }) => {
    return (
      <View style={styles.starRatingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => onPress(star)}>
            <MaterialIcons
              name={star <= rating ? 'star' : 'star-border'}
              size={32}
              color="#FFD700"
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderRatingInput = (field, label) => (
    <View style={styles.ratingInputContainer}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <StarRating
        rating={blogData.concerns[field]}
        onPress={(value) => handleRating(field, value)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent} // Added content container style
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Blog Post</Text>
            <Text style={styles.headerSubtitle}>Step 1: Basic Information</Text>
          </View>

          {renderInput('title', 'Title', 'Enter your blog title')}
          {renderInput('summary', 'Summary', 'Brief summary of your blog', true)}
          {renderInput('description', 'Description', 'Detailed description of your experience', true)}
          {renderInput('recommendations', 'Recommendations (Optional)', 'Any recommendations for future travelers', true)}
          {renderInput('advisory', 'Travel Advisory (Optional)', 'Important information or warnings', true)}

          <View style={styles.sectionDivider} />

          {/* <Text style={styles.sectionTitle}>Rate Your Concerns</Text>
          {renderRatingInput('womenSafety', 'Women Safety')}
          {renderRatingInput('affordability', 'Affordability')}
          {renderRatingInput('culturalExperience', 'Cultural Experience')}
          {renderRatingInput('accessibility', 'Accessibility')} */}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
            <MaterialIcons name="arrow-forward" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  // Add contentContainerStyle to ensure scrolling content is padded at the bottom
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Extra bottom padding to avoid content being hidden
  },
  header: {
    marginBottom: 24,
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
  },
  sectionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  ratingInputContainer: {
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  starRatingContainer: {
    flexDirection: 'row',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default CreateBlogContentScreen;
