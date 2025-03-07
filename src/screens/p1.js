import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  Dimensions, 
  StatusBar,
  Animated,
  Platform 
} from 'react-native';
import { AuthContext } from '../navigation/AppNavigator';
import { logout } from '../lib/auth';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import Reanimated, { 
  FadeIn, 
  FadeInDown, 
  Layout 
} from 'react-native-reanimated';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

const ShimmerPlaceholder = createShimmerPlaceholder(Reanimated);
const { width } = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const ProfileScreen = ({ navigation }) => {
  const { setIsAuthenticated, userData } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    // ... keep existing code (logout logic)
  };

  const handleCreatePost = () => {
    navigation.navigate('CreatePost');
  };

  const renderTripCard = ({ item, index }) => (
    <Reanimated.View
      entering={FadeInDown.delay(index * 100)}
      layout={Layout.springify()}
    >
      <TouchableOpacity 
        style={styles.tripCard}
        onPress={() => navigation.navigate('TripDetails', { tripId: item._id })}
      >
        <Image 
          source={{ uri: item.coverPhoto || 'https://via.placeholder.com/100' }} 
          style={styles.tripImage} 
        />
        <View style={styles.tripInfo}>
          <Text style={styles.tripTitle}>{item.title || 'Untitled Trip'}</Text>
          <Text style={styles.tripDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <View style={styles.tripMeta}>
            <Feather name="heart" size={16} color="#666" />
            <Text style={styles.tripMetaText}>{item.likes || 0}</Text>
            <Feather name="message-circle" size={16} color="#666" style={{ marginLeft: 10 }} />
            <Text style={styles.tripMetaText}>{item.comments?.length || 0}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Reanimated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with Settings and Create Post */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.createPostButton}
            onPress={handleCreatePost}
          >
            <Feather name="plus-circle" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton}>
            <Feather name="settings" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Section with Animated Entry */}
      <Reanimated.View 
        style={styles.profileSection}
        entering={FadeIn.duration(500)}
      >
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: userData?.photo || 'https://via.placeholder.com/120' }} 
            style={styles.profileImage} 
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Feather name="edit-2" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{userData?.name || 'Loading...'}</Text>
        <Text style={styles.email}>{userData?.email}</Text>
        <Text style={styles.bio}>Travel enthusiast | Adventure seeker</Text>
      </Reanimated.View>

      {/* Stats Section */}
      <Reanimated.View 
        style={styles.statsContainer}
        entering={FadeInDown.delay(200)}
      >
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData?.tripHistory?.length || 0}</Text>
          <Text style={styles.statLabel}>Trips</Text>
        </View>
        <View style={[styles.statItem, styles.statBorder]}>
          <Text style={styles.statNumber}>{userData?.publicPosts?.length || 0}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData?.friends?.length || 0}</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>
      </Reanimated.View>

      {/* Create Post Button */}
      <TouchableOpacity 
        style={styles.floatingCreateButton}
        onPress={handleCreatePost}
      >
        <MaterialIcons name="add-photo-alternate" size={24} color="#fff" />
        <Text style={styles.createButtonText}>Create Post</Text>
      </TouchableOpacity>

      {/* Trips Section */}
      <View style={styles.tripsSection}>
        <Text style={styles.sectionTitle}>Your Posts</Text>
        <AnimatedFlatList
          data={userData?.publicPosts || []}
          renderItem={renderTripCard}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tripsList}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            // Add refresh logic here
            setTimeout(() => setRefreshing(false), 1000);
          }}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Feather name="camera-off" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No posts yet</Text>
              <TouchableOpacity 
                style={styles.createFirstPostButton}
                onPress={handleCreatePost}
              >
                <Text style={styles.createFirstPostText}>Create your first post</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createPostButton: {
    marginRight: 15,
  },
  settingsButton: {
    padding: 8,
  },
  // ... keep existing code (profileSection styles)
  floatingCreateButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 999,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tripsList: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  createFirstPostButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createFirstPostText: {
    color: '#fff',
    fontSize: 16,
  },
  // ... keep existing code (other styles)
});

export default ProfileScreen;
