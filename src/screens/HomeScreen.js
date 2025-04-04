import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
} from "react";
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
  ImageBackground,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import TripCard from "../components/TripCard";
import BlogCard from "../components/BlogCard";
import { getOpenTrips } from "../lib/trips";
import { getBlogPosts, getTrendingBlogs } from "../lib/blogs";
import { AuthContext } from "../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { getUnrespondedNotifications } from "../lib/user";

const { width, height } = Dimensions.get("window");
const BLOG_CARD_WIDTH = width * 0.8;
const TRIP_CARD_WIDTH = (width - 48) / 2;
const HERO_MAX_HEIGHT = 220;
const HERO_MIN_HEIGHT = 100;
const HEADER_HEIGHT = 60;

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [openTrips, setOpenTrips] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [regularBlogs, setRegularBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [localNotifications, setLocalNotifications] = useState([]);

  const fetchLocalNotifications = async () => {
    try {
      const data = await getUnrespondedNotifications();
      setLocalNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchLocalNotifications();
  }, []);

  const unreadCount = localNotifications.filter((n) => !n.read).length;

  const scrollY = useRef(new Animated.Value(0)).current;

  const heroHeight = scrollY.interpolate({
    inputRange: [0, HERO_MAX_HEIGHT - HERO_MIN_HEIGHT],
    outputRange: [HERO_MAX_HEIGHT, HERO_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HERO_MAX_HEIGHT - HERO_MIN_HEIGHT],
    outputRange: [0, -20],
    extrapolate: "clamp",
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, HERO_MAX_HEIGHT - HERO_MIN_HEIGHT],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  const welcomeTextSize = scrollY.interpolate({
    inputRange: [0, HERO_MAX_HEIGHT - HERO_MIN_HEIGHT],
    outputRange: [24, 18],
    extrapolate: "clamp",
  });

  const subTextOpacity = scrollY.interpolate({
    inputRange: [0, (HERO_MAX_HEIGHT - HERO_MIN_HEIGHT) * 0.3],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const heroContentOpacity = scrollY.interpolate({
    inputRange: [0, (HERO_MAX_HEIGHT - HERO_MIN_HEIGHT) * 0.5],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const imageBlurRadius = scrollY.interpolate({
    inputRange: [0, HERO_MAX_HEIGHT - HERO_MIN_HEIGHT],
    outputRange: [0, 5],
    extrapolate: "clamp",
  });

  const gradientOpacity = scrollY.interpolate({
    inputRange: [0, HERO_MAX_HEIGHT - HERO_MIN_HEIGHT],
    outputRange: [0.6, 0.8],
    extrapolate: "clamp",
  });

  const fetchData = async () => {
    try {
      const [blogsData, tripsData, trendingData] = await Promise.all([
        getBlogPosts(),
        getOpenTrips(),
        getTrendingBlogs(),
      ]);
      setBlogs(blogsData);
      setOpenTrips(tripsData);
      setTrendingBlogs(trendingData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err);
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
      setError(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRegularBlogs();
  }, []);

  const trendingBlogs5 = trendingBlogs.slice(0, 5);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const navigateToFeedWithSearch = (query) => {
    navigation.navigate("Feed", { searchQuery: query });
  };

  // Inspirational travel phrases
  const inspirations = [
    "Discover hidden gems",
    "Explore local culture",
    "Find adventure",
    "Experience nature",
    "Taste authentic cuisine",
  ];

  const randomInspiration =
    inspirations[Math.floor(Math.random() * inspirations.length)];

  const indianDestinations = [
    {
      name: "Goa",
      image:
        "https://images.pexels.com/photos/1047051/pexels-photo-1047051.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
      name: "Jaipur",
      image:
        "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
      name: "Kerala",
      image:
        "https://images.pexels.com/photos/1310788/pexels-photo-1310788.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
      name: "Rishikesh",
      image:
        "https://images.pexels.com/photos/2387866/pexels-photo-2387866.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
      name: "Varanasi",
      image:
        "https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
      name: "Ladakh",
      image:
        "https://images.pexels.com/photos/2901216/pexels-photo-2901216.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <Animated.View style={[styles.heroContainer, { height: heroHeight }]}>
        <Animated.View style={styles.heroBackgroundContainer}>
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1506929562872-bb421503ef21",
            }}
            style={styles.heroBackground}
            imageStyle={{}}
          >
            <Animated.View
              style={[
                styles.gradient,
                {
                  backgroundColor: scrollY.interpolate({
                    inputRange: [0, HERO_MAX_HEIGHT - HERO_MIN_HEIGHT],
                    outputRange: ["rgba(0,0,0,0.1)", "rgba(0,0,0,0.4)"],
                    extrapolate: "clamp",
                  }),
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.headerContent,
                  {
                    transform: [
                      { translateY: headerTranslateY },
                      { scale: headerScale },
                    ],
                  },
                ]}
              >
                <View style={styles.headerRow}>
                  <View style={styles.welcomeSection}>
                    <Animated.Text
                      style={[
                        styles.welcomeText,
                        { fontSize: welcomeTextSize },
                      ]}
                    >
                      Hello, {user?.name?.split(" ")[0] || "Traveler"}
                    </Animated.Text>
                    <Animated.Text
                      style={[styles.subText, { opacity: subTextOpacity }]}
                    >
                      Discover your next adventure
                    </Animated.Text>
                  </View>

                  <View style={styles.iconsContainer}>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => navigation.navigate("Notification")}
                    >
                      <Feather name="bell" size={22} color="#fff" />
                      {unreadCount > 0 && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </Animated.View>
          </ImageBackground>
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={[
          styles.inspirationContainerAbsolute,
          {
            opacity: heroContentOpacity,
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, HERO_MAX_HEIGHT - HERO_MIN_HEIGHT],
                  outputRange: [HERO_MAX_HEIGHT - 30, HERO_MIN_HEIGHT - 30],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.inspirationCard}
          onPress={() => navigation.navigate("Feed")}
        >
          <Feather
            name="compass"
            size={20}
            color="#4CAF50"
            style={styles.inspirationIcon}
          />
          <Text style={styles.inspirationText}>{randomInspiration}</Text>
          <View style={styles.arrowContainer}>
            <Feather name="arrow-right" size={20} color="#4CAF50" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        style={{ marginTop: HERO_MIN_HEIGHT }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: HERO_MAX_HEIGHT - HERO_MIN_HEIGHT + 60 }, // Added extra padding for inspiration box
        ]}
      >
        {/* Trending Blogs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Trending Blogs</Text>
              <View style={styles.titleUnderline} />
            </View>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => navigation.navigate("AllBlogs")}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <Feather name="chevron-right" size={16} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.blogsContainer}
          >
            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
              </View>
            ) : (
              trendingBlogs5.map((blog) => (
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
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Open Trips</Text>
              <View style={styles.titleUnderline} />
            </View>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => navigation.navigate("OpenTrips")}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <Feather name="chevron-right" size={16} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
            </View>
          ) : (
            <View style={styles.tripsContainer}>
              {openTrips.slice(0, 4).map((trip) => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  style={styles.tripCard}
                  onPress={() =>
                    navigation.navigate("TripDetailsScreen", {
                      tripId: trip._id,
                    })
                  }
                />
              ))}
            </View>
          )}
        </View>

        {/* Popular Indian Destinations Section */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Explore India</Text>
              <View style={styles.titleUnderline} />
            </View>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => navigateToFeedWithSearch("India")}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <Feather name="chevron-right" size={16} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          <View style={styles.destinationsGrid}>
            {indianDestinations.map((destination, index) => (
              <TouchableOpacity
                key={index}
                style={styles.destinationCard}
                onPress={() => navigateToFeedWithSearch(destination.name)}
              >
                <View style={styles.destinationImageContainer}>
                  <Image
                    source={{ uri: destination.image }}
                    style={styles.destinationImage}
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.7)"]}
                    style={styles.destinationGradient}
                  />
                  <Text style={styles.destinationName}>{destination.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  heroContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
  },
  heroBackgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 10,
  },
  headerContent: {
    padding: 16,
    zIndex: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subText: {
    fontSize: 16,
    color: "#fff",
    marginTop: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  iconsContainer: {
    flexDirection: "row",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  // New position for inspiration box
  inspirationContainerAbsolute: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 15,
  },
  inspirationCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inspirationIcon: {
    marginRight: 12,
  },
  inspirationText: {
    flex: 1,
    color: "#444",
    fontSize: 16,
    fontWeight: "500",
  },
  arrowContainer: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: 80,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  titleUnderline: {
    height: 3,
    width: 40,
    backgroundColor: "#4CAF50",
    marginTop: 4,
    borderRadius: 2,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 2,
  },
  blogsContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  blogCard: {
    width: BLOG_CARD_WIDTH,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  tripsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  tripCard: {
    width: TRIP_CARD_WIDTH,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  lastSection: {
    paddingBottom: 24,
  },
  loaderContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  destinationsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  destinationCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  destinationImageContainer: {
    position: "relative",
    height: 130,
  },
  destinationImage: {
    width: "100%",
    height: "100%",
  },
  destinationGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  },
  destinationName: {
    position: "absolute",
    bottom: 10,
    left: 10,
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 20,
  },
});

export default HomeScreen;
