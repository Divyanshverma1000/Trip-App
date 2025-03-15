import React, { useEffect, useState, useContext, useCallback } from "react";
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
  FlatList,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import SearchBar from "../components/SearchBar";
import TripCard from "../components/TripCard";
import BlogCard from "../components/BlogCard";
import { getOpenTrips } from "../lib/trips";
import { getBlogPosts, searchBlogs } from "../lib/blogs";
import { AuthContext } from "../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const BLOG_CARD_WIDTH = width * 0.85;

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [openTrips, setOpenTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [regularBlogs, setRegularBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const fetchData = async () => {
    try {
      const [blogsData, tripsData] = await Promise.all([
        getBlogPosts(),
        getOpenTrips(),
      ]);
      setBlogs(blogsData);
      setOpenTrips(tripsData);
    } catch (err) {
      console.error("Error fetching data:", err);
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
      console.error("Error fetching blogs:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRegularBlogs();
  }, []);

  const trendingBlogs = blogs
    .filter((blog) => blog.ratings && blog.ratings.length > 0) // Only blogs with ratings
    .map((blog) => {
      const avgRating =
        blog.ratings.reduce((sum, rating) => sum + rating.value, 0) /
        blog.ratings.length;
      return { ...blog, averageRating: avgRating };
    })
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 5);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

      {/* Fixed Header Section */}
      <View style={styles.fixedHeader}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Hello, {user?.name?.split(" ")[0] || "Traveler"}!
          </Text>
          <Text style={styles.subText}>Where to next?</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <SearchBar
              placeholder="Search destinations..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
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
            <TouchableOpacity onPress={() => navigation.navigate("AllBlogs")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.blogsContainer}
          >
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#4CAF50"
                style={styles.loader}
              />
            ) : (
              trendingBlogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  style={styles.blogCard}
                  onPress={() =>
                    navigation.navigate("BlogDetailsScreen", {
                      blogId: blog._id,
                    })
                  }
                />
              ))
            )}
          </ScrollView>
        </View>

        {/* Open Trips Section */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Open Trips</Text>
            <TouchableOpacity onPress={() => navigation.navigate("OpenTrips")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tripsGrid}>
            {openTrips.slice(0, 6).map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                style={styles.tripCard}
                onPress={() =>
                  navigation.navigate("TripDetailsScreen", { tripId: trip._id })
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fixedHeader: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 16 : 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  welcomeSection: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
  },
  blogsContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  blogCard: {
    width: BLOG_CARD_WIDTH,
    marginRight: 16,
  },
  tripsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 12,
  },
  lastSection: {
    paddingBottom: 24,
  },
  loader: {
    width: BLOG_CARD_WIDTH,
    height: 200,
    justifyContent: "center",
  },
});

export default HomeScreen;
