import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { volunteersAPI, incidentsAPI } from '../../services/api';
import socketService from '../../services/socket';
import { formatDistance, calculateDistance } from '../../utils/geolocation';
import theme from '../../theme';

const VolunteerDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [nearbyIncidents, setNearbyIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    loadData();
    setupSocketListeners();

    return () => {
      socketService.off('new_incident_alert');
      socketService.off('task_assigned');
    };
  }, []);

  const setupSocketListeners = () => {
    // Listen for new incident alerts
    socketService.on('new_incident_alert', (data) => {
      Alert.alert(
        '🚨 New Incident Alert',
        `${data.incident.category} - ${data.incident.priority} priority\n${data.incident.address}`,
        [
          { text: 'Ignore', style: 'cancel' },
          { text: 'View', onPress: () => loadNearbyIncidents() },
        ]
      );
    });

    // Listen for task assignments
    socketService.on('task_assigned', (data) => {
      Alert.alert(
        '✅ Task Assigned',
        'You have been assigned to an incident. Check your tasks.',
        [{ text: 'OK', onPress: () => loadData() }]
      );
    });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadStats(),
        loadTasks(),
        loadNearbyIncidents(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await volunteersAPI.getStats();
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const response = await incidentsAPI.getAll({
        status: 'volunteer_assigned,in_progress',
        limit: 20,
      });
      if (response.data.success) {
        // Filter tasks assigned to current user
        const myTasks = response.data.incidents.filter(incident =>
          incident.assignedVolunteers?.some(av => av.volunteer._id === user.id)
        );
        setTasks(myTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const loadNearbyIncidents = async () => {
    try {
      if (user.location) {
        const response = await incidentsAPI.getNearby({
          longitude: user.location.coordinates[0],
          latitude: user.location.coordinates[1],
          maxDistance: 2000, // 2km
        });
        if (response.data.success) {
          setNearbyIncidents(response.data.incidents);
        }
      }
    } catch (error) {
      console.error('Error loading nearby incidents:', error);
    }
  };

  const handleAcceptTask = async (incidentId) => {
    try {
      const response = await volunteersAPI.acceptTask({ incidentId });
      if (response.data.success) {
        Alert.alert('Success', 'Task accepted! Good luck!');
        loadData();
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to accept task');
    }
  };

  const handleCompleteTask = async (incidentId) => {
    Alert.alert(
      'Complete Task',
      'Have you completed this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              const response = await volunteersAPI.completeTask({
                incidentId,
                notes: 'Task completed via mobile app',
              });
              if (response.data.success) {
                Alert.alert(
                  '🎉 Task Completed!',
                  `You earned ${response.data.karmaEarned} karma points!\nTotal Karma: ${response.data.totalKarma}`,
                  [{ text: 'Awesome!', onPress: () => loadData() }]
                );
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to complete task');
            }
          },
        },
      ]
    );
  };

  const toggleAvailability = () => {
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
    socketService.toggleAvailability(newStatus);
    Alert.alert(
      newStatus ? 'You are now available' : 'You are now unavailable',
      newStatus ? 'You will receive incident alerts' : 'You will not receive alerts'
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

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
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Volunteer Dashboard</Text>
          <Text style={styles.subtitle}>Making a difference 💝</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.availabilityButton,
            isAvailable ? styles.availableButton : styles.unavailableButton,
          ]}
          onPress={toggleAvailability}
        >
          <Ionicons
            name={isAvailable ? 'checkmark-circle' : 'close-circle'}
            size={20}
            color={theme.colors.white}
          />
          <Text style={styles.availabilityText}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={32} color={theme.colors.primary} />
            <Text style={styles.statValue}>{stats.karmaPoints}</Text>
            <Text style={styles.statLabel}>Karma Points</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="checkmark-done" size={32} color={theme.colors.accent} />
            <Text style={styles.statValue}>{stats.completedTasks}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time" size={32} color={theme.colors.warning} />
            <Text style={styles.statValue}>{stats.activeTasks}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
        </View>
      )}

      {/* Badges */}
      {stats?.badges && stats.badges.length > 0 && (
        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>🏆 Your Badges</Text>
          <View style={styles.badgesContainer}>
            {stats.badges.map((badge, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Active Tasks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Your Tasks ({tasks.length})</Text>
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={48} color={theme.colors.gray300} />
            <Text style={styles.emptyText}>No active tasks</Text>
            <Text style={styles.emptySubtext}>Check nearby incidents below</Text>
          </View>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onComplete={() => handleCompleteTask(task._id)}
            />
          ))
        )}
      </View>

      {/* Nearby Incidents */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          🚨 Nearby Incidents ({nearbyIncidents.length})
        </Text>
        {nearbyIncidents.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="location" size={48} color={theme.colors.gray300} />
            <Text style={styles.emptyText}>No nearby incidents</Text>
            <Text style={styles.emptySubtext}>Great! All clear in your area</Text>
          </View>
        ) : (
          nearbyIncidents.map((incident) => (
            <IncidentCard
              key={incident._id}
              incident={incident}
              userLocation={user.location}
              onAccept={() => handleAcceptTask(incident._id)}
            />
          ))
        )}
      </View>

      {/* Leaderboard Link */}
      <TouchableOpacity
        style={styles.leaderboardButton}
        onPress={() => navigation.navigate('Leaderboard')}
      >
        <Ionicons name="podium" size={24} color={theme.colors.primary} />
        <Text style={styles.leaderboardText}>View Leaderboard</Text>
        <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
    </ScrollView>
  );
};

