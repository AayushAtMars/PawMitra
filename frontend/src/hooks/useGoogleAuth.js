import { useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { authAPI } from '../services/api';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);

  const googleClientId = Constants.expoConfig?.extra?.googleClientId;

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: googleClientId,
    iosClientId: googleClientId,
    expoClientId: googleClientId, // For Expo Go
    scopes: ['profile', 'email'],
  });

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      if (!request) {
        throw new Error('Google Auth not configured');
      }

      const result = await promptAsync();
      
      console.log('Google auth result:', result);

      if (result.type === 'success') {
        // Get user info from Google
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/userinfo/v2/me',
          {
            headers: { Authorization: `Bearer ${result.authentication.accessToken}` },
          }
        );

        const userInfo = await userInfoResponse.json();
        console.log('User info from Google:', userInfo);

        // Send to your backend
        const response = await authAPI.googleLogin({
          email: userInfo.email,
          name: userInfo.name,
          photo: userInfo.picture,
          googleId: userInfo.id,
        });

        return response.data;
      } else if (result.type === 'error') {
        console.error('Google auth error:', result.error);
        throw new Error(result.error?.message || 'Google sign-in failed');
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
    request,
  };
};
