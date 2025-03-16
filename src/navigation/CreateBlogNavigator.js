import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CreateBlogContentScreen from '../screens/CreateBlog/CreateBlogContentScreen';
import CreateBlogTagsScreen from '../screens/CreateBlog/CreateBlogTagsScreen';
import CreateBlogTripScreen from '../screens/CreateBlog/CreateBlogTripScreen';
import CreateTripScreen from '../screens/CreateTripScreen'; // Your existing trip creation screen

const Stack = createStackNavigator();

const CreateBlogNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen 
        name="CreateBlogContent" 
        component={CreateBlogContentScreen}
      />
      <Stack.Screen 
        name="CreateBlogTags" 
        component={CreateBlogTagsScreen}
      />
      <Stack.Screen 
        name="CreateBlogTrip" 
        component={CreateBlogTripScreen}
      />
      <Stack.Screen 
        name="CreateTrip" 
        component={CreateTripScreen}
      />
    </Stack.Navigator>
  );
};

export default CreateBlogNavigator; 