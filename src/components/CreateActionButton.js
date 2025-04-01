// import React, { useEffect, useRef } from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   Animated,
//   Dimensions,
// } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const { width, height: screenHeight } = Dimensions.get('window');
// const containerHeight = 60; // Matches the container height in styles

// const COLORS = {
//   primary: '#4CAF50',
//   primaryDark: '#388E3C',
//   secondary: '#FF6B6B',
//   white: '#FFFFFF',
// };

// const CreateActionButton = ({ opened, onToggle }) => {
//   const navigation = useNavigation();
//   const animation = useRef(new Animated.Value(0)).current;
//   const scale = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Automatically close the FAB when navigating to another screen
//     const unsubscribe = navigation.addListener('state', () => {
//       if (opened) {
//         onToggle();
//       }
//     });

//     return unsubscribe; // Cleanup the listener
//   }, [navigation, opened]);

//   useEffect(() => {
//     Animated.parallel([
//       Animated.spring(animation, {
//         toValue: opened ? 1 : 0,
//         useNativeDriver: true,
//         tension: 40,
//         friction: 7,
//       }),
//       Animated.spring(scale, {
//         toValue: opened ? 1 : 0,
//         useNativeDriver: true,
//         tension: 40,
//         friction: 7,
//       }),
//     ]).start();
//   }, [opened]);

//   const tripButtonStyle = {
//     transform: [
//       {
//         translateX: animation.interpolate({
//           inputRange: [0, 1],
//           outputRange: [0, -70],
//         }),
//       },
//       {
//         translateY: animation.interpolate({
//           inputRange: [0, 1],
//           outputRange: [0, -60],
//         }),
//       },
//       { scale },
//     ],
//   };

//   const blogButtonStyle = {
//     transform: [
//       {
//         translateX: animation.interpolate({
//           inputRange: [0, 1],
//           outputRange: [0, 70],
//         }),
//       },
//       {
//         translateY: animation.interpolate({
//           inputRange: [0, 1],
//           outputRange: [0, -60],
//         }),
//       },
//       { scale },
//     ],
//   };

//   const handleNavigate = (screen) => {
//     onToggle(); // Close the FAB
//     setTimeout(() => {
//       switch (screen) {
//         case 'trip':
//           navigation.navigate('CreateTrip');
//           break;
//         case 'blog':
//           navigation.navigate('CreateBlog', { screen: 'CreateBlogContent' });
//           break;
//       }
//     }, 300);
//   };

//   return (
//     <View style={styles.container}>
//       {opened && (
//         <Animated.View
//           style={[
//             {
//               position: 'absolute',
//               top: -(screenHeight - containerHeight),
//               left: 0,
//               right: 0,
//               bottom: 0,
//               backgroundColor: 'rgba(0,0,0,0.5)',
//               opacity: animation,
//               zIndex: 1,
//             },
//           ]}
//         >
//           <TouchableOpacity
//             style={{ width: '100%', height: '100%' }}
//             onPress={onToggle}
//             activeOpacity={1}
//           />
//         </Animated.View>
//       )}

//       <View style={[styles.buttonContainer, { zIndex: 2 }]}>
//         <Animated.View style={[styles.actionButton, tripButtonStyle]}>
//           <TouchableOpacity
//             style={[styles.actionButtonInner, styles.tripButton]}
//             onPress={() => handleNavigate('trip')}
//           >
//             <MaterialIcons name="map" size={20} color={COLORS.white} />
//             <Text style={styles.actionButtonText}>Trip</Text>
//           </TouchableOpacity>
//         </Animated.View>

//         <TouchableOpacity
//           style={styles.mainButton}
//           onPress={onToggle}
//           activeOpacity={0.8}
//         >
//           <Animated.View
//             style={{
//               transform: [
//                 {
//                   rotate: animation.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: ['0deg', '45deg'],
//                   }),
//                 },
//               ],
//             }}
//           >
//             <MaterialIcons name="add" size={32} color={COLORS.white} />
//           </Animated.View>
//         </TouchableOpacity>

//         <Animated.View style={[styles.actionButton, blogButtonStyle]}>
//           <TouchableOpacity
//             style={[styles.actionButtonInner, styles.blogButton]}
//             onPress={() => handleNavigate('blog')}
//           >
//             <MaterialIcons name="edit" size={20} color={COLORS.white} />
//             <Text style={styles.actionButtonText}>Blog</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 60,
//   },
//   buttonContainer: {
//     position: 'absolute',
//     bottom: 0,
//     alignItems: 'center',
//   },
//   mainButton: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: COLORS.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     marginBottom: 2,
//   },
//   actionButton: {
//     position: 'absolute',
//     bottom: 8,
//   },
//   actionButtonInner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: 130,
//     height: 80,
//     paddingHorizontal: 30,
//     borderRadius: 60,
//     elevation: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     gap: 10,
//   },
//   tripButton: {
//     backgroundColor: COLORS.secondary,
//   },
//   blogButton: {
//     backgroundColor: COLORS.primary,
//   },
//   actionButtonText: {
//     color: COLORS.white,
//     fontSize: 21,
//     fontWeight: '600',
//   },
// });

// export default CreateActionButton;

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

const { width, height: screenHeight } = Dimensions.get('window');
const containerHeight = 60; // Matches the container height in styles

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
    // Close the FAB when navigating to another screen
    const unsubscribe = navigation.addListener('state', () => {
      if (opened) {
        onToggle();
      }
    });

    return unsubscribe;
  }, [navigation, opened]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animation, {
        toValue: opened ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: opened ? 1 : 0.8, // Ensuring touchability
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
    opacity: animation, // Ensures visibility and touchability
    pointerEvents: opened ? 'auto' : 'none', // Prevents ghost clicks
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
    opacity: animation,
    pointerEvents: opened ? 'auto' : 'none',
  };

  const handleNavigate = (screen) => {
    onToggle();
    setTimeout(() => {
      switch (screen) {
        case 'trip':
          navigation.navigate('CreateTrip');
          break;
        case 'blog':
          navigation.navigate('CreateBlog', { screen: 'CreateBlogContent' });
          break;
      }
    }, 300);
  };

  return (
    <View style={[styles.container, { zIndex: opened ? 10 : 1 }]}>
      {/* Faded Background to Block Clicks Behind */}
      {opened && (
        <Animated.View style={[styles.overlay, { opacity: animation }]}>
          <TouchableOpacity
            style={{ width: '100%', height: '100%' }}
            onPress={onToggle}
            activeOpacity={1}
          />
        </Animated.View>
      )}

      {/* Floating Buttons */}
      <View style={[styles.buttonContainer, { zIndex: 2 }]}>
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
  overlay: {
    position: 'absolute',
    top: -(screenHeight - containerHeight),
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // Faded background
    zIndex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
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
    shadowOffset: { width: 0, height: 2 },
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
    width: 130,
    height: 80,
    paddingHorizontal: 30,
    borderRadius: 60,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    gap: 10,
  },
  tripButton: {
    backgroundColor: COLORS.secondary,
  },
  blogButton: {
    backgroundColor: COLORS.primary,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: '600',
  },
});

export default CreateActionButton;
