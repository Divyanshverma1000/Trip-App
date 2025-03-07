import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import TripPlannerScreen from '../screens/TripPlannerScreen';
import GroupChatScreen from '../screens/GroupChatScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { View, Text, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: 'home-outline',
  Search: 'search-outline',
  TripPlanner: 'map-outline',
  GroupChat: 'chatbubble-ellipses-outline',
  Notifications: 'notifications-outline',
  Profile: 'person-outline',
};

const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: false,
      tabBarIcon: ({ color, size }) => (
        <Ionicons name={ICONS[route.name]} size={size} color={color} />
      ),
      tabBarActiveTintColor: '#4CAF50', // Green for active tab
      tabBarInactiveTintColor: '#757575', // Gray for inactive tab
      tabBarStyle: styles.tabBar,
      
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="TripPlanner" component={TripPlannerScreen} />
    <Tab.Screen name="GroupChat" component={GroupChatScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 5,
    height: 60,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default BottomTabNavigator;
