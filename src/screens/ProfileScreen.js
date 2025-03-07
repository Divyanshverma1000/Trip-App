import React, { useEffect, useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { getProfile } from '../lib/user';
import { AuthContext } from '../navigation/AppNavigator';
import { useTrips } from '../hooks/useTrips';
import TripCard from '../components/TripCard';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const { myTrips, loading, error, fetchMyTrips } = useTrips();
  const [profile, setProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchMyTrips();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
    fetchMyTrips();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will be handled by AppNavigator based on isAuthenticated state
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderTripCard = ({ item }) => (
    <TripCard
      trip={item}
      onPress={() => navigation.navigate('TripDetailsScreen', { tripId: item._id })}
    />
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>Profile not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image 
            source={{ uri: user?.photo || 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF385C" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Friends ({profile.friends?.length || 0})
        </Text>
        <FlatList
          data={profile.friends}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.name}</Text>
            </View>
          )}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Trip History ({profile.tripHistory?.length || 0})
        </Text>
        <FlatList
          data={profile.tripHistory}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.title}</Text>
            </View>
          )}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Public Posts ({profile.publicPosts?.length || 0})
        </Text>
        <FlatList
          data={profile.publicPosts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.title}</Text>
            </View>
          )}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.tripsSection}>
        <Text style={styles.sectionTitle}>My Trips</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#FF385C" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : myTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="airplane-outline" size={48} color="#666" />
            <Text style={styles.emptyText}>No trips found</Text>
            <TouchableOpacity 
              style={styles.createTripButton}
              onPress={() => navigation.navigate('TripPlanner')}
            >
              <Text style={styles.createTripText}>Plan a Trip</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.tripsList}>
            {myTrips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onPress={() => navigation.navigate('TripDetailsScreen', { tripId: trip._id })}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: 10,
  },
  logoutText: {
    marginLeft: 8,
    color: '#FF385C',
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  item: {
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  tripsSection: {
    padding: 20,
  },
  tripsList: {
    gap: 15,
  },
  errorText: {
    color: '#FF385C',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  createTripButton: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  createTripText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProfileScreen;
