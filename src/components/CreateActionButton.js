import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  secondary: '#FF6B6B',
  white: '#FFFFFF',
};

const CreateActionButton = ({ opened, onToggle }) => {
  const navigation = useNavigation();
  const animation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(animation, {
        toValue: opened ? 1 : 0,
        useNativeDriver: true,
        tension: 40,
        friction: 7,
      }),
      Animated.spring(scale, {
        toValue: opened ? 1 : 0,
        useNativeDriver: true,
        tension: 40,
        friction: 7,
      }),
    ]).start();
  }, [opened]);

  const tripButtonStyle = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -70],
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -60],
        }),
      },
      { scale },
    ],
  };

  const blogButtonStyle = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 70],
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -60],
        }),
      },
      { scale },
    ],
  };

  const handleNavigate = (screen) => {
    // Close the menu first
    onToggle();
    
    // Wait for close animation to complete
    setTimeout(() => {
      switch (screen) {
        case 'trip':
          navigation.navigate('CreateTrip');
          break;
        case 'blog':
          navigation.navigate('CreateBlog', { screen: 'CreateBlogContent' });
          break;
      }
    }, 300); // Matches animation duration
  };

  return (
    <View style={styles.container}>
      {opened && (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            styles.overlay,
            { opacity: animation },
          ]}
        >
          <TouchableOpacity
            style={styles.overlayTouch}
            onPress={onToggle}
            activeOpacity={1}
          />
        </Animated.View>
      )}

      <View style={styles.buttonContainer}>
        <Animated.View style={[styles.actionButton, tripButtonStyle]}>
          <TouchableOpacity 
            style={[styles.actionButtonInner, styles.tripButton]}
            onPress={() => handleNavigate('trip')}
          >
            <MaterialIcons name="map" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Trip</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={onToggle}
          activeOpacity={0.8}
        >
          <Animated.View
            style={{
              transform: [
                {
                  rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '45deg'],
                  }),
                },
              ],
            }}
          >
            <MaterialIcons name="add" size={32} color={COLORS.white} />
          </Animated.View>
        </TouchableOpacity>

        <Animated.View style={[styles.actionButton, blogButtonStyle]}>
          <TouchableOpacity 
            style={[styles.actionButtonInner, styles.blogButton]}
            onPress={() => handleNavigate('blog')}
          >
            <MaterialIcons name="edit" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Blog</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayTouch: {
    width: '100%',
    height: '100%',
  },
  mainButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 2,
  },
  actionButton: {
    position: 'absolute',
    bottom: 8,
  },
  actionButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    gap: 8,
  },
  tripButton: {
    backgroundColor: COLORS.secondary,
  },
  blogButton: {
    backgroundColor: COLORS.primary,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CreateActionButton; 