// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuth } from '../../context/AuthContext';
// import theme from '../../theme';

// const ProfileScreen = ({ navigation }) => {
//   const { user, logout } = useAuth();

//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await logout();
//             } catch (error) {
//               console.error('Logout error:', error);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const menuItems = [
//     {
//       id: 1,
//       title: 'Edit Profile',
//       icon: 'person-outline',
//       onPress: () => Alert.alert('Edit Profile', 'Profile editing coming soon!'),
//     },
//     {
//       id: 2,
//       title: 'My Reports',
//       icon: 'document-text-outline',
//       onPress: () => Alert.alert('My Reports', 'View your incident reports here'),
//     },
//     {
//       id: 3,
//       title: 'Saved Pets',
//       icon: 'heart-outline',
//       onPress: () => Alert.alert('Saved Pets', 'Your saved pets will appear here'),
//     },
//     {
//       id: 4,
//       title: 'Add Pet for Adoption',
//       icon: 'add-circle-outline',
//       onPress: () => navigation.navigate('AddPet'),
//       show: user?.role === 'ngo' || user?.role === 'volunteer',
//     },
//     {
//       id: 5,
//       title: 'My Pets',
//       icon: 'paw-outline',
//       onPress: () => navigation.navigate('MyPets'),
//       show: user?.role === 'ngo' || user?.role === 'volunteer',
//     },
//     {
//       id: 6,
//       title: 'My Services',
//       icon: 'briefcase-outline',
//       onPress: () => navigation.navigate('MyServices'),
//     },
//     {
//       id: 7,
//       title: 'Register Service',
//       icon: 'business-outline',
//       onPress: () => navigation.navigate('RegisterService'),
//     },
//     {
//       id: 8,
//       title: 'Settings',
//       icon: 'settings-outline',
//       onPress: () => Alert.alert('Settings', 'App settings coming soon!'),
//     },
//     {
//       id: 9,
//       title: 'Help & Support',
//       icon: 'help-circle-outline',
//       onPress: () => Alert.alert('Help & Support', 'Contact us at support@pawmitra.com'),
//     },
//     {
//       id: 10,
//       title: 'About',
//       icon: 'information-circle-outline',
//       onPress: () => Alert.alert(
//         'About PawMitra',
//         'PawMitra is a hyperlocal smart network for animal welfare.\n\nVersion 1.0.0\n\nMaking a difference, one paw at a time 🐾'
//       ),
//     },
//   ];

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
//       {/* Profile Header */}
//       <View style={styles.header}>
//         <View style={styles.avatarContainer}>
//           {user?.avatar ? (
//             <Image source={{ uri: user.avatar }} style={styles.avatar} />
//           ) : (
//             <View style={[styles.avatar, styles.avatarPlaceholder]}>
//               <Ionicons name="person" size={48} color={theme.colors.gray400} />
//             </View>
//           )}
//           {user?.isVolunteer && (
//             <View style={styles.volunteerBadge}>
//               <Ionicons name="heart" size={16} color={theme.colors.white} />
//             </View>
//           )}
//         </View>

//         <Text style={styles.name}>{user?.name || 'User'}</Text>
//         <Text style={styles.email}>{user?.email || ''}</Text>

//         {user?.isVolunteer && user?.volunteerData && (
//           <View style={styles.statsContainer}>
//             <View style={styles.statItem}>
//               <Text style={styles.statValue}>{user.volunteerData.karmaPoints || 0}</Text>
//               <Text style={styles.statLabel}>Karma</Text>
//             </View>
//             <View style={styles.statDivider} />
//             <View style={styles.statItem}>
//               <Text style={styles.statValue}>{user.volunteerData.tasksCompleted || 0}</Text>
//               <Text style={styles.statLabel}>Tasks</Text>
//             </View>
//             <View style={styles.statDivider} />
//             <View style={styles.statItem}>
//               <Text style={styles.statValue}>{user.volunteerData.badges?.length || 0}</Text>
//               <Text style={styles.statLabel}>Badges</Text>
//             </View>
//           </View>
//         )}
//       </View>

