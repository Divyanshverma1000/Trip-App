// HomeScreen.jsx
import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
  StatusBar,
  Image,
  FlatList,
  Modal
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import TripCard from '../components/TripCard';
import BlogCard from '../components/BlogCard';
import { getOpenTrips } from '../lib/trips';
import { getBlogPosts, searchBlogs } from '../lib/blogs';
import { AuthContext } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { debounce } from 'lodash';

const { width, height } = Dimensions.get('window');
const BLOG_CARD_WIDTH = width * 0.85; // Horizontal scroll for blogs

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [openTrips, setOpenTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [regularBlogs, setRegularBlogs] = useState([]); // For non-search state
  const [error, setError] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const fetchData = async () => {
    try {
      const [blogsData, tripsData] = await Promise.all([
        getBlogPosts(),
        getOpenTrips()
      ]);
      setBlogs(blogsData);
      setOpenTrips(tripsData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchRegularBlogs = async () => {
    try {
      const blogs = await getBlogPosts();
      setRegularBlogs(blogs);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Searching for:', query);
      const results = await searchBlogs({ query: query.trim() });
      console.log('Search results:', results);
      setSearchResults(results);
      setIsSearchActive(true);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    if (text.length >= 3) {
      performSearch(text);
    } else {
      setSearchResults([]);
      setIsSearchActive(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchActive(false);
    setError(null);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const handleSearchPress = () => {
    // Implementation for search press
  };

  const handleAdvancedSearch = () => {
    navigation.navigate('Search');
  };

  useEffect(() => {
    fetchData();
    fetchRegularBlogs();
  }, []);

  const renderBlogCard = ({ item }) => (
    <BlogCard
      blog={item}
      onPress={() => {
        navigation.navigate('BlogDetailsScreen', { blogId: item._id });
        handleClearSearch();
      }}
      style={styles.blogCard}
    />
  );

  const renderSearchResults = () => {
    if (!isSearchActive) return null;

    return (
      <Modal
        visible={isSearchActive}
        transparent
        animationType="fade"
        onRequestClose={handleClearSearch}
      >
        <View style={styles.searchOverlay}>
          <View style={styles.searchResultsContainer}>
            <View style={styles.searchHeader}>
              <SearchBar
                placeholder="Search blogs..."
                value={searchQuery}
                onChangeText={handleSearchChange}
                onSubmitEditing={handleSearchSubmit}
                editable={true}
              />
              <TouchableOpacity
                onPress={handleClearSearch}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator style={styles.loader} size="large" color="#4CAF50" />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <FlatList
                data={searchResults}
                renderItem={renderBlogCard}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.searchResultsList}
                ListEmptyComponent={
                  <Text style={styles.noResults}>
                    {searchQuery.length < 3 
                      ? 'Type at least 3 characters to search' 
                      : 'No results found'}
                  </Text>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    );
  };

  const renderMainContent = () => (
    <FlatList
      data={regularBlogs}
      renderItem={renderBlogCard}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.mainContent}
      ListHeaderComponent={() => (
        <>
          {/* Add your trending sections, featured content, etc. here */}
          <Text style={styles.sectionTitle}>Recent Blogs</Text>
        </>
      )}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      
      {/* Fixed Header Section */}
      <View style={styles.fixedHeader}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hello, {user?.name?.split(' ')[0] || 'Traveler'}!</Text>
          <Text style={styles.subText}>Where to next?</Text>
        </View>

        {/* Search and Actions Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <SearchBar
              placeholder="Search destinations..."
              onPress={handleSearchPress}
              editable={true}
              value={searchQuery}
              onChangeText={handleSearchChange}
              onSubmitEditing={handleSearchSubmit}
              onFocus={() => setIsSearchActive(true)}
            />
          </View>
          
          {searchQuery && (
            <TouchableOpacity 
              style={styles.advancedSearchButton}
              onPress={handleAdvancedSearch}
            >
              <Text style={styles.advancedSearchText}>Advanced</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('TripBlogForm')}
          >
            <Feather name="edit" size={24} color="#333" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Notification')}
          >
            <Feather name="bell" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Trending Blogs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Blogs</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllBlogs')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.blogsContainer}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
            ) : (
              blogs.slice(0, 5).map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  style={styles.blogCard}
                  onPress={() => navigation.navigate('BlogDetailsScreen', { blogId: blog._id })}
                />
              ))
            )}
          </ScrollView>
        </View>

        {/* Open Trips Section */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Open Trips</Text>
            <TouchableOpacity onPress={() => navigation.navigate('OpenTrips')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tripsGrid}>
            {openTrips.slice(0, 6).map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                style={styles.tripCard}
                onPress={() => navigation.navigate('TripDetailsScreen', { tripId: trip._id })}
              />
            ))}
          </View>
        </View>

        {/* Search Results */}
        {/* {renderMainContent()} */}
      </ScrollView>
      {renderSearchResults()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fixedHeader: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 1,
  },
  welcomeSection: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  scrollContent: {
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },
  blogsContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  blogCard: {
    width: BLOG_CARD_WIDTH,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tripsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
  },
  tripCard: {
    width: (width - 48) / 2,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  lastSection: {
    paddingBottom: 24,
  },
  loader: {
    width: BLOG_CARD_WIDTH,
    height: 200,
    justifyContent: 'center',
  },
  searchHeader: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 1,
  },
  advancedSearchButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  advancedSearchText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 16,
  },
  noResults: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
  },
  searchOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  searchResultsContainer: {
    backgroundColor: '#fff',
    height: height,
    width: '100%',
  },
  searchResultsList: {
    padding: 16,
  },
  mainContent: {
    padding: 16,
  },
  closeButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default HomeScreen;