import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { authAPI } from '../services/api';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);

  // Use the creation of a proxy redirect URI
  const redirectUri = AuthSession.makeRedirectUri({
    path: 'auth/callback',
    useProxy: true, // This is key for using https://auth.expo.io/...
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '851804434438-qm0ffjslhj2pl8t5crte80lfh45a426h.apps.googleusercontent.com', // Web Client ID
    androidClientId: '851804434438-j6q9v73fhphlmt1gep0lvvm6n3cigjf5.apps.googleusercontent.com', 
    redirectUri: redirectUri,
    scopes: ['profile', 'email'],
  });

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      const result = await promptAsync();
      
      if (result?.type === 'success') {
        const { authentication } = result;
        
        // 1. Get User Info from Google directly
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/userinfo/v2/me',
          {
            headers: { Authorization: `Bearer ${authentication.accessToken}` },
          }
        );

        const userInfo = await userInfoResponse.json();
        console.log('Got User Info:', userInfo);

        // 2. Send to Backend API (POST request)
        // No redirect loop! Just a simple API call.
        const apiResponse = await authAPI.googleLogin({
          email: userInfo.email,
          name: userInfo.name,
          photo: userInfo.picture,
          googleId: userInfo.id,
        });

        return apiResponse.data;
      }
      
      return null;
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Login Failed', error.message);
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