//       {/* Menu Items */}
//       <View style={styles.menuContainer}>
//         {menuItems.filter(item => item.show !== false).map((item) => (
//           <TouchableOpacity
//             key={item.id}
//             style={styles.menuItem}
//             onPress={item.onPress}
//           >
//             <View style={styles.menuItemLeft}>
//               <Ionicons name={item.icon} size={24} color={theme.colors.gray600} />
//               <Text style={styles.menuItemText}>{item.title}</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={24} color={theme.colors.gray400} />
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Logout Button */}
//       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//         <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>

//       {/* App Info */}
//       <View style={styles.appInfo}>
//         <Text style={styles.appName}>PawMitra</Text>
//         <Text style={styles.appVersion}>Version 1.0.0</Text>
//         <Text style={styles.appTagline}>Making a difference, one paw at a time 🐾</Text>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   scrollContent: {
//     paddingBottom: theme.spacing.xxl,
//   },
//   header: {
//     backgroundColor: theme.colors.white,
//     alignItems: 'center',
//     paddingVertical: theme.spacing.xxl,
//     marginBottom: theme.spacing.lg,
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginBottom: theme.spacing.md,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   avatarPlaceholder: {
//     backgroundColor: theme.colors.gray200,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   volunteerBadge: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: theme.colors.secondary,
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: theme.colors.white,
//   },
//   name: {
//     fontSize: theme.typography.fontSize.xxl,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.textPrimary,
//     marginBottom: theme.spacing.xs,
//   },
//   email: {
//     fontSize: theme.typography.fontSize.md,
//     color: theme.colors.textSecondary,
//     marginBottom: theme.spacing.lg,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     backgroundColor: theme.colors.gray50,
//     borderRadius: theme.borderRadius.lg,
//     padding: theme.spacing.md,
//     marginTop: theme.spacing.md,
//   },
//   statItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statValue: {
//     fontSize: theme.typography.fontSize.xl,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.primary,
//   },
//   statLabel: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textSecondary,
//     marginTop: theme.spacing.xs,
//   },
//   statDivider: {
//     width: 1,
//     backgroundColor: theme.colors.gray200,
//     marginHorizontal: theme.spacing.md,
//   },
//   menuContainer: {
//     backgroundColor: theme.colors.white,
//     marginHorizontal: theme.spacing.lg,
//     borderRadius: theme.borderRadius.lg,
//     overflow: 'hidden',
//     ...theme.shadows.sm,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: theme.spacing.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.gray100,
//   },
//   menuItemLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: theme.spacing.md,
//   },
//   menuItemText: {
//     fontSize: theme.typography.fontSize.md,
//     color: theme.colors.textPrimary,
//     fontWeight: theme.typography.fontWeight.medium,
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: theme.colors.white,
//     marginHorizontal: theme.spacing.lg,
//     marginTop: theme.spacing.lg,
//     padding: theme.spacing.lg,
//     borderRadius: theme.borderRadius.lg,
//     gap: theme.spacing.sm,
//     ...theme.shadows.sm,
//   },
//   logoutText: {
//     fontSize: theme.typography.fontSize.md,
//     color: theme.colors.error,
//     fontWeight: theme.typography.fontWeight.semibold,
//   },
//   appInfo: {
//     alignItems: 'center',
//     marginTop: theme.spacing.xxl,
//     paddingHorizontal: theme.spacing.lg,
//   },
//   appName: {
//     fontSize: theme.typography.fontSize.lg,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.primary,
//   },
//   appVersion: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textSecondary,
//     marginTop: theme.spacing.xs,
//   },
//   appTagline: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textSecondary,
//     marginTop: theme.spacing.sm,
//     textAlign: 'center',
//   },
// });

// export default ProfileScreen;

// import { Ionicons } from "@expo/vector-icons";
// import React from "react";
// import {
//   Alert,
//   Image,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useAuth } from "../../context/AuthContext";
// import theme from "../../theme";

// const ProfileScreen = ({ navigation }) => {
//   const { user, logout } = useAuth();

//   const handleLogout = async () => {
//     Alert.alert(
//       "Logout",
//       "Are you sure you want to logout?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Logout",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await logout();
//             } catch (error) {
//               console.error("Logout error:", error);
//             }
//           },
//         },
//       ],
//     );
//   };

//   const menuItems = [
//     {
//       id: 1,
//       title: "Edit Profile",
//       icon: "person-outline",
//       onPress: () => navigation.navigate("EditProfile"), // Updated
//     },
//     {
//       id: 2,
//       title: "My Reports",
//       icon: "document-text-outline",
//       onPress: () => navigation.navigate("MyReports"), // Updated
//     },
//     {
//       id: 3,
//       title: "Saved Pets",
//       icon: "heart-outline",
//       onPress: () => navigation.navigate("SavedPets"), // Updated
//     },
//     {
//       id: 4,
//       title: "Add Pet for Adoption",
//       icon: "add-circle-outline",
//       onPress: () => navigation.navigate("AddPet"),
//       show: user?.role === "ngo" || user?.role === "volunteer",
//     },
//     {
//       id: 5,
//       title: "My Pets",
//       icon: "paw-outline",
//       onPress: () => navigation.navigate("MyPets"),
//       show: user?.role === "ngo" || user?.role === "volunteer",
//     },
//     {
//       id: 6,
//       title: "My Services",
//       icon: "briefcase-outline",
//       onPress: () => navigation.navigate("MyServices"),
//     },
//     {
//       id: 7,
//       title: "Register Service",
//       icon: "business-outline",
//       onPress: () => navigation.navigate("RegisterService"),
//     },
//     {
//       id: 8,
//       title: "Settings",
//       icon: "settings-outline",
//       onPress: () => navigation.navigate("Settings"), // Updated
//     },
//     {
//       id: 9,
//       title: "Help & Support",
//       icon: "help-circle-outline",
//       onPress: () => navigation.navigate("HelpSupport"), // Updated
//     },
//     {
//       id: 10,
//       title: "About",
//       icon: "information-circle-outline",
//       onPress: () =>
//         Alert.alert(
//           "About PawMitra",
//           "PawMitra is a hyperlocal smart network for animal welfare.\n\nVersion 1.0.0\n\nMaking a difference, one paw at a time 🐾",
//         ),
//     },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Profile Header */}
//         <View style={styles.header}>
//           <View style={styles.avatarContainer}>
//             {user?.avatar
//               ? <Image source={{ uri: user.avatar }} style={styles.avatar} />
//               : (
//                 <View style={[styles.avatar, styles.avatarPlaceholder]}>
//                   <Ionicons name="person" size={48} color={theme.colors.gray400} />
//                 </View>
//               )}
//             {user?.isVolunteer && (
//               <View style={styles.volunteerBadge}>
//                 <Ionicons name="heart" size={16} color={theme.colors.white} />
//               </View>
//             )}
//           </View>

//           <Text style={styles.name}>{user?.name || "User"}</Text>
//           <Text style={styles.email}>{user?.email || ""}</Text>

//           {user?.isVolunteer && user?.volunteerData && (
//             <View style={styles.statsContainer}>
//               <View style={styles.statItem}>
//                 <Text style={styles.statValue}>{user.volunteerData.karmaPoints || 0}</Text>
//                 <Text style={styles.statLabel}>Karma</Text>
//               </View>
//               <View style={styles.statDivider} />
//               <View style={styles.statItem}>
//                 <Text style={styles.statValue}>{user.volunteerData.tasksCompleted || 0}</Text>
//                 <Text style={styles.statLabel}>Tasks</Text>
//               </View>
//               <View style={styles.statDivider} />
//               <View style={styles.statItem}>
//                 <Text style={styles.statValue}>{user.volunteerData.badges?.length || 0}</Text>
//                 <Text style={styles.statLabel}>Badges</Text>
//               </View>
//             </View>
//           )}
//         </View>

//         {/* Menu Items */}
//         <View style={styles.menuContainer}>
//           {menuItems.filter(item => item.show !== false).map((item) => (
//             <TouchableOpacity
//               key={item.id}
//               style={styles.menuItem}
//               onPress={item.onPress}
//             >
//               <View style={styles.menuItemLeft}>
//                 <View style={styles.iconBox}>
//                   <Ionicons name={item.icon} size={22} color={theme.colors.primary} />
//                 </View>
//                 <Text style={styles.menuItemText}>{item.title}</Text>
//               </View>
//               <Ionicons name="chevron-forward" size={20} color={theme.colors.gray400} />
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Logout Button */}
//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>

