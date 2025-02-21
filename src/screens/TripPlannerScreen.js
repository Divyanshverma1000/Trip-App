// src/screens/TripPlannerScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const TripPlannerScreen = () => {
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [preference, setPreference] = useState('');

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 1: Enter Destination</Text>
            <TextInput
              placeholder="Enter destination"
              value={destination}
              onChangeText={setDestination}
              style={styles.input}
            />
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 2: Select Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
              <Text>{date.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 3: Preferences</Text>
            <TextInput
              placeholder="e.g., Adventure, Cultural"
              value={preference}
              onChangeText={setPreference}
              style={styles.input}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        <Text style={styles.previewTitle}>Preview Itinerary</Text>
        <Text>Destination: {destination}</Text>
        <Text>Date: {date.toDateString()}</Text>
        <Text>Preference: {preference}</Text>
      </View>
      <View style={styles.form}>
        {renderStep()}
        <View style={styles.buttonContainer}>
          {step > 0 && <Button title="Previous" onPress={prevStep} />}
          {step < 2 ? (
            <Button title="Next" onPress={nextStep} />
          ) : (
            <Button title="Generate Itinerary" onPress={() => alert('Itinerary Generated!')} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  preview: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  previewTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  form: { flex: 1 },
  stepContainer: { marginBottom: 20 },
  stepTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});

export default TripPlannerScreen;
