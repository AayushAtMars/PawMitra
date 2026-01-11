import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);

  const apiUrl = Constants.expoConfig?.extra?.apiUrl?.replace('/api', '') || 'https://pawmitra-backend.onrender.com';

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Open Google OAuth in browser
      const result = await WebBrowser.openAuthSessionAsync(
        `${apiUrl}/api/auth/google`,
        'com.pawmitra.app://auth/callback'
      );

      console.log('WebBrowser result:', result);

      if (result.type === 'success' && result.url) {
        // Parse the URL to get token and user data
        const url = Linking.parse(result.url);
        const { token, user } = url.queryParams;

        if (token && user) {
          const userData = JSON.parse(decodeURIComponent(user));
          
          return {
            token,
            user: userData
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    signInWithGoogle,
    loading,
    request: true, // For compatibility
  };
};
