import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { getBlogPosts, deleteBlogPost } from '../lib/blogs';
import { AuthContext } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2; // Changed to 2 columns for better visuals
const ITEM_WIDTH = (width - 48) / COLUMN_COUNT; // 48 is total horizontal padding

const MyBlogsScreen = () => {
  const [blogs, setBlogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      const allBlogs = await getBlogPosts();
      const myBlogs = allBlogs.filter(blog => blog.host._id === user.id);
      setBlogs(myBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch blogs',
        text2: 'Pull down to refresh',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyBlogs();
    setRefreshing(false);
  };

  const handleDelete = (blogId) => {
    Alert.alert(
      'Delete Blog',
      'Are you sure you want to delete this blog?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBlogPost(blogId);
              setBlogs(blogs.filter(blog => blog._id !== blogId));
              Toast.show({
                type: 'success',
                text1: 'Blog deleted successfully',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Failed to delete blog',
              });
            }
          },
        },
      ]
    );
  };

  const renderBlogCard = ({ item }) => (
    <TouchableOpacity
      style={styles.blogCard}
      onPress={() => navigation.navigate('BlogDetailsScreen', { blogId: item._id })}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.coverPhoto || 'https://via.placeholder.com/150' }}
          style={styles.blogImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item._id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="trash-2" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.blogInfo}>
        <Text style={styles.blogTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.metaContainer}>
          <Feather name="calendar" size={12} color="#666" style={styles.metaIcon} />
          <Text style={styles.blogDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1E7033" barStyle="light-content" />
      
      <LinearGradient
        colors={['#1E7033', '#4CAF50']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Blogs</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateBlog')}
        >
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <FlatList
          data={blogs}
          renderItem={renderBlogCard}
          keyExtractor={(item) => item._id}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#4CAF50']} 
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="file-text" size={60} color="#ddd" />
              <Text style={styles.emptyText}>You haven't created any blogs yet</Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('CreateBlog')}
                activeOpacity={0.8}
              >
                <Text style={styles.createButtonText}>Create Your First Blog</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    paddingTop: 30,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 60,
  },
  blogCard: {
    width: ITEM_WIDTH,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3.84,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  blogImage: {
    width: '100%',
    height: ITEM_WIDTH * 0.8,
    backgroundColor: '#f0f0f0',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  blogInfo: {
    padding: 12,
  },
  blogTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 4,
  },
  blogDate: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
    borderRadius: 12,
    padding: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    height: 400,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 10,
  },
  createButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default MyBlogsScreen;