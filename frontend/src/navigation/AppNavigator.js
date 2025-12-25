// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuth } from '../context/AuthContext';
// import theme from '../theme';

// // Import screens
// import LoginScreen from '../screens/auth/LoginScreen';
// import RegisterScreen from '../screens/auth/RegisterScreen';
// import HomeScreen from '../screens/home/HomeScreen';
// import ReportIncidentScreen from '../screens/incident/ReportIncidentScreen';
// import VolunteerDashboardScreen from '../screens/volunteer/VolunteerDashboardScreen';
// import AdoptionScreen from '../screens/adoption/AdoptionScreen';
// import AddPetScreen from '../screens/adoption/AddPetScreen';
// import MyPetsScreen from '../screens/adoption/MyPetsScreen';
// import MarketplaceScreen from '../screens/marketplace/MarketplaceScreen';
// import RegisterServiceScreen from '../screens/marketplace/RegisterServiceScreen';
// import MyServicesScreen from '../screens/marketplace/MyServicesScreen';
// import ProfileScreen from '../screens/profile/ProfileScreen';

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// // Tab Navigator for main app
// const MainTabs = () => {
//   const { user } = useAuth();
  
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === 'Home') {
//             iconName = focused ? 'home' : 'home-outline';
//           } else if (route.name === 'Report') {
//             iconName = focused ? 'camera' : 'camera-outline';
//           } else if (route.name === 'Volunteer') {
//             iconName = focused ? 'heart' : 'heart-outline';
//           } else if (route.name === 'Adoption') {
//             iconName = focused ? 'paw' : 'paw-outline';
//           } else if (route.name === 'Marketplace') {
//             iconName = focused ? 'storefront' : 'storefront-outline';
//           } else if (route.name === 'Profile') {
//             iconName = focused ? 'person' : 'person-outline';
//           }

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: theme.colors.primary,
//         tabBarInactiveTintColor: theme.colors.gray400,
//         tabBarStyle: {
//           backgroundColor: theme.colors.white,
//           borderTopColor: theme.colors.gray200,
//           paddingBottom: 5,
//           height: 60,
//         },
//         headerShown: false,
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen 
//         name="Report" 
//         component={ReportIncidentScreen}
//         options={{
//           tabBarLabel: 'Report',
//         }}
//       />
//       {user?.isVolunteer && (
//         <Tab.Screen name="Volunteer" component={VolunteerDashboardScreen} />
//       )}
//       <Tab.Screen name="Adoption" component={AdoptionScreen} />
//       <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//     </Tab.Navigator>
//   );
// };

// // Auth Stack
// const AuthStack = () => {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Stack.Screen name="Login" component={LoginScreen} />
//       <Stack.Screen name="Register" component={RegisterScreen} />
//     </Stack.Navigator>
//   );
// };

// // Main App Navigator
// const AppNavigator = () => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return null; // Or a loading screen
//   }

//   return (
//     <NavigationContainer>
//       {isAuthenticated ? (
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="MainTabs" component={MainTabs} />
//           <Stack.Screen 
//             name="AddPet" 
//             component={AddPetScreen}
//             options={{ 
//               headerShown: true,
//               title: 'Add Pet',
//               presentation: 'modal'
//             }}
//           />
//           <Stack.Screen 
//             name="RegisterService" 
//             component={RegisterServiceScreen}
//             options={{ 
//               headerShown: true,
//               title: 'Register Service',
//               presentation: 'modal'
//             }}
//           />
//           <Stack.Screen 
//             name="MyServices" 
//             component={MyServicesScreen}
//             options={{ 
//               headerShown: false,
//               presentation: 'card'
//             }}
//           />
//           <Stack.Screen 
//             name="MyPets" 
//             component={MyPetsScreen}
//             options={{ 
//               headerShown: false,
//               presentation: 'card'
//             }}
//           />
//         </Stack.Navigator>
//       ) : (
//         <AuthStack />
//       )}
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useAuth } from "../context/AuthContext";
import theme from "../theme";

// --- Auth Screens ---
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

// --- Main Tabs ---
import AdoptionScreen from "../screens/adoption/AdoptionScreen";
import HomeScreen from "../screens/home/HomeScreen";
import ReportIncidentScreen from "../screens/incident/ReportIncidentScreen";
import MarketplaceScreen from "../screens/marketplace/MarketplaceScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import VolunteerDashboardScreen from "../screens/volunteer/VolunteerDashboardScreen";

// --- Sub Screens (Adoption & Services) ---
import AddPetScreen from "../screens/adoption/AddPetScreen";
import MyPetsScreen from "../screens/adoption/MyPetsScreen";
import MyServicesScreen from "../screens/marketplace/MyServicesScreen";
import RegisterServiceScreen from "../screens/marketplace/RegisterServiceScreen";

// --- Sub Screens (Incidents) ---
import IncidentDetailsScreen from "../screens/incident/IncidentDetailsScreen";
import AllIncidentsScreen from "../screens/incident/AllIncidentsScreen";

// --- Sub Screens (Profile) ---
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import HelpSupportScreen from "../screens/profile/HelpSupportScreen";
import MyReportsScreen from "../screens/profile/MyReportsScreen";
import SavedPetsScreen from "../screens/profile/SavedPetsScreen";
import SettingsScreen from "../screens/profile/SettingsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for main app
const MainTabs = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Report") {
            iconName = focused ? "camera" : "camera-outline";
          } else if (route.name === "Volunteer") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "Adoption") {
            iconName = focused ? "paw" : "paw-outline";
          } else if (route.name === "Marketplace") {
            iconName = focused ? "storefront" : "storefront-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray400,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.gray200,
          paddingBottom: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Report"
        component={ReportIncidentScreen}
        options={{ tabBarLabel: "Report" }}
      />
      {user?.isVolunteer && <Tab.Screen name="Volunteer" component={VolunteerDashboardScreen} />}
      <Tab.Screen name="Adoption" component={AdoptionScreen} />
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Auth Stack
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      {isAuthenticated
        ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Main Tab Navigation */}
            <Stack.Screen name="MainTabs" component={MainTabs} />

            {/* Adoption Flow */}
            <Stack.Screen
              name="AddPet"
              component={AddPetScreen}
              options={{
                headerShown: true,
                title: "Add Pet",
                presentation: "modal",
              }}
            />
            <Stack.Screen name="MyPets" component={MyPetsScreen} />

            {/* Marketplace Flow */}
            <Stack.Screen
              name="RegisterService"
              component={RegisterServiceScreen}
              options={{
                headerShown: true,
                title: "Register Service",
                presentation: "modal",
              }}
            />
            <Stack.Screen name="MyServices" component={MyServicesScreen} />

            {/* Profile Flow */}
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="MyReports" component={MyReportsScreen} />
            <Stack.Screen name="SavedPets" component={SavedPetsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          </Stack.Navigator>
        )
        : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;