//         {/* App Info */}
//         <View style={styles.appInfo}>
//           <Text style={styles.appName}>PawMitra</Text>
//           <Text style={styles.appVersion}>Version 1.0.0</Text>
//           <Text style={styles.appTagline}>Making a difference, one paw at a time 🐾</Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },
//   scrollContent: {
//     paddingBottom: theme.spacing.xxl,
//   },
//   header: {
//     backgroundColor: theme.colors.white,
//     alignItems: "center",
//     paddingVertical: 32,
//     marginBottom: 20,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   avatarContainer: {
//     position: "relative",
//     marginBottom: theme.spacing.md,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 4,
//     borderColor: "#F3F4F6",
//   },
//   avatarPlaceholder: {
//     backgroundColor: theme.colors.gray200,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   volunteerBadge: {
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//     backgroundColor: theme.colors.secondary,
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 3,
//     borderColor: theme.colors.white,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: theme.colors.textPrimary,
//     marginBottom: 4,
//   },
//   email: {
//     fontSize: 14,
//     color: theme.colors.textSecondary,
//     marginBottom: 24,
//   },
//   statsContainer: {
//     flexDirection: "row",
//     backgroundColor: "#F9FAFB",
//     borderRadius: 20,
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//     width: "85%",
//     justifyContent: "space-between",
//   },
//   statItem: {
//     alignItems: "center",
//     flex: 1,
//   },
//   statValue: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: theme.colors.textPrimary,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: theme.colors.textSecondary,
//     marginTop: 4,
//     fontWeight: "500",
//   },
//   statDivider: {
//     width: 1,
//     height: "80%",
//     backgroundColor: theme.colors.gray200,
//     alignSelf: "center",
//   },
//   menuContainer: {
//     backgroundColor: theme.colors.white,
//     marginHorizontal: 16,
//     borderRadius: 20,
//     overflow: "hidden",
//     paddingVertical: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 2,
//   },
//   menuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   menuItemLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 14,
//   },
//   iconBox: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: "#F0F9FF",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   menuItemText: {
//     fontSize: 16,
//     color: theme.colors.textPrimary,
//     fontWeight: "500",
//   },
//   logoutButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: theme.colors.white,
//     marginHorizontal: 16,
//     marginTop: 20,
//     padding: 16,
//     borderRadius: 20,
//     gap: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 2,
//   },
//   logoutText: {
//     fontSize: 16,
//     color: theme.colors.error,
//     fontWeight: "600",
//   },
//   appInfo: {
//     alignItems: "center",
//     marginTop: 30,
//     paddingHorizontal: 20,
//   },
//   appName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: theme.colors.primary,
//   },
//   appVersion: {
//     fontSize: 12,
//     color: theme.colors.textSecondary,
//     marginTop: 4,
//   },
//   appTagline: {
//     fontSize: 12,
//     color: theme.colors.textSecondary,
//     marginTop: 4,
//     textAlign: "center",
//     fontStyle: "italic",
//   },
// });

