import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CreateTripScreen from '../screens/CreateTripScreen';
import GroupChatScreen from '../screens/GroupChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: 'home-outline',
  Search: 'search-outline',
  CreateTrip: 'add-circle',
  GroupChat: 'chatbubble-ellipses-outline',
  Profile: 'person-outline',
};

const CreateTripButton = ({ focused }) => (
  <View style={styles.createTripButton}>
    <View style={[styles.createTripIconContainer, focused && styles.createTripIconContainerFocused]}>
      <Ionicons 
        name={ICONS.CreateTrip} 
        size={32} 
        color={focused ? '#fff' : '#4CAF50'} 
      />
    </View>
    <Text style={[
      styles.tabLabel, 
      focused && styles.tabLabelFocused,
      styles.createTripLabel
    ]}>
      Create
    </Text>
  </View>
);

const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: '#757575',
      tabBarLabelStyle: styles.tabLabel,
      tabBarIcon: ({ focused, color, size }) => {
        if (route.name === 'CreateTrip') {
          return <CreateTripButton focused={focused} />;
        }
        return (
          <Ionicons 
            name={ICONS[route.name]} 
            size={24} 
            color={color} 
          />
        );
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen 
      name="CreateTrip" 
      component={CreateTripScreen}
      options={{
        tabBarLabel: '',
      }}
    />
    <Tab.Screen name="GroupChat" component={GroupChatScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    height: Platform.OS === 'android' ? 65 : 85,
    paddingBottom: Platform.OS === 'android' ? 12 : 25,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  createTripButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? -30 : -20,
  },
  createTripIconContainer: {
    backgroundColor: '#fff',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  createTripIconContainerFocused: {
    backgroundColor: '#4CAF50',
    borderColor: '#fff',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: Platform.OS === 'android' ? 2 : 0,
  },
  tabLabelFocused: {
    color: '#4CAF50',
  },
  createTripLabel: {
    marginTop: Platform.OS === 'android' ? 16 : 8,
    fontSize: 12,
    fontWeight: '500',
    color: '#4CAF50',
  },
});

export default BottomTabNavigator;
