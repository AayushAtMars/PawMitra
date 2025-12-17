import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../../theme';

// Placeholder screens - these would be fully implemented in production

export const ReportIncidentScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Report Incident</Text>
    <Text style={styles.subtitle}>Camera integration and AI analysis coming soon</Text>
  </View>
);

export const VolunteerDashboardScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Volunteer Dashboard</Text>
    <Text style={styles.subtitle}>Real-time alerts and tasks coming soon</Text>
  </View>
);

export const AdoptionScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Pet Adoption</Text>
    <Text style={styles.subtitle}>Swipeable pet cards coming soon</Text>
  </View>
);

export const MarketplaceScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Marketplace</Text>
    <Text style={styles.subtitle}>Pet services and shops coming soon</Text>
  </View>
);

export const ProfileScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Profile</Text>
    <Text style={styles.subtitle}>User profile and settings coming soon</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default {
  ReportIncidentScreen,
  VolunteerDashboardScreen,
  AdoptionScreen,
  MarketplaceScreen,
  ProfileScreen,
};
