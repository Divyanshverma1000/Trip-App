import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { searchUsers as searchUsersApi } from '../lib/user';
import Toast from 'react-native-toast-message';

const InviteFriendsScreen = ({ navigation, route }) => {
  const { tripData } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      handleSearchUsers(searchQuery);
    }
  }, [searchQuery]);

  const handleSearchUsers = async (query) => {
    setLoading(true);
    try {
      const results = await searchUsersApi(query);
      setSearchResults(results);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error searching users',
        text2: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (user) => {
    if (selectedUsers.find(u => u._id === user._id)) {
      setSelectedUsers(prev => prev.filter(u => u._id !== user._id));
    } else {
      setSelectedUsers(prev => [...prev, user]);
    }
  };

  const handleNext = () => {
    const updatedTripData = {
      ...tripData,
      members: selectedUsers.map(user => ({
        user: user._id,
        role: 'member',
        status: 'pending'
      })),
      isPublic: false
    };
    navigation.navigate('TripItineraryForm', { tripData: updatedTripData });
  };

  const renderUser = ({ item }) => {
    const isSelected = selectedUsers.find(u => u._id === item._id);
    
    return (
      <TouchableOpacity
        style={[styles.userItem, isSelected && styles.selectedUser]}
        onPress={() => toggleUserSelection(item)}
      >
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        {isSelected && (
          <Feather name="check" size={20} color="#4CAF50" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite Friends</Text>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search users by name or email"
        />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color="#4CAF50" />
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderUser}
          keyExtractor={item => item._id}
          style={styles.list}
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.selectedCount}>
          Selected: {selectedUsers.length} users
        </Text>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next: Plan Itinerary</Text>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  list: {
    flex: 1,
  },
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedUser: {
    backgroundColor: '#E8F5E9',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  selectedCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default InviteFriendsScreen; 