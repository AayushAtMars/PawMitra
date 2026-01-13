import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      const configureNavigationBar = async () => {
        // Hides the bottom navigation bar for immersive mode
        await NavigationBar.setVisibilityAsync("hidden");
        // Allows user to swipe up to show it transiently
        await NavigationBar.setBehaviorAsync("overlay-swipe");
      };
      configureNavigationBar();
    }
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AuthProvider>
  );
}
