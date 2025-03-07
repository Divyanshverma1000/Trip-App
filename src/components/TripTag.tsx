import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

interface TripTagProps {
  tag: string;
  index: number;
}

export const TripTag: React.FC<TripTagProps> = ({ tag, index }) => {
  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withDelay(index * 100, withTiming(1, { duration: 300 }));
  }, [fadeAnim, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  return (
    <Animated.View style={[styles.tag, animatedStyle]}>
      <Text style={styles.tagText}>{tag}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tag: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tagText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
});
