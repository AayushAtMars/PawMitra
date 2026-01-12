import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { volunteersAPI, incidentsAPI, authAPI } from '../../services/api';
import theme from '../../theme';

const VolunteerDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [stats, setStats] = useState({
    karmaPoints: 0,
    tasksCompleted: 0,
    badges: [],
  });
  const [activeTasks, setActiveTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [taskFilter, setTaskFilter] = useState('my'); // 'my' or 'available'

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [userProfileRes, tasksRes, leaderboardRes] = await Promise.all([
        authAPI.getProfile(), // Get current user's profile with volunteer data
        incidentsAPI.getAll({ limit: 50 }), // Fetch all incidents like Home screen
        volunteersAPI.getLeaderboard({ limit: 10 }),
      ]);

      // Extract volunteer data from user profile
      const volunteerData = userProfileRes.data.user.volunteerData || {};
      const karmaPoints = volunteerData.karmaPoints || 0;
      const tasksCompleted = volunteerData.tasksCompleted || 0;
      
      // Calculate badges based on karma points
      const badges = [];
      if (karmaPoints >= 10) badges.push({ name: 'Beginner Helper', icon: '🌱' });
      if (karmaPoints >= 50) badges.push({ name: 'Active Volunteer', icon: '⭐' });
      if (karmaPoints >= 100) badges.push({ name: 'Hero', icon: '🦸' });
      if (karmaPoints >= 250) badges.push({ name: 'Legend', icon: '👑' });
      if (tasksCompleted >= 5) badges.push({ name: 'Dedicated', icon: '💪' });
      if (tasksCompleted >= 20) badges.push({ name: 'Champion', icon: '🏆' });
      
      setStats({
        karmaPoints,
        tasksCompleted,
        badges
      });
      
      const allIncidents = tasksRes.data.incidents || [];
      
      // Filter my tasks (where I'm assigned AND not resolved)
      const myTasks = allIncidents.filter(incident => {
        // Exclude resolved incidents
        if (incident.status === 'resolved') {
          return false;
        }
        
        // Check if assignedVolunteers exists and has entries
        if (!incident.assignedVolunteers || incident.assignedVolunteers.length === 0) {
          return false;
        }
        
        // Check if current user is in the assigned volunteers
        return incident.assignedVolunteers.some(av => {
          const volunteerId = av.volunteer?._id || av.volunteer;
          return volunteerId === user.id || volunteerId?.toString() === user.id;
        });
      });
      
      // Filter available tasks (not assigned to anyone OR not assigned to me, and not resolved)
      const available = allIncidents.filter(incident => {
        // Exclude resolved incidents
        if (incident.status === 'resolved') {
          return false;
        }
        
        // If no assignedVolunteers or empty array, it's available
        if (!incident.assignedVolunteers || incident.assignedVolunteers.length === 0) {
          return true;
        }
        
        // If has assigned volunteers, check if current user is NOT in the list
        const isAssignedToMe = incident.assignedVolunteers.some(av => {
          const volunteerId = av.volunteer?._id || av.volunteer;
          return volunteerId === user.id || volunteerId?.toString() === user.id;
        });
        
        return !isAssignedToMe;
      });
      
      setActiveTasks(myTasks);
      setAvailableTasks(available);
      setLeaderboard(leaderboardRes.data.volunteers || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleToggleAvailability = async () => {
    try {
      await volunteersAPI.updateProfile({ isAvailable: !isAvailable });
      setIsAvailable(!isAvailable);
      Alert.alert('Success', `You are now ${!isAvailable ? 'available' : 'unavailable'} for tasks`);
    } catch (error) {
      console.error('Error updating availability:', error);
      Alert.alert('Error', 'Failed to update availability');
    }
  };

  const handleAcceptTask = async (task) => {
    try {
      const response = await incidentsAPI.acceptTask(task._id);
      Alert.alert('Success! 🎉', 'Task accepted! Good luck helping the animal!');
      loadDashboardData();
    } catch (error) {
      console.error('Error accepting task:', error);
      const message = error.response?.data?.error || 'Failed to accept task';
      Alert.alert('Error', message);
    }
  };

  const handleCompleteTask = (task) => {
    setSelectedTask(task);
    setResolutionNotes('');
    setShowResolveModal(true);
  };

  const submitResolution = async () => {
    if (!resolutionNotes.trim()) {
      Alert.alert('Error', 'Please enter resolution notes');
      return;
    }

    try {
      const response = await incidentsAPI.resolveIncident(selectedTask._id, {
        resolutionNotes: resolutionNotes.trim(),
        photos: []
      });
      
      setShowResolveModal(false);
      setResolutionNotes('');
      setSelectedTask(null);
      
      // Reload dashboard data immediately
      loadDashboardData();
      
      // Show success message
      Alert.alert(
        'Success! 🎉',
        `Incident resolved!\n+${response.data.karmaEarned} karma points earned!`
      );
    } catch (error) {
      console.error('Error resolving incident:', error);
      Alert.alert('Error', 'Failed to resolve incident');
    }
  };

  const handleNavigateToLocation = (task) => {
    const location = task.location?.coordinates;
    if (!location || location.length < 2) {
      Alert.alert('Error', 'Location coordinates not available for this incident');
      return;
    }

    const latitude = location[1];
    const longitude = location[0];
    const label = encodeURIComponent(task.address || 'Incident Location');

    // Open in Google Maps
    const url = Platform.select({
      ios: `maps://app?daddr=${latitude},${longitude}&q=${label}`,
      android: `google.navigation:q=${latitude},${longitude}`,
    });

    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback to web Google Maps
        Linking.openURL(webUrl);
      }
    }).catch(() => {
      // Fallback to web Google Maps
      Linking.openURL(webUrl);
    });
  };

  const renderTaskCard = (task) => (
    <View key={task._id} style={styles.taskCard}>
      <View style={[styles.priorityIndicator, {
        backgroundColor: task.aiAnalysis?.priority === 'high' || task.aiAnalysis?.priority === 'critical'
          ? theme.colors.error 
          : task.aiAnalysis?.priority === 'medium'
          ? theme.colors.warning
          : theme.colors.success
      }]} />
      
      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{task.aiAnalysis?.category?.replace('_', ' ') || 'Animal'} in distress</Text>
          <Text style={styles.taskPriority}>{task.aiAnalysis?.priority?.toUpperCase() || 'MEDIUM'}</Text>
        </View>
        
        <Text style={styles.taskLocation} numberOfLines={1}>
          <Ionicons name="location" size={12} color={theme.colors.textSecondary} />
          {' '}{task.address || 'Location not available'}
        </Text>
        
        {task.aiAnalysis?.description && (
          <Text style={styles.taskDescription} numberOfLines={2}>
            {task.aiAnalysis.description}
          </Text>
        )}
        
        <View style={styles.taskActions}>
          {/* Check if this task is assigned to current user */}
          {(() => {
            // Check if assignedVolunteers exists and has entries
            if (!task.assignedVolunteers || task.assignedVolunteers.length === 0) {
              // Not assigned to anyone - show accept and view buttons
              return (
                <>
                  <TouchableOpacity
                    style={[styles.taskButton, styles.acceptButton]}
                    onPress={() => handleAcceptTask(task)}
                  >
                    <Ionicons name="hand-right" size={18} color={theme.colors.white} />
                    <Text style={styles.taskButtonText}>Accept Task</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.taskButton, styles.viewButton]}
                    onPress={() => navigation.navigate('IncidentDetails', { incidentId: task._id })}
                  >
                    <Ionicons name="eye" size={18} color={theme.colors.primary} />
                    <Text style={[styles.taskButtonText, { color: theme.colors.primary }]}>View</Text>
                  </TouchableOpacity>
                </>
              );
            }
            
            // Check if assigned to current user
            const isAssignedToMe = task.assignedVolunteers.some(av => {
              const volunteerId = av.volunteer?._id || av.volunteer;
              return volunteerId === user.id || volunteerId?.toString() === user.id;
            });
            
            if (isAssignedToMe) {
              // Assigned to me - show resolve and view buttons
              return (
                <>
                  <TouchableOpacity
                    style={[styles.taskButton, styles.completeButton]}
                    onPress={() => handleCompleteTask(task)}
                  >
                    <Ionicons name="checkmark-circle" size={18} color={theme.colors.white} />
                    <Text style={styles.taskButtonText}>Resolve</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.taskButton, styles.viewButton]}
                    onPress={() => navigation.navigate('IncidentDetails', { incidentId: task._id })}
                  >
                    <Ionicons name="eye" size={18} color={theme.colors.primary} />
                    <Text style={[styles.taskButtonText, { color: theme.colors.primary }]}>View</Text>
                  </TouchableOpacity>
                </>
              );
            } else {
              // Assigned to someone else - show view only
              return (
                <TouchableOpacity
                  style={[styles.taskButton, styles.viewButton, { flex: 1 }]}
                  onPress={() => navigation.navigate('IncidentDetails', { incidentId: task._id })}
                >
                  <Ionicons name="eye" size={18} color={theme.colors.primary} />
                  <Text style={[styles.taskButtonText, { color: theme.colors.primary }]}>View Details</Text>
                </TouchableOpacity>
              );
            }
          })()}
        </View>
      </View>
    </View>
  );

  const renderBadge = (badge, index) => (
    <View key={index} style={styles.badgeCard}>
      <View style={styles.badgeIcon}>
        <Ionicons name="trophy" size={24} color={theme.colors.warning} />
      </View>
      <Text style={styles.badgeName}>{badge.name || 'Badge'}</Text>
    </View>
  );

  const renderLeaderboardItem = (item, index) => (
    <View key={item._id} style={styles.leaderboardItem}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>#{index + 1}</Text>
      </View>
      
      <View style={styles.leaderboardInfo}>
        <Text style={styles.leaderboardName}>{item.name}</Text>
        <Text style={styles.leaderboardKarma}>{item.karmaPoints || 0} karma</Text>
      </View>
      
      {index < 3 && (
        <Ionicons
          name="trophy"
          size={20}
          color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'}
        />
      )}
    </View>
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
          <Text style={styles.title}>Volunteer Dashboard</Text>
          <Text style={styles.subtitle}>Making a difference! 🐾</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle" size={40} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Availability Toggle */}
      <View style={styles.availabilityCard}>
        <View style={styles.availabilityInfo}>
          <Ionicons
            name={isAvailable ? 'checkmark-circle' : 'close-circle'}
            size={32}
            color={isAvailable ? theme.colors.success : theme.colors.gray400}
          />
          <View style={styles.availabilityText}>
            <Text style={styles.availabilityTitle}>
              {isAvailable ? 'Available for Tasks' : 'Unavailable'}
            </Text>
            <Text style={styles.availabilitySubtitle}>
              {isAvailable ? 'You will receive new task alerts' : 'You won\'t receive alerts'}
            </Text>
          </View>
        </View>
        <Switch
          value={isAvailable}
          onValueChange={handleToggleAvailability}
          trackColor={{ false: theme.colors.gray300, true: theme.colors.success }}
          thumbColor={theme.colors.white}
        />
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { borderLeftColor: theme.colors.warning }]}>
          <Ionicons name="star" size={32} color={theme.colors.warning} />
          <Text style={styles.statValue}>{stats.karmaPoints || 0}</Text>
          <Text style={styles.statLabel}>Karma Points</Text>
        </View>
        
        <View style={[styles.statCard, { borderLeftColor: theme.colors.success }]}>
          <Ionicons name="checkmark-done" size={32} color={theme.colors.success} />
          <Text style={styles.statValue}>{stats.tasksCompleted || 0}</Text>
          <Text style={styles.statLabel}>Tasks Done</Text>
        </View>
        
        <View style={[styles.statCard, { borderLeftColor: theme.colors.primary }]}>
          <Ionicons name="trophy" size={32} color={theme.colors.primary} />
          <Text style={styles.statValue}>{stats.badges?.length || 0}</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </View>

      {/* Badges Section */}
      {stats.badges && stats.badges.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Your Badges</Text>
          <View style={styles.badgesContainer}>
            {stats.badges.map((badge, index) => (
              <View key={index} style={styles.badgeItem}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Active Tasks */}
      <View style={styles.section}>
        <View style={styles.taskFilterContainer}>
          <TouchableOpacity
            style={[styles.taskFilterButton, taskFilter === 'my' && styles.taskFilterActive]}
            onPress={() => setTaskFilter('my')}
          >
            <Text style={[styles.taskFilterText, taskFilter === 'my' && styles.taskFilterTextActive]}>
              My Tasks ({activeTasks.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.taskFilterButton, taskFilter === 'available' && styles.taskFilterActive]}
            onPress={() => setTaskFilter('available')}
          >
            <Text style={[styles.taskFilterText, taskFilter === 'available' && styles.taskFilterTextActive]}>
              Available ({availableTasks.length})
            </Text>
          </TouchableOpacity>
        </View>
        
        {taskFilter === 'my' ? (
          activeTasks.length > 0 ? (
            activeTasks.map(renderTaskCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-done-circle" size={48} color={theme.colors.gray300} />
              <Text style={styles.emptyText}>No active tasks</Text>
              <Text style={styles.emptySubtext}>Accept a task to get started!</Text>
            </View>
          )
        ) : (
          availableTasks.length > 0 ? (
            availableTasks.map(renderTaskCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-done-circle" size={48} color={theme.colors.gray300} />
              <Text style={styles.emptyText}>No available tasks</Text>
              <Text style={styles.emptySubtext}>All incidents are being handled!</Text>
            </View>
          )
        )}
      </View>

      {/* Badges */}
      {stats.badges && stats.badges.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Badges</Text>
          <View style={styles.badgesGrid}>
            {stats.badges.map(renderBadge)}
          </View>
        </View>
      )}

      {/* Leaderboard */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Volunteers</Text>
        <View style={styles.leaderboardContainer}>
          {leaderboard.map(renderLeaderboardItem)}
        </View>
      </View>

      {/* Resolution Modal */}
      <Modal
        visible={showResolveModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowResolveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mark as Resolved</Text>
            
            <Text style={styles.modalLabel}>Resolution Notes *</Text>
            <TextInput
              style={styles.resolutionInput}
              placeholder="Describe what you did to help the animal..."
              value={resolutionNotes}
              onChangeText={setResolutionNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowResolveModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitResolution}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  availabilityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    margin: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  availabilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  availabilityText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  availabilityTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  availabilitySubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderLeftWidth: 4,
    ...theme.shadows.sm,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  priorityIndicator: {
    width: 4,
  },
  taskContent: {
    flex: 1,
    padding: theme.spacing.md,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  taskTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  taskPriority: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.error,
  },
  taskLocation: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  taskDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  taskActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  taskButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  completeButton: {
    backgroundColor: theme.colors.success,
  },
  acceptButton: {
    backgroundColor: theme.colors.primary,
  },
  navigateButton: {
    backgroundColor: '#4285F4', // Google Maps blue
  },
  viewButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  taskFilterContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.gray300,
  },
  taskFilterButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  taskFilterActive: {
    backgroundColor: theme.colors.primary,
  },
  taskFilterText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray600,
  },
  taskFilterTextActive: {
    color: theme.colors.white,
  },
  taskButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.white,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  badgeCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  badgeIcon: {
    marginBottom: theme.spacing.sm,
  },
  badgeName: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
  },
  leaderboardContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  rankText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  leaderboardKarma: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  modalLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  resolutionInput: {
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: theme.spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.gray200,
  },
  submitButton: {
    backgroundColor: theme.colors.success,
  },
  cancelButtonText: {
    color: theme.colors.gray700,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  submitButtonText: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  badgeItem: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    minWidth: 100,
    ...theme.shadows.sm,
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  badgeName: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
});

export default VolunteerDashboardScreen;
