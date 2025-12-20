import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { incidentsAPI, petsAPI, volunteersAPI } from '../../services/api';
import theme from '../../theme';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalIncidents: 0,
    activeIncidents: 0,
    petsAvailable: 0,
    volunteersActive: 0,
  });
  const [recentIncidents, setRecentIncidents] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics and recent data
      const [incidentsRes, petsRes, volunteersRes] = await Promise.all([
        incidentsAPI.getAll({ limit: 5 }),
        petsAPI.getAll({ status: 'available', limit: 3 }),
        volunteersAPI.getStats().catch(() => ({ data: { activeVolunteers: 0 } })),
      ]);

      setStats({
        totalIncidents: incidentsRes.data.total || 0,
        activeIncidents: incidentsRes.data.incidents?.filter(i => i.status === 'reported').length || 0,
        petsAvailable: petsRes.data.pets?.length || 0,
        volunteersActive: volunteersRes.data.activeVolunteers || 0,
      });

      setRecentIncidents(incidentsRes.data.incidents || []);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const quickActions = [
    {
      id: 1,
      title: 'Report Incident',
      icon: 'camera',
      color: theme.colors.error,
      onPress: () => navigation.navigate('Report'),
    },
    {
      id: 2,
      title: 'Find Pet',
      icon: 'paw',
      color: theme.colors.secondary,
      onPress: () => navigation.navigate('Adoption'),
    },
    {
      id: 3,
      title: 'Services',
      icon: 'storefront',
      color: theme.colors.primary,
      onPress: () => navigation.navigate('Marketplace'),
    },
    {
      id: 4,
      title: 'Volunteer',
      icon: 'heart',
      color: theme.colors.accent,
      onPress: () => user?.isVolunteer 
        ? navigation.navigate('Volunteer')
        : navigation.navigate('Profile'),
    },
  ];

  const renderStatCard = (title, value, icon, color) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{title}</Text>
      </View>
    </View>
  );

  const renderIncidentCard = (incident) => (
    <TouchableOpacity
      key={incident._id}
      style={styles.incidentCard}
      onPress={() => {/* Navigate to incident details */}}
    >
      <View style={[styles.priorityBadge, { 
        backgroundColor: incident.priority === 'high' 
          ? theme.colors.error 
          : incident.priority === 'medium'
          ? theme.colors.warning
          : theme.colors.success
      }]}>
        <Text style={styles.priorityText}>{incident.priority?.toUpperCase()}</Text>
      </View>
      <Text style={styles.incidentType}>{incident.animalType || 'Animal'} in distress</Text>
      <Text style={styles.incidentLocation} numberOfLines={1}>
        <Ionicons name="location" size={12} color={theme.colors.textSecondary} />
        {' '}{incident.address || 'Location not available'}
      </Text>
      <Text style={styles.incidentTime}>
        {new Date(incident.createdAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Friend'}! 👋</Text>
          <Text style={styles.subtitle}>Making a difference together</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color={theme.colors.white} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionButton}
              onPress={action.onPress}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon} size={28} color={theme.colors.white} />
              </View>
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Community Impact</Text>
        <View style={styles.statsGrid}>
          {renderStatCard('Active Incidents', stats.activeIncidents, 'alert-circle', theme.colors.error)}
          {renderStatCard('Pets Available', stats.petsAvailable, 'paw', theme.colors.secondary)}
          {renderStatCard('Active Volunteers', stats.volunteersActive, 'people', theme.colors.primary)}
          {renderStatCard('Total Reports', stats.totalIncidents, 'document-text', theme.colors.accent)}
        </View>
      </View>

      {/* Recent Incidents */}
      {recentIncidents.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Incidents</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Report')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentIncidents.map(renderIncidentCard)}
        </View>
      )}

      {/* Community Message */}
      <View style={styles.communityCard}>
        <Ionicons name="heart" size={32} color={theme.colors.secondary} />
        <Text style={styles.communityTitle}>Thank you for being a PawMitra!</Text>
        <Text style={styles.communityText}>
          Together we've helped countless animals find safety and homes.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  greeting: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  seeAll: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
  },
  statsGrid: {
    gap: theme.spacing.md,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderLeftWidth: 4,
    ...theme.shadows.sm,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  incidentCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  priorityText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.bold,
  },
  incidentType: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  incidentLocation: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  incidentTime: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  communityCard: {
    backgroundColor: theme.colors.secondary + '10',
    margin: theme.spacing.lg,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  communityTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  communityText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen;
