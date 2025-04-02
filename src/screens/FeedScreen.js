import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Dimensions,
  StatusBar,
  SafeAreaView,
  RefreshControl,
  Animated,
  ImageBackground,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getBlogPosts, searchBlogs } from "../lib/blogs";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import BlogCard from "../components/BlogCard";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;
const HERO_MAX_HEIGHT = 220;
const HERO_MIN_HEIGHT = 100;

const TAGS = [
  {
    id: "1",
    name: "RoadTrip",
    icon: "directions-car",
    iconLibrary: "MaterialIcons",
  },
  {
    id: "2",
    name: "Trekking",
    icon: "hiking",
    iconLibrary: "MaterialCommunityIcons",
  },
  {
    id: "3",
    name: "Rafting",
    icon: "kayaking",
    iconLibrary: "MaterialCommunityIcons",
  },
  {
    id: "4",
    name: "Paragliding",
    icon: "paragliding",
    iconLibrary: "MaterialCommunityIcons",
  },
  {
    id: "5",
    name: "RiverCruise",
    icon: "ferry",
    iconLibrary: "MaterialCommunityIcons",
  },
  {
    id: "6",
    name: "ForestCamping",
    icon: "campfire",
    iconLibrary: "MaterialCommunityIcons",
  },
  {
    id: "7",
    name: "ShoppingSpree",
    icon: "shopping-cart",
    iconLibrary: "MaterialIcons",
  },
  {
    id: "8",
    name: "BeachTrip",
    icon: "umbrella-beach",
    iconLibrary: "MaterialCommunityIcons",
  },
  {
    id: "9",
    name: "PartyNight",
    icon: "record-player",
    iconLibrary: "MaterialCommunityIcons",
  },
  {
    id: "10",
    name: "FoodTrail",
    icon: "silverware-fork-knife",
    iconLibrary: "MaterialCommunityIcons",
  },
  {
    id: "11",
    name: "HeritageWalk",
    icon: "city-variant",
    iconLibrary: "MaterialCommunityIcons",
  },
  {
    id: "12",
    name: "CityTour",
    icon: "location-city",
    iconLibrary: "MaterialIcons",
  },
  {
    id: "13",
    name: "WaterfallVisit",
    icon: "waterfall",
    iconLibrary: "MaterialCommunityIcons",
  },
  {
    id: "14",
    name: "AdventureSports",
    icon: "run-fast",
    iconLibrary: "MaterialCommunityIcons",
  },
  {
    id: "15",
    name: "Backpacking",
    icon: "bag-personal",
    iconLibrary: "MaterialCommunityIcons",
  },
  {
    id: "16",
    name: "Camping",
    icon: "tent",
    iconLibrary: "MaterialCommunityIcons",
  },
  {
    id: "17",
    name: "NatureTrail",
    icon: "tree",
    iconLibrary: "MaterialCommunityIcons",
  },
  {
    id: "18",
    name: "StudyBreak",
    icon: "school",
    iconLibrary: "MaterialIcons",
  },
  {
    id: "19",
    name: "ReligiousTrip",
    icon: "temple-hindu",
    iconLibrary: "MaterialIcons",
  },
  {
    id: "20",
    name: "WildlifeSafari",
    icon: "paw",
    iconLibrary: "MaterialCommunityIcons",
  },
  {
    id: "21",
    name: "WeekendTrip",
    icon: "calendar-weekend",
    iconLibrary: "MaterialCommunityIcons",
  },
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays < 7) {
    const daysRounded = Math.floor(diffDays);
    return daysRounded <= 0 ? (
      <Text>Today</Text>
    ) : (
      <Text>{`${daysRounded} day${daysRounded > 1 ? "s" : ""} ago`}</Text>
    );
  }
  return (
    <Text>
      {date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}
    </Text>
  );
};

const FeedScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const searchInputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (route.params?.searchQuery) {
      setSearchQuery(route.params.searchQuery);
      setSelectedTags([]);
      handleSearch(route.params.searchQuery, []);
    }
  }, [route.params]);

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
    setSelectedTags((prev) => {
      if (prev.includes(tagName)) {
        return prev.filter((tag) => tag !== tagName);
      }
      return [...prev, tagName];
    });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (selectedTags.length === 0) {
      fetchBlogs();
    } else {
      handleSearch();
    }
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
  };

  const handleApplyFilters = () => {
    setFilterModalVisible(false);
    handleSearch();
  };

  const handleSearch = async (query = searchQuery, tags = selectedTags) => {
    setLoading(true);
    try {
      const searchParams = {
        query: query,
        tags: tags,
      };

      const searchResults = await searchBlogs(searchParams);
      setBlogs(searchResults);
    } catch (error) {
      console.error("Search error:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTags.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedTags]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const renderBlogCard = ({ item }) => (
    <BlogCard
      blog={item}
      style={styles.card}
      onPress={() =>
        navigation.navigate("BlogDetailsScreen", { blogId: item._id })
      }
    />
  );

  const getIconComponent = (library) => {
    switch (library) {
      case "MaterialIcons":
        return MaterialIcons;
      case "MaterialCommunityIcons":
        return MaterialCommunityIcons;
      default:
        return MaterialIcons;
    }
  };

  const renderTagItem = ({ item }) => {
    const IconComponent = getIconComponent(item.iconLibrary);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Hero Section */}
      <Animated.View style={[styles.heroContainer, { height: heroHeight }]}>
        <Animated.View style={styles.heroBackgroundContainer}>
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1521336575822-6da63fb45455"
,
            }}
            style={styles.heroBackground}
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
                      Discover
                    </Animated.Text>
                    <Animated.Text
                      style={[styles.subText, { opacity: subTextOpacity }]}
                    >
                      Travel Stories
                    </Animated.Text>
                  </View>
                </View>
              </Animated.View>

              <Animated.View
                style={[styles.heroContent, { opacity: heroContentOpacity }]}
              >
                <View style={styles.searchContainer}>
                  <View style={styles.searchInputContainer}>
                    <MaterialIcons
                      name="search"
                      size={20}
                      color="#757575"
                      style={styles.searchIcon}
                    />
                    <TextInput
                      ref={searchInputRef}
                      style={styles.textInput}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      onSubmitEditing={handleSearch}
                      returnKeyType="search"
                      placeholder="Search trips and experiences..."
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity
                        onPress={handleClearSearch}
                        style={styles.clearButton}
                      >
                        <MaterialIcons name="close" size={20} color="#757575" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </Animated.View>
            </Animated.View>
          </ImageBackground>
        </Animated.View>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        style={{ marginTop: HERO_MIN_HEIGHT }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4CAF50"]}
            tintColor="#4CAF50"
          />
        }
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: HERO_MAX_HEIGHT - HERO_MIN_HEIGHT + 16 },
        ]}
      >
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <MaterialIcons name="filter-list" size={18} color="#4CAF50" />
            <Text style={styles.filterButtonText}>Filters</Text>
          </TouchableOpacity>

          {selectedTags.length > 0 && (
            <Animated.View
              style={[styles.selectedCount, { opacity: fadeAnim }]}
            >
              <Text style={styles.selectedCountText}>
                {selectedTags.length}
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Selected Tags Display */}
        {selectedTags.length > 0 && (
          <View style={styles.selectedTagsContainer}>
            <View style={styles.selectedTagsHeader}>
              <Text style={styles.selectedTagsTitle}>Selected Tags:</Text>
              <TouchableOpacity onPress={handleClearAllTags}>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={selectedTags}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.selectedTag}
                  onPress={() => handleTagPress(item)}
                >
                  <Text style={styles.selectedTagText}>{item}</Text>
                  <MaterialIcons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.selectedTagsList}
            />
          </View>
        )}

        {/* Blog List */}
        <FlatList
          data={blogs}
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
              {(searchQuery.length > 0 || selectedTags.length > 0) && (
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={() => {
                    setSearchQuery("");
                    setSelectedTags([]);
                    fetchBlogs();
                  }}
                >
                  <Text style={styles.resetButtonText}>Reset Search</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          scrollEnabled={false}
        />
      </Animated.ScrollView>

      {/* Filter Modal - Keep the existing modal code */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter by Tags</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={TAGS}
              renderItem={renderTagItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.modalTagsContainer}
            />

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={handleClearAllTags}
              >
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyFiltersButton}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyFiltersText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  heroContent: {
    padding: 16,
    paddingBottom: 24,
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
  scrollContent: {
    paddingBottom: 80,
  },
  searchContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: "transparent",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
  },
  clearButton: {
    padding: 6,
  },
  filtersContainer: {
    flexDirection: "row",
    marginTop: 12,
    marginHorizontal: 16,
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  filterButtonText: {
    marginLeft: 6,
    color: "#4CAF50",
    fontWeight: "600",
    fontSize: 14,
  },
  selectedCount: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  selectedCountText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  selectedTagsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedTagsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  selectedTagsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  clearAllText: {
    fontSize: 14,
    color: "#E53935",
    fontWeight: "500",
  },
  selectedTagsList: {
    paddingVertical: 4,
  },
  selectedTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedTagText: {
    fontSize: 14,
    color: "#fff",
    marginRight: 6,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
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
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  resetButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalTagsContainer: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 20,
  },
  tagButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 6,
    flex: 1,
    minWidth: width / 2 - 40,
    maxWidth: width / 2 - 40,
    justifyContent: "center",
  },
  tagButtonSelected: {
    backgroundColor: "#4CAF50",
  },
  tagText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  tagTextSelected: {
    color: "#FFF",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  clearFiltersButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 12,
  },
  clearFiltersText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  applyFiltersButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  applyFiltersText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});

export default FeedScreen;
