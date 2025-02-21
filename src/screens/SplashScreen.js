import React, { useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { Compass, Footprints, Camera } from 'lucide-react-native';

const SplashScreen = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    // Parallel animations for fade in and scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      // Handle navigation or hiding splash screen here
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo and Icons */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconCircle}>
          <Compass size={48} color="#84A98C" />
        </View>
      </Animated.View>

      {/* Brand Name */}
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })},
            ],
          },
        ]}
      >
        Wander
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })},
            ],
          },
        ]}
      >
        Explore Together, Travel Smarter
      </Animated.Text>

      {/* Decorative Icons */}
      <Animated.View
        style={[
          styles.decorativeIcons,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Footprints size={24} color="rgba(132, 169, 140, 0.6)" />
        <Camera size={24} color="rgba(132, 169, 140, 0.6)" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(132, 169, 140, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 32,
  },
  decorativeIcons: {
    flexDirection: 'row',
    gap: 32,
  },
});

export default SplashScreen;
