import React, { useEffect, useState, createContext } from 'react';
import { NavigationContainer ,createNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getStorageItem, setStorageItem, removeStorageItem } from '../lib/storage'; 
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import BottomTabNavigator from './BottomTabNavigator';
import NotificationsScreen from '../screens/NotificationsScreen';
import TripDetailsScreen from '../screens/TripDetailsScreen';
import BlogDetailsScreen from '../screens/BlogDetailsScreen';
import ReviewPostScreen from '../screens/ReviewPostScreen';
import TripBlogForm from '../screens/TripBlogForm';
import DayItenaryScreen from '../screens/DayItenaryScreen';
import PhotoUploadScreen from '../screens/PhotoUploadScreen';
import TripItineraryScreen from '../screens/TripItineraryScreen';
import Toast from 'react-native-toast-message';
import { NotificationProvider } from '../context/NotificationContext';
import CreateTripScreen from '../screens/CreateTripScreen';
import InviteFriendsScreen from '../screens/InviteFriendsScreen';
import TripItineraryFormScreen from '../screens/TripItineraryScreen';
import AllBlogsScreen from '../screens/AllBlogsScreen';
import OpenTripsScreen from '../screens/OpenTripsScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import ItineraryPlanningScreen from '../screens/ItineraryPlanningScreen';
import CreateBlogNavigator from './CreateBlogNavigator';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyBlogsScreen from '../screens/MyBlogsScreen';
export const navigationRef = createNavigationContainerRef();
export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  setIsAuthenticated: () => {},
  setUser: () => {},
  logout: () => {},
  updateUser: () => {},
  clearError: () => {}
});

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const clearError = () => setError(null);

  const logout = async () => {
    setLoading(true);
    try {
      await removeStorageItem('authToken');
      await removeStorageItem('userData');
      setUser(null);
      setIsAuthenticated(false);
      Toast.show({
        type: 'success',
        text1: 'Logged out successfully'
      });
    } catch (error) {
      setError('Logout failed. Please try again.');
      Toast.show({
        type: 'error',
        text1: 'Logout failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData) => {
    try {
      await setStorageItem('userData', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      setError('Failed to update user data');
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Minimum splash screen duration
        const minimumSplashDuration = 2000; // 2 seconds
        const startTime = Date.now();

        // Check authentication
        const token = await getStorageItem('authToken');
        const storedUser = await getStorageItem('userData');
        
        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }

        // Calculate remaining time to meet minimum duration
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minimumSplashDuration - elapsedTime);

        // Ensure splash screen shows for at least minimumSplashDuration
        await new Promise(resolve => setTimeout(resolve, remainingTime));

        setLoading(false);
        
        // Add a small delay before hiding splash screen for smooth transition
        setTimeout(() => {
          setShowSplash(false);
        }, 500);

      } catch (error) {
        console.error('Error initializing app:', error);
        setLoading(false);
        setShowSplash(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    console.log('AppNavigator Auth State:', {
      isAuthenticated,
      hasUser: !!user,
      userData: user
    });
  }, [isAuthenticated, user]);

  const authContextValue = {
    isAuthenticated,
    user,
    loading,
    error,
    setIsAuthenticated,
    setUser,
    logout,
    updateUser,
    clearError
  };

  // Show splash screen during initial load
  if (showSplash || loading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <NotificationProvider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
              <>
                <Stack.Screen name="Main" component={BottomTabNavigator} />
                <Stack.Screen name="Notification" component={NotificationsScreen} /> 
                <Stack.Screen name="TripDetailsScreen" component={TripDetailsScreen} /> 
                <Stack.Screen name="BlogDetailsScreen" component={BlogDetailsScreen} />
                <Stack.Screen name="ReviewPost" component={ReviewPostScreen} />
                <Stack.Screen name="TripBlogForm" component={TripBlogForm} />
                <Stack.Screen name="DayItinerary" component={DayItenaryScreen} />
                <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} />
                <Stack.Screen name="TripItinerary" component={TripItineraryScreen} />
                <Stack.Screen name="InviteFriends" component={InviteFriendsScreen} />
                <Stack.Screen name="AllBlogs" component={AllBlogsScreen} />
                <Stack.Screen name="OpenTrips" component={OpenTripsScreen} />
                <Stack.Screen name="ItineraryPlanning" component={ItineraryPlanningScreen} />
                <Stack.Screen name="CreateTrip" component={CreateTripScreen} />
                <Stack.Screen name="Feed" component={FeedScreen} />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen 
                  name="ChatRoomScreen" 
                  component={ChatRoomScreen}
                  options={{ headerShown: false }}
                />
              
                <Stack.Screen 
                  name="CreateBlog" 
                  component={CreateBlogNavigator}
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="MyBlogsScreen" 
                  component={MyBlogsScreen}
                  options={{
                    title: 'My Blogs',
                    headerStyle: {
                      backgroundColor: '#4CAF50',
                    },
                    headerTintColor: '#fff',
                  }}
                />
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </NotificationProvider>
    </AuthContext.Provider>
  );
};

export default AppNavigator;
