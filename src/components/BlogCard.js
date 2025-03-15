// BlogCard.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const BlogCard = ({ blog, style, onPress }) => {
  // Use first photo as cover photo if available, otherwise use placeholder
  const coverPhotoUrl = 
    blog.photos && blog.photos.length > 0 
      ? blog.photos[0].url 
      : 'https://via.placeholder.com/200x120';

  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, style]}>
      <Image source={{ uri: coverPhotoUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.authorRow}>
          <Image 
            source={{ uri: blog.host.photo || 'https://via.placeholder.com/40' }} 
            style={styles.authorImage} 
          />
          <Text style={styles.authorName}>{blog.host.name}</Text>
        </View>
        <Text style={styles.caption} numberOfLines={2}>
          {blog.caption}
        </Text>
        <View style={styles.footer}>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Feather name="heart" size={14} color="#666" />
              <Text style={styles.statText}>{blog.ratings?.length || 0}</Text>
            </View>
            <View style={styles.stat}>
              <Feather name="message-circle" size={14} color="#666" />
              <Text style={styles.statText}>{blog.comments?.length || 0}</Text>
            </View>
          </View>
          <Text style={styles.timeText}>
            {new Date(blog.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  caption: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
});

export default BlogCard;


