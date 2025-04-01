import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Text,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import BlogCard from "../components/BlogCard";
import { getTrendingBlogs } from "../lib/blogs";
import { useNavigation } from "@react-navigation/native";

const AllBlogsScreen = () => {
  const navigation = useNavigation();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTrendingBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBlogs();
    setRefreshing(false);
  }, [fetchBlogs]);

  React.useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const trendingBlogs = blogs
    .filter((blog) => blog.ratings && blog.ratings.length > 0)
    .map((blog) => {
      const avgRating =
        blog.ratings.reduce((sum, rating) => sum + rating.value, 0) /
        blog.ratings.length;
      return { ...blog, averageRating: avgRating };
    })
    .sort((a, b) => b.averageRating - a.averageRating);

  const renderBlogCard = ({ item }) => (
    <BlogCard
      blog={item}
      onPress={() =>
        navigation.navigate("BlogDetailsScreen", { blogId: item._id })
      }
      style={styles.blogCard}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Feather name="trending-up" size={24} color="#4CAF50" />
          <Text style={styles.headerText}>Trending Blogs</Text>
        </View>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator style={styles.loader} size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={blogs}
          renderItem={renderBlogCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  listContainer: {
    padding: 16,
  },
  blogCard: {
    marginBottom: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AllBlogsScreen;
