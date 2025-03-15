import React from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchBar = ({ 
  placeholder, 
  value, 
  onChangeText,
  editable = true,
}) => {
  return (
    <View style={styles.searchContainer}>
      <Feather name="search" size={20} color="#888" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        returnKeyType="search"
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#eee',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
    paddingVertical: 8,
  },
});

export default SearchBar;
