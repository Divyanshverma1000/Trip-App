// BlogCard.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const BlogCard = ({ blog, style, onPress }) => {
  // Use coverPhoto if available, otherwise use first photo or placeholder
  const coverPhotoUrl = 
    blog.coverPhoto || (blog.photos && blog.photos.length > 0 
      ? blog.photos[0].url 
      : 'default: "https://media.istockphoto.com/id/1381637603/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=w64j3fW8C96CfYo3kbi386rs_sHH_6BGe8lAAAFS-y4="');

  // Calculate average rating
  const avgRating = blog.ratings.length > 0 
    ? blog.ratings.reduce((acc, curr) => acc + curr.value, 0) / blog.ratings.length
    : 0;

    console.log('Blog Host:', blog.host);
    console.log('Blog Host Photo:', blog.host?.photo);


  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, style]}>
      <Image source={{ uri: coverPhotoUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {blog.title}
        </Text>
        
        {blog.summary && (
          <Text style={styles.summary} numberOfLines={2}>
            {blog.summary}
          </Text>
        )}

        <View style={styles.metaInfo}>
          <View style={styles.hostInfo}>
            
          <Image 
            source={{ uri: blog.host?.photo || 'https://avatar.iran.liara.run/public/boy?username=Ash' }}
            style={styles.hostPhoto}
          />

            <Text style={styles.hostName}>By {blog.host.name}</Text>
          </View>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Feather name="star" size={14} color="#FFD700" />
              <Text style={styles.statText}>{avgRating.toFixed(1)}</Text>
            </View>
            {blog.budget && (
              <View style={styles.stat}>
                <Feather name="dollar-sign" size={14} color="#4CAF50" />
                <Text style={styles.statText}>{blog.budget}</Text>
              </View>
            )}
          </View>
        </View>

        {blog.tags && blog.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {blog.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
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
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostPhoto: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  hostName: {
    fontSize: 14,
    color: '#666',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
});

export default BlogCard;
