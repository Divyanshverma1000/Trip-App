// src/screens/SearchScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import { searchUsers } from '../lib/user';
import debounce from 'lodash/debounce';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        setUsers([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const results = await searchUsers(query);
        setUsers(results);
      } catch (err) {
        setError('Failed to search users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const renderUserCard = ({ item }) => (
    <TouchableOpacity style={styles.userCard}>
      <Image
        source={{ uri: item.photo || 'https://via.placeholder.com/50' }}
        style={styles.userPhoto}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Fixed Search Header */}
      <View style={styles.searchHeader}>
        <Text style={styles.headerTitle}>Search Users</Text>
        <View style={styles.searchBarWrapper}>
          <SearchBar
            placeholder="Search by name or email..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              performSearch(text);
            }}
            editable={true}
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : users.length > 0 ? (
          <FlatList
            data={users}
            renderItem={renderUserCard}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.centerContent}>
            <Feather name="users" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>
              {searchQuery.length > 0
                ? 'No users found'
                : 'Search for users by name or email'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchHeader: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 1,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
  },
  searchBarWrapper: {
    marginBottom: 8,
    height: 44, // Fixed height for search bar
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 32,
  },
});

export default SearchScreen;
