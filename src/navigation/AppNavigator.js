import React, { useEffect, useState, createContext } from 'react';
import { NavigationContainer ,createNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getStorageItem } from '../lib/storage'; 
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
export const navigationRef = createNavigationContainerRef();
export const AuthContext = createContext();

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await  getStorageItem('authToken');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error checking auth:', error);
      }
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
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
    </AuthContext.Provider>
  );
};

export default AppNavigator;
