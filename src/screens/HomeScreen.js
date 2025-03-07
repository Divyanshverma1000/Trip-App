// HomeScreen.jsx
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  FadeIn,
  SlideInDown,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withSpring
} from 'react-native-reanimated';
import SearchBar from '../components/SearchBar';
import BlogCard from '../components/BlogCard';
import TripCard from '../components/TripCard';
import { getOpenTrips } from '../lib/trips';
import { getBlogPosts, searchBlogs } from '../lib/blogs';
import { getProfile } from '../lib/user';
import { NotificationContext } from '../context/NotificationContext';

const { width } = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [openTrips, setOpenTrips] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [user, setUser] = useState(null);

  const navigation = useNavigation();
  const { unreadCount } = useContext(NotificationContext);

  // Animation values
  const scrollY = useSharedValue(0);
  const headerHeight = useSharedValue(150);
  const fabAnimation = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Header animation
  const headerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 100],
      [150, 100],
      'clamp'
    );

    return {
      height,
      opacity: interpolate(scrollY.value, [0, 100], [1, 0.9]),
    };
  });

  // FAB animation
  const fabStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(scrollY.value > 100 ? 1 : 0.8),
        },
        {
          translateY: withSpring(scrollY.value > 100 ? 0 : 20),
        },
      ],
      opacity: withSpring(scrollY.value > 100 ? 1 : 0.8),
    };
  });

  useEffect(() => {
    fetchUserProfile();
    fetchTrendingBlogs();
    fetchOpenTrips();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      fetchSearchResults();
    }
  }, [searchQuery]);

  const fetchUserProfile = async () => {
    try {
      const userProfile = await getProfile();
      setUser(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchTrendingBlogs = async () => {
    setLoadingTrending(true);
    try {
      const blogs = await getBlogPosts();
      const sortedBlogs = blogs.sort((a, b) => {
        const aAvg = a.ratings.reduce((acc, r) => acc + r.value, 0) / a.ratings.length;
        const bAvg = b.ratings.reduce((acc, r) => acc + r.value, 0) / b.ratings.length;
        return bAvg - aAvg;
      });
      setTrendingBlogs(sortedBlogs);
    } catch (error) {
      console.error('Error fetching trending blogs', error);
    } finally {
      setLoadingTrending(false);
    }
  };

  const fetchOpenTrips = async () => {
    setLoadingOpen(true);
    try {
      const response = await getOpenTrips();
      const filteredTrips = response.filter(
        (trip) => trip.isPublic && (trip.status === 'planning' || trip.status === 'ongoing')
      );
      const formattedTrips = filteredTrips.map((trip) => ({
        _id: trip._id,
        title: trip.title,
        description: trip.description,
        coverPhoto: trip.coverPhoto,
        photos: trip.photos || [],
        metadata: trip.metadata,
        status: trip.status,
        host: trip.host,
        members: trip.members || [],
        estimatedBudget: trip.estimatedBudget,
        actualBudget: trip.actualBudget,
        itinerary: trip.itinerary,
        packingEssentials: trip.packingEssentials,
        tags: trip.tags
      }));
      setOpenTrips(formattedTrips);
    } catch (error) {
      console.error('Error fetching open trips:', error);
    } finally {
      setLoadingOpen(false);
    }
  };

  const fetchSearchResults = async () => {
    setLoadingSearch(true);
    try {
      const results = await searchBlogs(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching search results', error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleBlogPress = (blogId) => {
    navigation.navigate('BlogDetailsScreen', { blogId });
  };

  const handleTripPress = (tripId) => {
    navigation.navigate('TripDetailsScreen', { tripId });
  };

  const renderBlogCard = ({ item, index }) => (
    <Animated.View
      entering={FadeInRight.delay(index * 200).springify()}
    >
      <BlogCard blog={item} onPress={() => handleBlogPress(item._id)} />
    </Animated.View>
  );

  const renderTripCard = ({ item, index }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 200).springify()}
    >
      <TripCard
        trip={item}
        onPress={() => handleTripPress(item._id)}
      />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.headerContainer, headerStyle]}>
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          style={styles.greetingContainer}
        >
          <Text style={styles.greeting}>Hello, {user?.name || 'Guest'}</Text>
          <Text style={styles.subGreeting}>Where to next?</Text>
        </Animated.View>
        <View style={styles.headerActions}>
          {/* Blog Post Creation Button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('TripBlogForm')}
          >
            <Feather name="edit-3" size={20} color="#4CAF50" />
            <Text style={styles.createButtonText}>New Blog</Text>
          </TouchableOpacity>

          {/* Existing Notification Button */}
          <TouchableOpacity
            style={styles.notificationContainer}
            onPress={() => navigation.navigate('Notification')}
          >
            <Ionicons name="notifications-outline" size={28} color="#FFF" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Animated Search Bar */}
      <Animated.View 
        entering={SlideInDown.delay(400).springify()}
        style={styles.searchContainer}
      >
        <SearchBar
          placeholder="Search amazing experiences..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={<Ionicons name="search" size={20} color="#666" />}
        />
      </Animated.View>

      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {searchQuery.trim() === '' ? (
          <>
            {/* Trending Blogs Section */}
            <Animated.View 
              entering={FadeInDown.delay(500).springify()}
              style={styles.section}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.titleContainer}>
                  <MaterialIcons name="trending-up" size={24} color="#4CAF50" />
                  <Text style={styles.sectionTitle}>Trending Blogs</Text>
                </View>
                <TouchableOpacity style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>View All</Text>
                  <MaterialIcons name="arrow-forward-ios" size={14} color="#4CAF50" />
                </TouchableOpacity>
              </View>
              {loadingTrending ? (
                <ActivityIndicator size="large" color="#4CAF50" />
              ) : (
                <FlatList
                  data={trendingBlogs.slice(0, 5)}
                  keyExtractor={(item) => item._id.toString()}
                  renderItem={renderBlogCard}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </Animated.View>

            {/* Open Trips Section */}
            <Animated.View 
              entering={FadeInDown.delay(700).springify()}
              style={styles.section}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.titleContainer}>
                  <Ionicons name="map-outline" size={24} color="#4CAF50" />
                  <Text style={styles.sectionTitle}>Open Trips</Text>
                </View>
                <TouchableOpacity
                  style={styles.seeAllButton}
                  onPress={() => navigation.navigate('AllTripsScreen')}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                  <MaterialIcons name="arrow-forward-ios" size={14} color="#4CAF50" />
                </TouchableOpacity>
              </View>
              {loadingOpen ? (
                <ActivityIndicator size="large" color="#4CAF50" />
              ) : (
                <FlatList
                  data={openTrips}
                  keyExtractor={(item) => item._id.toString()}
                  renderItem={renderTripCard}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalListContainer}
                />
              )}
            </Animated.View>
          </>
        ) : (
          <Animated.View 
            entering={FadeInDown}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Search Results</Text>
            {loadingSearch ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderBlogCard}
                showsVerticalScrollIndicator={false}
              />
            )}
          </Animated.View>
        )}
      </Animated.ScrollView>

      {/* Animated FAB */}
      <AnimatedTouchableOpacity
        style={[styles.fab, fabStyle]}
        onPress={() => navigation.navigate('OnGoingTripsScreen')}
      >
        <Ionicons name="airplane" size={24} color="#FFF" />
        <Text style={styles.fabText}>Current Trips</Text>
      </AnimatedTouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF' // Light background
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  greetingContainer: {
    flex: 1
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333'
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 4
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  createButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  notificationContainer: {
    backgroundColor: '#4CAF50', // Updated accent color
    padding: 10,
    borderRadius: 30
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFF'
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFF'
  },
  section: {
    marginBottom: 30
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  seeAllText: {
    color: '#4CAF50', // Updated accent color
    fontSize: 16,
    fontWeight: '500',
    marginRight: 5
  },
  horizontalListContainer: {
    paddingVertical: 10
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#FF5252',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HomeScreen;