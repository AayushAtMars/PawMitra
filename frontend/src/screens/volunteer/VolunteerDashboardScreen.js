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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { volunteersAPI, incidentsAPI } from '../../services/api';
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
  const [leaderboard, setLeaderboard] = useState([]);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [statsRes, tasksRes, leaderboardRes] = await Promise.all([
        volunteersAPI.getStats(),
        incidentsAPI.getAll({ status: 'reported,volunteer_assigned', limit: 20 }),
        volunteersAPI.getLeaderboard({ limit: 10 }),
      ]);

      setStats(statsRes.data || { karmaPoints: 0, tasksCompleted: 0, badges: [] });
      setActiveTasks(tasksRes.data.incidents || []);
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

  const handleAcceptTask = async (taskId) => {
    try {
      await volunteersAPI.acceptTask({ incidentId: taskId });
      Alert.alert('Success', 'Task accepted! Good luck!');
      loadDashboardData();
    } catch (error) {
      console.error('Error accepting task:', error);
      Alert.alert('Error', 'Failed to accept task');
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
      Alert.alert(
        'Success! 🎉',
        `Incident resolved!\n+${response.data.karmaEarned} karma points earned!`,
        [{ text: 'Awesome!', onPress: loadDashboardData }]
      );
    } catch (error) {
      console.error('Error resolving incident:', error);
      Alert.alert('Error', 'Failed to resolve incident');
    }
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
          <TouchableOpacity
            style={[styles.taskButton, styles.completeButton]}
            onPress={() => handleCompleteTask(task)}
          >
            <Ionicons name="checkmark-circle" size={18} color={theme.colors.white} />
            <Text style={styles.taskButtonText}>Mark Resolved</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.taskButton, styles.viewButton]}
            onPress={() => {/* Navigate to task details */}}
          >
            <Ionicons name="eye" size={18} color={theme.colors.primary} />
            <Text style={[styles.taskButtonText, { color: theme.colors.primary }]}>View</Text>
          </TouchableOpacity>
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

      {/* Active Tasks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Tasks ({activeTasks.length})</Text>
        {activeTasks.length > 0 ? (
          activeTasks.map(renderTaskCard)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle" size={48} color={theme.colors.gray300} />
            <Text style={styles.emptyText}>No active tasks</Text>
            <Text style={styles.emptySubtext}>You're all caught up!</Text>
          </View>
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
  viewButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.primary,
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
});

export default VolunteerDashboardScreen;
