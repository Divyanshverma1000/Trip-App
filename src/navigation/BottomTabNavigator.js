import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import CreateActionButton from '../components/CreateActionButton';

// Import your screens
import HomeScreen from '../screens/HomeScreen';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GroupChatScreen from '../screens/GroupChatScreen';
import CreateBlogNavigator from '../navigation/CreateBlogNavigator';


const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

// App's consistent colors
const COLORS = {
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  inactive: '#757575',
  white: '#FFFFFF',
};

const BottomTabNavigator = () => {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: true,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.inactive,
          headerShown: false,
          tabBarItemStyle: styles.tabBarItem,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIconStyle: styles.tabIcon,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="home"
                size={24}
                color={focused ? COLORS.primary : COLORS.inactive}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="explore"
                size={24}
                color={focused ? COLORS.primary : COLORS.inactive}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Create"
          component={View}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: () => (
              <CreateActionButton
                opened={isCreateMenuOpen}
                onToggle={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              />
            ),
          }}
        />
        <Tab.Screen
          name="GroupChat"
          // component={GroupChatScreen}
          component={CreateBlogNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="chat"
                size={24}
                color={focused ? COLORS.primary : COLORS.inactive}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="person"
                size={24}
                color={focused ? COLORS.primary : COLORS.inactive}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0,
    elevation: 8,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabBarItem: {
    height: 60,
    paddingTop: 5,
    paddingBottom: 5,
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default BottomTabNavigator;
