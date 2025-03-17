import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
  RefreshControl
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getBlogPosts, searchBlogs } from "../lib/blogs";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import SearchBar from '../components/SearchBar';
import BlogCard from '../components/BlogCard';

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;

const TAGS = [
  { id: '1', name: 'SummerTrip', icon: 'sun' },
  { id: '2', name: 'SafeForWomen', icon: 'shield' },
  { id: '3', name: 'BudgetTravel', icon: 'dollar-sign' },
  { id: '4', name: 'Adventure', icon: 'compass' },
  { id: '5', name: 'CulturalExperience', icon: 'globe' },
  { id: '6', name: 'FamilyFriendly', icon: 'users' },
  { id: '7', name: 'SoloTravel', icon: 'user' },
  { id: '8', name: 'CityBreak', icon: 'home' },
  { id: '9', name: 'NatureEscape', icon: 'map-pin' },
  { id: '10', name: 'BeachVacation', icon: 'umbrella' },
  { id: '11', name: 'HistoricalSites', icon: 'book' },
  { id: '12', name: 'FoodieJourney', icon: 'coffee' },
  { id: '13', name: 'LuxuryTravel', icon: 'star' },
  { id: '14', name: 'RoadTrip', icon: 'map' },
  { id: '15', name: 'EcoTourism', icon: 'droplet' },
  { id: '16', name: 'Nightlife', icon: 'moon' },
  { id: '17', name: 'OffTheBeatenPath', icon: 'compass' },
  { id: '18', name: 'WinterGetaway', icon: 'cloud-snow' },
  { id: '19', name: 'Backpacking', icon: 'briefcase' },
  { id: '20', name: 'WellnessRetreat', icon: 'heart' },
];

// Helper to format the date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays < 7) {
    const daysRounded = Math.floor(diffDays);
    return daysRounded <= 0
      ? "Today"
      : `${daysRounded} day${daysRounded > 1 ? "s" : ""} ago`;
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const FeedScreen = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (!searchQuery && selectedTags.length === 0) {
        await fetchBlogs();
      } else {
        await handleSearch();
      }
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getBlogPosts();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTagPress = (tagName) => {
    setSelectedTags(prev => {
      if (prev.includes(tagName)) {
        return prev.filter(tag => tag !== tagName);
      }
      return [...prev, tagName];
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchParams = {
        query: searchQuery,
        tags: selectedTags
      };
      
      const searchResults = await searchBlogs(searchParams);
      setBlogs(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery && selectedTags.length === 0) {
      fetchBlogs();
    } else {
      handleSearch();
    }
  }, [selectedTags]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const renderBlogCard = ({ item }) => (
    <BlogCard
      blog={item}
      style={styles.card}
      onPress={() => navigation.navigate("BlogDetailsScreen", { blogId: item._id })}
    />
  );

  const renderTagItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.tagButton,
        selectedTags.includes(item.name) && styles.tagButtonSelected
      ]}
      onPress={() => handleTagPress(item.name)}
    >
      <Feather 
        name={item.icon} 
        size={16} 
        color={selectedTags.includes(item.name) ? '#FFF' : '#666'} 
      />
      <Text 
        style={[
          styles.tagText,
          selectedTags.includes(item.name) && styles.tagTextSelected
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#388E3C" />
      
      {/* Header */}
      <View style={styles.feedHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.feedHeaderText}>Discover</Text>
          <Text style={styles.feedSubheaderText}>Travel Stories</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          placeholder="Search trips and experiences..."
        />
      </View>

      {/* Tags Section */}
      <View style={styles.tagsSection}>
        <Text style={styles.tagsSectionTitle}>Popular Tags</Text>
        <FlatList
          data={TAGS}
          renderItem={renderTagItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsContainer}
        />
      </View>

      {/* Feed List */}
      <FlatList
        data={blogs}
        keyExtractor={(item) => item._id}
        renderItem={renderBlogCard}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4CAF50"]}
            tintColor="#4CAF50"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons
              name="sentiment-dissatisfied"
              size={48}
              color="#BDBDBD"
            />
            <Text style={styles.emptyText}>
              {loading ? "Loading..." : "No posts found"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  feedHeader: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    elevation: 4,
  },
  headerContent: {
    flexDirection: "column",
  },
  feedHeaderText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  feedSubheaderText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 16,
  },
  tagsSection: {
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tagsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tagsContainer: {
    paddingHorizontal: 16,
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  tagButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  tagText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  tagTextSelected: {
    color: '#FFF',
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#757575",
  },
});

export default FeedScreen;
