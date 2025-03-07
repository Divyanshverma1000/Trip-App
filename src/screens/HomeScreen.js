// HomeScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import NotificationsIcon from '../components/NotificationsIcon';
import BlogCard from '../components/BlogCard';
import TripCard from '../components/TripCard';
import { getOpenTrips } from '../lib/trips';
import { getBlogPosts, searchBlogs } from '../lib/blogs';
import globalStyles from '../styles';
import homeStyles from '../styles/HomeStyles';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [openTrips, setOpenTrips] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [user, setUser] = useState({name: 'John'}); // Replace with actual user data

  const navigation = useNavigation();

  useEffect(() => {
    fetchTrendingBlogs();
    fetchOpenTrips();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      fetchSearchResults();
    }
  }, [searchQuery]);

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
      console.log('Open trips response:', response); // Debug log

      // Filter trips that are public and either in planning or ongoing status
      const filteredTrips = response.filter(trip => 
        trip.isPublic && (trip.status === 'planning' || trip.status === 'ongoing')
      );

      console.log('Filtered trips:', filteredTrips); // Debug log

      // Map the filtered trips to the required format
      const formattedTrips = filteredTrips.map(trip => ({
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

      console.log('Formatted trips:', formattedTrips); // Debug log
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

  const renderBlogCard = ({ item }) => (
    <BlogCard blog={item} onPress={() => handleBlogPress(item._id)} />
  );

  const renderTripCard = ({ item }) => (
    <TripCard 
      trip={item}  // Simplified - pass the entire item since it's already formatted
      onPress={() => handleTripPress(item._id)} 
    />
  );

  return (
    <View style={[globalStyles.background, homeStyles.container]}>
      {/* Top Header */}
      <View style={homeStyles.topHeader}>
        <View style={homeStyles.userGreeting}>
          <Text style={homeStyles.greeting}>Hello, {user.name}</Text>
          <Text style={homeStyles.subGreeting}>where to next?</Text>
        </View>
        <TouchableOpacity 
          style={homeStyles.notificationContainer}
          onPress={() => navigation.navigate('NotificationsScreen')}
        >
          <Ionicons name="notifications-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search Section */}
      <View style={homeStyles.searchContainer}>
        <SearchBar
          placeholder="Search amazing experiences..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          icon={<Ionicons name="search" size={20} color="#666" />}
        />
      </View>

      <ScrollView style={homeStyles.content} showsVerticalScrollIndicator={false}>
        {searchQuery.trim() === '' ? (
          <>
            {/* Trending Blogs Section */}
            <View style={homeStyles.trendingSection}>
              <View style={homeStyles.sectionHeader}>
                <View style={homeStyles.titleContainer}>
                  <MaterialIcons name="trending-up" size={24} color="#FF385C" />
                  <Text style={homeStyles.sectionTitle}>Trending Blogs</Text>
                </View>
                <TouchableOpacity style={homeStyles.seeAllButton}>
                  <Text style={homeStyles.seeAllText}>View All</Text>
                  <MaterialIcons name="arrow-forward-ios" size={14} color="#FF385C" />
                </TouchableOpacity>
              </View>
              {loadingTrending ? (
                <ActivityIndicator size="large" color="#FF385C" />
              ) : (
                <FlatList
                  data={trendingBlogs.slice(0, 5)}
                  keyExtractor={(item) => item._id.toString()}
                  renderItem={renderBlogCard}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>

            {/* Open Trips Section */}
            <View style={homeStyles.openTripsSection}>
              <View style={homeStyles.sectionHeader}>
                <View style={homeStyles.titleContainer}>
                  <Ionicons name="map-outline" size={24} color="#FF385C" />
                  <Text style={homeStyles.sectionTitle}>Open Trips</Text>
                </View>
                <TouchableOpacity 
                  style={homeStyles.seeAllButton}
                  onPress={() => navigation.navigate('AllTripsScreen')}
                >
                  <Text style={homeStyles.seeAllText}>See All</Text>
                  <MaterialIcons name="arrow-forward-ios" size={14} color="#FF385C" />
                </TouchableOpacity>
              </View>
              {loadingOpen ? (
                <ActivityIndicator size="large" color="#FF385C" />
              ) : (
                <FlatList
                  data={openTrips}
                  keyExtractor={(item) => item._id.toString()}
                  renderItem={renderTripCard}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={homeStyles.horizontalListContainer}
                />
              )}
            </View>
          </>
        ) : (
          <View style={homeStyles.searchResultsSection}>
            <Text style={homeStyles.sectionTitle}>Search Results</Text>
            {loadingSearch ? (
              <ActivityIndicator size="large" color="#FF385C" />
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderBlogCard}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={homeStyles.fab}
        onPress={() => navigation.navigate('OnGoingTripsScreen')}
      >
        <Ionicons name="airplane" size={24} color="#FFF" />
        <Text style={homeStyles.fabText}>Current Trips</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