// export default ProfileScreen;



import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import theme from "../../theme";

// Local Aesthetic Colors
const colors = {
  sage: "#5F8D75",
  sageLight: "#E8F1EC",
  offWhite: "#F8F9FA",
  textDark: "#222222",
  textGrey: "#666666",
  white: "#FFFFFF",
  error: "#FF6B6B",
};

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error("Logout error:", error);
            }
          },
        },
      ],
    );
  };

  const menuItems = [
    {
      id: 1,
      title: "Edit Profile",
      icon: "person-outline",
      onPress: () => navigation.navigate("EditProfile"),
    },
    {
      id: 2,
      title: "My Reports",
      icon: "document-text-outline",
      onPress: () => navigation.navigate("MyReports"),
    },
    {
      id: 3,
      title: "Saved Pets",
      icon: "heart-outline",
      onPress: () => navigation.navigate("SavedPets"),
    },
    {
      id: 4,
      title: "Add Pet for Adoption",
      icon: "add-circle-outline",
      onPress: () => navigation.navigate("AddPet"),
      show: user?.role === "ngo" || user?.role === "volunteer",
    },
    {
      id: 5,
      title: "My Pets",
      icon: "paw-outline",
      onPress: () => navigation.navigate("MyPets"),
      show: user?.role === "ngo" || user?.role === "volunteer",
    },
    {
      id: 6,
      title: "My Services",
      icon: "briefcase-outline",
      onPress: () => navigation.navigate("MyServices"),
    },
    {
      id: 7,
      title: "Register Service",
      icon: "business-outline",
      onPress: () => navigation.navigate("RegisterService"),
    },
    
    {
      id: 9,
      title: "Help & Support",
      icon: "help-circle-outline",
      onPress: () => navigation.navigate("HelpSupport"),
    },
    {
      id: 10,
      title: "About",
      icon: "information-circle-outline",
      onPress: () =>
        Alert.alert(
          "About PawMitra",
          "PawMitra is a hyperlocal smart network for animal welfare.\n\nVersion 1.0.0\n\nMaking a difference, one paw at a time 🐾",
        ),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.sage} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Aesthetic Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={48} color={colors.sage} />
              </View>
            )}
            {user?.isVolunteer && (
              <View style={styles.volunteerBadge}>
                <Ionicons name="heart" size={14} color={colors.white} />
              </View>
            )}
          </View>

          <Text style={styles.name}>{user?.name || "User"}</Text>
          <Text style={styles.email}>{user?.email || ""}</Text>
        </View>

        {/* Floating Stats Card */}
        {user?.isVolunteer && user?.volunteerData && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.volunteerData.karmaPoints || 0}</Text>
              <Text style={styles.statLabel}>Karma</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.volunteerData.tasksCompleted || 0}</Text>
              <Text style={styles.statLabel}>Tasks</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.volunteerData.badges?.length || 0}</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View style={[styles.menuContainer, !user?.isVolunteer && { marginTop: -20 }]}>
          {menuItems.filter((item) => item.show !== false).map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconBox}>
                  <Ionicons name={item.icon} size={20} color={colors.sage} />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textGrey} style={{ opacity: 0.5 }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>PawMitra</Text>
          <Text style={styles.appVersion}>v1.0.0</Text>
          <Text style={styles.appTagline}>Making a difference, one paw at a time 🐾</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // --- HEADER STYLES ---
  header: {
    backgroundColor: colors.sage,
    alignItems: "center",
    paddingTop: Platform.OS === 'android' ? 60 : 60,
    paddingBottom: 50, // Space for the floating stats card
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
    shadowColor: "#000",
   
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: colors.white,
  },
  avatarPlaceholder: {
    backgroundColor: colors.sageLight,
    justifyContent: "center",
    alignItems: "center",
  },
  volunteerBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.error, // Red badge stands out on green
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.white,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  email: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },

  // --- FLOATING STATS ---
  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    width: "88%",
    alignSelf: "center",
    marginTop: -35, // Negative margin to overlap
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 10,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textDark,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textGrey,
    marginTop: 4,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: "60%",
    backgroundColor: "#EEE",
    alignSelf: "center",
  },

  // --- MENU STYLES ---
  menuContainer: {
    marginTop: 24, // Space from stats
    marginHorizontal: 20,
    gap: 12, // Gap between items (aesthetic separation)
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.sageLight,
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 15,
    color: colors.textDark,
    fontWeight: "600",
  },

  // --- LOGOUT & INFO ---
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F0",
    marginHorizontal: 20,
    marginTop: 30,
    padding: 16,
    borderRadius: 20,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: "700",
  },
  appInfo: {
    alignItems: "center",
    marginTop: 40,
    opacity: 0.6,
  },
  appName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.sage,
  },
  appVersion: {
    fontSize: 12,
    color: colors.textGrey,
    marginTop: 2,
  },
  appTagline: {
    fontSize: 12,
    color: colors.textGrey,
    marginTop: 6,
    fontStyle: "italic",
  },
});

export default ProfileScreen;