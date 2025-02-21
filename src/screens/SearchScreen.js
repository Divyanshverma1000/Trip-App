// src/screens/SearchScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SearchScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Search/Discover Screen</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18 },
});

export default SearchScreen;
