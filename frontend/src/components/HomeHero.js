// UI Component: Hero card with quick incident report and action tiles
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const HomeHero = ({ 
  onReportPress, 
  onAdoptPress, 
  onMarketplacePress, 
  onVolunteerPress,
  userName = 'Friend'
}) => {
  const quickActions = [
    {
      id: 'adopt',
      label: 'Adopt',
      icon: 'paw',
      color: theme.colors.secondary,
      onPress: onAdoptPress,
    },
    {
      id: 'marketplace',
      label: 'Services',
      icon: 'storefront',
      color: theme.colors.primary,
      onPress: onMarketplacePress,
    },
    {
      id: 'volunteer',
      label: 'Help',
      icon: 'heart',
      color: theme.colors.accent,
      onPress: onVolunteerPress,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>Hello, {userName}! 👋</Text>
        <Text style={styles.subtitle}>Let's make a difference today</Text>
      </View>

      {/* Primary CTA - Report Incident */}
      <TouchableOpacity 
        style={styles.primaryCTA}
        onPress={onReportPress}
        activeOpacity={0.85}
      >
        <View style={styles.ctaContent}>
          <View style={styles.ctaIcon}>
            <Ionicons name="camera" size={32} color={theme.colors.white} />
          </View>
          <View style={styles.ctaText}>
            <Text style={styles.ctaTitle}>Report an Incident</Text>
            <Text style={styles.ctaSubtitle}>Help animals in distress nearby</Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color={theme.colors.white} />
        </View>
      </TouchableOpacity>

      {/* Quick Actions Grid */}
      <View style={styles.quickActions}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionTile}
            onPress={action.onPress}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
              <Ionicons name={action.icon} size={24} color={theme.colors.white} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  greeting: {
    marginBottom: theme.spacing.lg,
  },
  greetingText: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  primaryCTA: {
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  ctaIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  ctaSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  actionTile: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.gray50,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
});

export default HomeHero;