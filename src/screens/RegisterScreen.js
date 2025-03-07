import React from 'react';
import { View, Text, ImageBackground, StatusBar } from 'react-native';
import RegistrationForm from '../components/forms/RegistrationForm';
import styles from '../styles';

const RegistrationScreen = ({ navigation }) => {
  return (
    <ImageBackground
    source={{
      uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
    }}
    style={styles.background}
  >
    <StatusBar barStyle="light-content" />
    <View style={styles.overlay}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.title}>Wander</Text>
        <Text style={styles.subtitle}>Your Campus Travel Companion</Text>
      </View>
      
      <RegistrationForm navigation={navigation} />
    </View>
  </ImageBackground>
  );
};

export default RegistrationScreen;
