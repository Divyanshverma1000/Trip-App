// src/navigation/AppNavigator.js
import React, { useEffect, useState, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import BottomTabNavigator from './BottomTabNavigator';
import TripDetailsScreen from '../screens/TripDetailsScreen';

export const AuthContext = createContext();

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error checking auth:', error);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            // Authenticated flow
            <>
              {/* "Main" renders your Bottom Tab Navigator */}
              <Stack.Screen name="Main" component={BottomTabNavigator} />
              {/* Additional screens like TripDetails can be pushed from the tabs */}
              <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
            </>
          ) : (
            // Unauthenticated flow
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
