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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getBlogPosts, searchBlogs } from "../lib/blogs";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import SearchBar from '../components/SearchBar';
import BlogCard from '../components/BlogCard';

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Ratings", value: "ratings" },
  { label: "Women Safety", value: "womenSafety" },
  { label: "Affordability", value: "affordability" },
  { label: "Cultural", value: "culturalExperience" },
  { label: "Accessibility", value: "accessibility" },
];

const TAGS = [
  { id: '1', name: 'SummerTrip', icon: 'sun' },
  { id: '2', name: 'SafeForWomen', icon: 'shield' },
  { id: '3', name: 'BudgetTravel', icon: 'dollar-sign' },
  { id: '4', name: 'Adventure', icon: 'compass' },
  { id: '5', name: 'CulturalExperience', icon: 'globe' },
  { id: '6', name: 'FamilyFriendly', icon: 'users' },
  { id: '7', name: 'SoloTravel', icon: 'user' },
  { id: '8', name: 'CityBreak', icon: 'home' },
  { id: '9', name: 'NatureEscape', icon: 'tree' },
  { id: '10', name: 'BeachVacation', icon: 'umbrella' },
  { id: '11', name: 'HistoricalSites', icon: 'landmark' },
  { id: '12', name: 'FoodieJourney', icon: 'coffee' },
  { id: '13', name: 'LuxuryTravel', icon: 'star' },
  { id: '14', name: 'RoadTrip', icon: 'map' },
  { id: '15', name: 'EcoTourism', icon: 'leaf' },
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
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

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

  const searchBlogs = async () => {
    setLoading(true);
    try {
      const results = await searchBlogs({ 
        query: searchQuery, 
        tags: selectedTags 
      });
      setBlogs(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error('Search error:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    searchBlogs();
  }, [selectedTags]);

  // Filtering functions based on selectedFilter value
  const getFilteredBlogs = () => {
    if (!blogs || !Array.isArray(blogs)) {
      return [];
    }

    if (selectedFilter === "all") {
      return blogs
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (selectedFilter === "ratings") {
      const rated = blogs.filter(
        (blog) => blog.ratings && Array.isArray(blog.ratings) && blog.ratings.length > 0
      );
      return rated.sort((a, b) => {
        const avgA =
          a.ratings.reduce((sum, r) => sum + r.value, 0) / a.ratings.length;
        const avgB =
          b.ratings.reduce((sum, r) => sum + r.value, 0) / b.ratings.length;
        return avgB - avgA;
      });
    }
    return blogs
      .filter(
        (blog) => blog.concerns && blog.concerns[selectedFilter] !== undefined
      )
      .sort((a, b) => b.concerns[selectedFilter] - a.concerns[selectedFilter]);
  };

  const filteredBlogs = getFilteredBlogs();

  const renderBlogCard = ({ item }) => {
    const avgRating =
      item.ratings && item.ratings.length > 0
        ? (
            item.ratings.reduce((sum, r) => sum + r.value, 0) /
            item.ratings.length
          ).toFixed(1)
        : null;

    const maxSummaryLength = 100;
    const summaryText =
      item.summary && item.summary.length > maxSummaryLength
        ? item.summary.substring(0, maxSummaryLength) + "..."
        : item.summary;

    const concerns = item.concerns || {};

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("BlogDetailsScreen", { blogId: item._id })
        }
      >
        {/* Card Header: Host info */}
        <View style={styles.cardHeader}>
          <Image
            source={{
              uri: item.host.profilePic || "https://via.placeholder.com/40",
            }}
            style={styles.profilePic}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.hostName}>{item.host.name}</Text>
            <Text style={styles.timeText}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>

        {/* Blog Content */}
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>

          {item.coverPhoto && (
            <Image
              source={{ uri: item.coverPhoto }}
              style={styles.coverPhoto}
              resizeMode="cover"
            />
          )}

          {summaryText ? (
            <Text style={styles.summary}>{summaryText}</Text>
          ) : null}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.map((tag, index) => (
                <View key={index} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.cardFooter}>
            {/* Rating display */}
            {avgRating && (
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.avgRatingText}>{avgRating}</Text>
              </View>
            )}

            {/* Concerns badges */}
            <View style={styles.concernsBadges}>
              {Object.entries(concerns).map(([key, value], index) =>
                value > 3 ? (
                  <View key={index} style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {key === "womenSafety"
                        ? "Safe"
                        : key === "affordability"
                        ? "Budget"
                        : key === "culturalExperience"
                        ? "Cultural"
                        : key === "accessibility"
                        ? "Access"
                        : key}
                    </Text>
                  </View>
                ) : null
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
      {/* Creative Header */}
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
          onSubmitEditing={searchBlogs}
          placeholder="Search trips and experiences..."
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContentContainer}
        >
          {FILTER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.tab,
                selectedFilter === option.value && styles.activeTab,
              ]}
              onPress={() => setSelectedFilter(option.value)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedFilter === option.value && styles.activeTabText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
        data={filteredBlogs}
        keyExtractor={(item) => item._id}
        renderItem={renderBlogCard}
        contentContainerStyle={styles.listContainer}
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
  tabsWrapper: {
    backgroundColor: "#fff",
    elevation: 2,
  },
  tabsContainer: {
    paddingVertical: 12,
  },
  tabsContentContainer: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#f0f0f0",
  },
  activeTab: {
    backgroundColor: "#4CAF50",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4CAF50",
  },
  activeTabText: {
    color: "#fff",
  },
  listContainer: {
    padding: 12,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    padding: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: CARD_WIDTH,
    alignSelf: "center",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  hostName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
  },
  timeText: {
    fontSize: 12,
    color: "#757575",
    marginTop: 2,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#212121",
  },
  coverPhoto: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  summary: {
    fontSize: 14,
    color: "#424242",
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tagBadge: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  avgRatingText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
    color: "#FF8F00",
  },
  concernsBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  badge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 12,
    color: "#388E3C",
    fontWeight: "500",
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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tagsSection: {
    paddingVertical: 16,
  },
  tagsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 12,
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
  tagTextSelected: {
    color: '#FFF',
  },
});

export default FeedScreen;
