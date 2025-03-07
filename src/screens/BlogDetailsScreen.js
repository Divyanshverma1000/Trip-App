import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, { useSharedValue, FadeInUp } from 'react-native-reanimated';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getBlogPostById } from '../lib/blogs';
import { MaterialIcons } from '@expo/vector-icons';

const BlogDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const blogId = route?.params?.blogId;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState(null);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    if (blogId) {
      setLoading(true);
      getBlogPostById(blogId)
        .then((data) => {
          setBlog(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch blog:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [blogId]);

  if (!blogId || loading || !blog) {
    return (
      <View style={styles.centered}>
        {loading ? (
          <ActivityIndicator size="large" color="#6366F1" />
        ) : (
          <Text style={styles.errorText}>
            {!blogId ? 'Error: No blog selected.' : 'Blog not found'}
          </Text>
        )}
      </View>
    );
  }

  const toggleDayExpansion = (dayIndex) => {
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Cover Image */}
      <Image
        source={{ uri: blog.trip.coverPhoto }}
        style={styles.coverImage}
      />

      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{blog.caption}</Text>
          <Text style={styles.author}>By {blog.host.name}</Text>
          <Text style={styles.content}>{blog.content}</Text>

          {/* Trip Details */}
          <View style={styles.tripDetails}>
            <Text style={styles.sectionTitle}>Trip Details</Text>
            <View style={styles.metadata}>
              <View style={styles.metadataItem}>
                <MaterialIcons name="location-on" size={24} color="#6366F1" />
                <Text>{blog.trip.metadata.destination}</Text>
              </View>
              <View style={styles.metadataItem}>
                <MaterialIcons name="timer" size={24} color="#6366F1" />
                <Text>{blog.trip.metadata.duration} days</Text>
              </View>
              <View style={styles.metadataItem}>
                <MaterialIcons name="attach-money" size={24} color="#6366F1" />
                <Text>${blog.trip.metadata.cost}</Text>
              </View>
            </View>
          </View>

          {/* Itinerary */}
          <View style={styles.itinerary}>
            <Text style={styles.sectionTitle}>Itinerary</Text>
            {blog.trip.itinerary.map((day, index) => (
              <TouchableOpacity
                key={day._id}
                style={styles.dayCard}
                onPress={() => toggleDayExpansion(index)}
              >
                <View style={styles.dayHeader}>
                  <Text style={styles.dayTitle}>Day {day.day}</Text>
                  <MaterialIcons
                    name={expandedDay === index ? "expand-less" : "expand-more"}
                    size={24}
                    color="#6366F1"
                  />
                </View>
                
                {expandedDay === index && (
                  <Animated.View
                    entering={FadeInUp}
                    style={styles.dayDetails}
                  >
                    <Text style={styles.dayNotes}>{day.dayNotes}</Text>
                    
                    {/* Stay Details */}
                    <View style={styles.detailSection}>
                      <Text style={styles.detailTitle}>Stay</Text>
                      <Text style={styles.hotelName}>{day.stay.hotelName}</Text>
                      <Text style={styles.detailText}>{day.stay.description}</Text>
                    </View>

                    {/* Activities */}
                    {day.activities.map(activity => (
                      <View key={activity._id} style={styles.detailSection}>
                        <Text style={styles.detailTitle}>{activity.activityName}</Text>
                        <Text style={styles.detailText}>{activity.description}</Text>
                      </View>
                    ))}
                  </Animated.View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  metadataItem: {
    alignItems: 'center',
  },
  dayCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  dayDetails: {
    padding: 16,
    backgroundColor: '#fff',
  },
  dayNotes: {
    fontSize: 16,
    marginBottom: 12,
  },
  detailSection: {
    marginVertical: 8,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  hotelName: {
    fontSize: 16,
    color: '#6366F1',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default BlogDetailsScreen;

