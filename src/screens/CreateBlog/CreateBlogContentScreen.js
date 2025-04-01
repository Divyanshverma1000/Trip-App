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
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const CreateBlogContentScreen = ({ navigation }) => {
  const [blogData, setBlogData] = useState({
    title: '',
    summary: '',
    description: '',
    recommendations: '',
    advisory: '',
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

  const renderInput = (field, label, placeholder, multiline = false) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputLabel}>
        <Ionicons name="information-circle-outline" size={20} color="#666" style={styles.labelIcon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          errors[field] && styles.errorInput,
        ]}
        value={blogData[field]}
        onChangeText={(text) => setBlogData(prev => ({ ...prev, [field]: text }))}
        placeholder={placeholder}
        placeholderTextColor="#999"
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
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
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Create Blog Post</Text>
            <Text style={styles.headerSubtitle}>Step 1: Basic Information</Text>
          </View>

          {renderInput('title', 'Title', 'Example: A Hidden Gem in the Himalayas')}
          {renderInput('summary', 'Summary', 'Briefly describe your experience. Example: A peaceful getaway with breathtaking mountain views.', true)}
          {renderInput(
            'description',
            'Description',
            'Share your detailed experience. Mention places visited, activities, food, local culture, and memorable moments.',
            true
          )}
          {renderInput(
            'recommendations',
            'Recommendations (Optional)',
            'Tips for future travelers: Best time to visit, must-see spots, and local cuisine suggestions.',
            true
          )}
          {renderInput(
            'advisory',
            'Travel Advisory (Optional)',
            'Share any important warnings: Weather issues, safety tips, or local regulations.',
            true
          )}
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
    backgroundColor: '#F2F2F2',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelIcon: {
    marginRight: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#333',
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#FFF',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
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
