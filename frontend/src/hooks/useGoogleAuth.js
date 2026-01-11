import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { API_URL } from '../config/api';

// Get the base URL without /api
const BACKEND_URL = API_URL.replace('/api', '');

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Open Google OAuth via backend
      const authUrl = `${BACKEND_URL}/api/auth/google`;
      
      // Open browser for OAuth
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        'pawmitra://auth/callback'
      );

      if (result.type === 'success' && result.url) {
        // Parse the callback URL
        const url = Linking.parse(result.url);
        const token = url.queryParams?.token;
        const userParam = url.queryParams?.user;

        if (token && userParam) {
          const user = JSON.parse(decodeURIComponent(userParam));
          return { success: true, token, user };
        }
      }

      if (result.type === 'cancel') {
        setError('Sign-in cancelled');
        return null;
      }

      throw new Error('Google sign-in failed');
    } catch (err) {
      console.error('Google auth error:', err);
      setError(err.message || 'Google authentication failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    isLoading,
    error,
    isReady: true,
  };
};

export default useGoogleAuth;
