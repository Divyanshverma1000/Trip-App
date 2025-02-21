import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <Provider store={store}>
      <>
        <AppNavigator />
        <Toast /> 
      </>
    </Provider>
  );
}
