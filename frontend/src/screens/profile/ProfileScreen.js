import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import theme from '../../theme';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 1,
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: () => Alert.alert('Edit Profile', 'Profile editing coming soon!'),
    },
    {
      id: 2,
      title: 'My Reports',
      icon: 'document-text-outline',
      onPress: () => Alert.alert('My Reports', 'View your incident reports here'),
    },
    {
      id: 3,
      title: 'Saved Pets',
      icon: 'heart-outline',
      onPress: () => Alert.alert('Saved Pets', 'Your saved pets will appear here'),
    },
    {
      id: 4,
      title: 'Add Pet for Adoption',
      icon: 'add-circle-outline',
      onPress: () => navigation.navigate('AddPet'),
      show: user?.role === 'ngo' || user?.role === 'volunteer',
    },
    {
      id: 5,
      title: 'My Pets',
      icon: 'paw-outline',
      onPress: () => navigation.navigate('MyPets'),
      show: user?.role === 'ngo' || user?.role === 'volunteer',
    },
    {
      id: 6,
      title: 'My Services',
      icon: 'briefcase-outline',
      onPress: () => navigation.navigate('MyServices'),
    },
    {
      id: 7,
      title: 'Register Service',
      icon: 'business-outline',
      onPress: () => navigation.navigate('RegisterService'),
    },
    {
      id: 8,
      title: 'Settings',
      icon: 'settings-outline',
      onPress: () => Alert.alert('Settings', 'App settings coming soon!'),
    },
    {
      id: 9,
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => Alert.alert('Help & Support', 'Contact us at support@pawmitra.com'),
    },
    {
      id: 10,
      title: 'About',
      icon: 'information-circle-outline',
      onPress: () => Alert.alert(
        'About PawMitra',
        'PawMitra is a hyperlocal smart network for animal welfare.\n\nVersion 1.0.0\n\nMaking a difference, one paw at a time 🐾'
      ),
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={48} color={theme.colors.gray400} />
            </View>
          )}
          {user?.isVolunteer && (
            <View style={styles.volunteerBadge}>
              <Ionicons name="heart" size={16} color={theme.colors.white} />
            </View>
          )}
        </View>

        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>

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
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.filter(item => item.show !== false).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon} size={24} color={theme.colors.gray600} />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.gray400} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>PawMitra</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
        <Text style={styles.appTagline}>Making a difference, one paw at a time 🐾</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
    marginBottom: theme.spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: theme.colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  volunteerBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.secondary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.white,
  },
  name: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.gray50,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.gray200,
    marginHorizontal: theme.spacing.md,
  },
  menuContainer: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  menuItemText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  logoutText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
  },
  appName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  appVersion: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  appTagline: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});

export default ProfileScreen;
