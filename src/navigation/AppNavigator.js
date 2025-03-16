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
    const checkAuth = async () => {
      try {
        const token = await getStorageItem('authToken');
        const storedUser = await getStorageItem('userData');
        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
      setLoading(false);
    };

    checkAuth();
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

  if (loading) {
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
                <Stack.Screen 
                  name="ChatRoom" 
                  component={ChatRoomScreen}
                  options={{ headerShown: false }}
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
