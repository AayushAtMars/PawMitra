// import React, { createContext, useState, useContext, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { authAPI } from '../services/api';
// import socketService from '../services/socket';

// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Load user from storage on app start
//   useEffect(() => {
//     loadUser();
//   }, []);

//   const loadUser = async () => {
//     try {
//       const token = await AsyncStorage.getItem('authToken');
//       const userData = await AsyncStorage.getItem('user');

//       if (token && userData) {
//         setUser(JSON.parse(userData));
//         setIsAuthenticated(true);
        
//         // Connect socket
//         await socketService.connect();
//       }
//     } catch (error) {
//       console.error('Error loading user:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       const response = await authAPI.login({ email, password });
//       const { token, user: userData } = response.data;

//       console.log('Login successful, saving token...');
//       await AsyncStorage.setItem('authToken', token);
//       await AsyncStorage.setItem('user', JSON.stringify(userData));
//       console.log('Token saved to storage');

//       setUser(userData);
//       setIsAuthenticated(true);

//       // Connect socket
//       await socketService.connect();

//       return { success: true };
//     } catch (error) {
//       console.error('Login error:', error);
//       return {
//         success: false,
//         error: error.response?.data?.error || 'Login failed'
//       };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await authAPI.register(userData);
//       const { token, user: newUser } = response.data;

//       console.log('Registration successful, saving token...');
//       await AsyncStorage.setItem('authToken', token);
//       await AsyncStorage.setItem('user', JSON.stringify(newUser));
//       console.log('Token saved to storage');

//       setUser(newUser);
//       setIsAuthenticated(true);

//       // Connect socket
//       await socketService.connect();

//       return { success: true };
//     } catch (error) {
//       console.error('Registration error:', error);
//       return {
//         success: false,
//         error: error.response?.data?.error || 'Registration failed'
//       };
//     }
//   };

//   const logout = async () => {
//     try {
//       await authAPI.logout();
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       await AsyncStorage.removeItem('authToken');
//       await AsyncStorage.removeItem('user');
//       setUser(null);
//       setIsAuthenticated(false);
      
//       // Disconnect socket
//       socketService.disconnect();
//     }
//   };

//   const updateUser = async (updates) => {
//     try {
//       const response = await authAPI.updateProfile(updates);
//       const updatedUser = response.data.user;

//       await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
//       setUser(updatedUser);

//       return { success: true };
//     } catch (error) {
//       console.error('Update user error:', error);
//       return {
//         success: false,
//         error: error.response?.data?.error || 'Update failed'
//       };
//     }
//   };

//   const value = {
//     user,
//     loading,
//     isAuthenticated,
//     login,
//     register,
//     logout,
//     updateUser,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export default AuthContext;


import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../services/api";
import socketService from "../services/socket";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from storage on app start
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const userData = await AsyncStorage.getItem("user");

      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);

        // Connect socket
        await socketService.connect();
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;

      console.log("Login successful, saving token...");
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      console.log("Token saved to storage");

      setUser(userData);
      setIsAuthenticated(true);

      // Connect socket
      await socketService.connect();

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response.data;

      console.log("Registration successful, saving token...");
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
      console.log("Token saved to storage");

      setUser(newUser);
      setIsAuthenticated(true);

      // Connect socket
      await socketService.connect();

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);

      // Disconnect socket
      socketService.disconnect();
    }
  };

  // --- UPDATED FUNCTION ---
  // This now accepts the full user object (returned from the API in EditProfileScreen)
  // and simply syncs it to the local state and storage.
  const updateUser = async (newUserData) => {
    try {
      // 1. Update State
      setUser(newUserData);

      // 2. Update Storage (so changes persist on restart)
      await AsyncStorage.setItem("user", JSON.stringify(newUserData));

      return { success: true };
    } catch (error) {
      console.error("Update local user error:", error);
      return { success: false, error: "Failed to save local changes" };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;