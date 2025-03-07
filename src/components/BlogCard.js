// BlogCard.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const BlogCard = ({ blog, onPress }) => {
  // Use first photo as cover photo if available, otherwise use placeholder
  const coverPhotoUrl = 
    blog.photos && blog.photos.length > 0 
      ? blog.photos[0].url 
      : 'https://via.placeholder.com/200x120';

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{ uri: coverPhotoUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.caption} numberOfLines={2}>
          {blog.caption}
        </Text>
        <View style={styles.authorContainer}>
          <Text style={styles.authorText}>By {blog.host.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 12,
  },
  caption: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 14,
    color: '#666',
  },
});

export default BlogCard;
