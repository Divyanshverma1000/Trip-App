import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { searchUsers as searchUsersApi } from '../lib/user';
import { inviteToTrip } from '../lib/trips';
import Toast from 'react-native-toast-message';
import { CommonActions } from '@react-navigation/native';

const InviteFriendsScreen = ({ navigation, route }) => {
  const { tripData } = route.params;
  console.log('Trip data:', tripData);
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

  const handleNext = async () => {
    console.log('Selected users:', selectedUsers);
    try {
      // Send invite requests to selected users using inviteToTrip function
      await Promise.all(selectedUsers.map(user => 
        inviteToTrip(tripData._id, user._id)
      ));
      console.log('Invites sent successfully');
  
    // Replace the form flow with TripDetailsScreen after submission
    navigation.dispatch(
      CommonActions.reset({
        index: 1, // Set the index for the second screen
        routes: [
          { 
            name: "Main",  //  bottom tab navigator
            state: {
              routes: [
                { name: "Profile" }  // Profile tab inside MainTabs{bottom Tab navigator }
              ]
            }
          },
          {
            name: "TripDetailsScreen",
            params: { tripId: tripData._id, refresh: true },
          }
        ],
      })
    );
    
    
    console.log("Navigated to trip details screen and cleared form flow");
  
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to send invites',
        text2: error.message
      });
      console.log('Failed to send invites', error);
    }
  };
  

  const renderUser = ({ item }) => {
    const isSelected = selectedUsers.find(u => u._id === item._id);
    
    return (
      <View style={styles.userItem}>
        <View style={styles.userInfoContainer}>
          <Image 
            source={{ uri: item.photo || 'https://picsum.photos/200/300' }}
            style={styles.profilePhoto}
          />
          <View style={styles.textContainer}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.inviteButton, isSelected && styles.selectedButton]}
          onPress={() => toggleUserSelection(item)}
        >
          <Text style={[styles.inviteButtonText, isSelected && styles.selectedButtonText]}>
            {isSelected ? 'Selected' : 'Invite'}
          </Text>
          {isSelected && (
            <Feather name="check" size={20} color="#FFF" style={styles.checkIcon} />
          )}
        </TouchableOpacity>
      </View>
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
          <Text style={styles.nextButtonText}>Invite Selected Friends</Text>
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
    fontFamily: 'Roboto',
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
    fontFamily: 'Roboto',
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
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Roboto',
  },
  inviteButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#2E7D32',
  },
  inviteButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  selectedButtonText: {
    marginRight: 4,
  },
  checkIcon: {
    marginLeft: 4,
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
    fontFamily: 'Roboto',
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
    fontFamily: 'Roboto',
  },
});

export default InviteFriendsScreen;