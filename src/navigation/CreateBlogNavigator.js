import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CreateBlogContentScreen from '../screens/CreateBlog/CreateBlogContentScreen';
import CreateBlogTagsScreen from '../screens/CreateBlog/CreateBlogTagsScreen';
import CreateBlogTripScreen from '../screens/CreateBlog/CreateBlogTripScreen';
import CreateTripScreen from '../screens/CreateTripScreen'; // Your existing trip creation screen
import CreateBlogPhotosScreen from '../screens/CreateBlog/CreateBlogPhotosScreen';

const Stack = createStackNavigator();

const CreateBlogNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="CreateBlogContent"
        component={CreateBlogContentScreen}
        options={{
          headerTitle: 'Create New Blog',
        }}
      />
      <Stack.Screen
        name="CreateBlogTags"
        component={CreateBlogTagsScreen}
        options={{
          headerTitle: 'Add Tags',
        }}
      />
      <Stack.Screen
        name="CreateBlogPhotos"
        component={CreateBlogPhotosScreen}
        options={{
          headerTitle: 'Add Photos',
        }}
      />
      <Stack.Screen
        name="CreateBlogTrip"
        component={CreateBlogTripScreen}
        options={{
          headerTitle: 'Trip Details',
        }}
      />
    </Stack.Navigator>
  );
};

export default CreateBlogNavigator; 