// Task Card Component
const TaskCard = ({ task, onComplete }) => {
  const assignment = task.assignedVolunteers?.find(av => av.status === 'accepted');

  return (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={[
          styles.priorityBadge,
          { backgroundColor: getPriorityColor(task.aiAnalysis?.priority) }
        ]}>
          <Text style={styles.priorityText}>
            {task.aiAnalysis?.priority?.toUpperCase() || 'UNKNOWN'}
          </Text>
        </View>
        <Text style={styles.taskTime}>
          {new Date(task.createdAt).toLocaleTimeString()}
        </Text>
      </View>

      <Text style={styles.taskCategory}>
        {task.aiAnalysis?.category?.replace('_', ' ').toUpperCase() || 'Incident'}
      </Text>
      <Text style={styles.taskAddress}>{task.address}</Text>

      {assignment?.status === 'accepted' && (
        <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
          <Ionicons name="checkmark-circle" size={20} color={theme.colors.white} />
          <Text style={styles.completeButtonText}>Mark as Complete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Incident Card Component
const IncidentCard = ({ incident, userLocation, onAccept }) => {
  const distance = userLocation
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        incident.location.coordinates[1],
        incident.location.coordinates[0]
      )
    : null;

  return (
    <View style={styles.incidentCard}>
      <View style={styles.incidentHeader}>
        <View style={[
          styles.priorityBadge,
          { backgroundColor: getPriorityColor(incident.aiAnalysis?.priority) }
        ]}>
          <Text style={styles.priorityText}>
            {incident.aiAnalysis?.priority?.toUpperCase() || 'UNKNOWN'}
          </Text>
        </View>
        {distance && (
          <Text style={styles.distanceText}>{formatDistance(distance)} away</Text>
        )}
      </View>

      <Text style={styles.incidentCategory}>
        {incident.aiAnalysis?.category?.replace('_', ' ').toUpperCase() || 'Incident'}
      </Text>
      <Text style={styles.incidentAddress}>{incident.address}</Text>
      <Text style={styles.incidentTime}>
        Reported {new Date(incident.createdAt).toLocaleString()}
      </Text>

      <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
        <Ionicons name="hand-right" size={20} color={theme.colors.white} />
        <Text style={styles.acceptButtonText}>Accept Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return theme.colors.priorityHigh;
    case 'medium':
      return theme.colors.priorityMedium;
    case 'low':
      return theme.colors.priorityLow;
    default:
      return theme.colors.gray500;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  availabilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.xs,
  },
  availableButton: {
    backgroundColor: theme.colors.accent,
  },
  unavailableButton: {
    backgroundColor: theme.colors.gray500,
  },
  availabilityText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  badgesSection: {
    marginBottom: theme.spacing.xl,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  badge: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    minWidth: 80,
    ...theme.shadows.sm,
  },
  badgeIcon: {
    fontSize: 32,
  },
  badgeName: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  emptyState: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xxl,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  taskCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  priorityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  priorityText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  taskTime: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  taskCategory: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  taskAddress: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  completeButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  incidentCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  distanceText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  incidentCategory: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  incidentAddress: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  incidentTime: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  acceptButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  leaderboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    ...theme.shadows.md,
  },
  leaderboardText: {
    flex: 1,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary,
  },
});

export default VolunteerDashboardScreen;
