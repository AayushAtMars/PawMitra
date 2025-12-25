import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { incidentsAPI } from '../../services/api';
import theme from '../../theme';

const IncidentDetailsScreen = ({ route, navigation }) => {
  const { incidentId } = route.params;
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIncidentDetails();
  }, [incidentId]);

  const loadIncidentDetails = async () => {
    try {
      setLoading(true);
      const response = await incidentsAPI.getById(incidentId);
      setIncident(response.data.incident);
    } catch (error) {
      console.error('Error loading incident:', error);
      Alert.alert('Error', 'Failed to load incident details');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.success;
      default:
        return theme.colors.gray500;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return theme.colors.success;
      case 'volunteer_assigned':
        return theme.colors.primary;
      case 'reported':
        return theme.colors.warning;
      default:
        return theme.colors.gray500;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!incident) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={theme.colors.gray400} />
        <Text style={styles.errorText}>Incident not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Incident Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Photo */}
      {incident.photos && incident.photos.length > 0 && (
        <Image source={{ uri: incident.photos[0].url }} style={styles.photo} />
      )}

      {/* Status and Priority Badges */}
      <View style={styles.badgesContainer}>
        <View style={[styles.badge, { backgroundColor: getStatusColor(incident.status) }]}>
          <Text style={styles.badgeText}>{incident.status.replace('_', ' ').toUpperCase()}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getPriorityColor(incident.aiAnalysis?.priority) }]}>
          <Text style={styles.badgeText}>{incident.aiAnalysis?.priority?.toUpperCase() || 'MEDIUM'} PRIORITY</Text>
        </View>
      </View>

      {/* AI Analysis */}
      {incident.aiAnalysis && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Analysis</Text>
          <View style={styles.card}>
            <Text style={styles.category}>
              Category: {incident.aiAnalysis.category?.replace('_', ' ').toUpperCase()}
            </Text>
            <Text style={styles.description}>{incident.aiAnalysis.description}</Text>
          </View>
        </View>
      )}

      {/* Location */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.card}>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={20} color={theme.colors.primary} />
            <Text style={styles.address}>{incident.address || 'Location not available'}</Text>
          </View>
        </View>
      </View>

      {/* First Aid Instructions */}
      {incident.aiAnalysis?.firstAidInstructions && incident.aiAnalysis.firstAidInstructions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🩹 First Aid Instructions</Text>
          <View style={styles.card}>
            {incident.aiAnalysis.firstAidInstructions.map((instruction, index) => (
              <Text key={index} style={styles.listItem}>
                {index + 1}. {instruction}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Safety Warnings */}
      {incident.aiAnalysis?.safetyWarnings && incident.aiAnalysis.safetyWarnings.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Safety Warnings</Text>
          <View style={[styles.card, styles.warningCard]}>
            {incident.aiAnalysis.safetyWarnings.map((warning, index) => (
              <Text key={index} style={styles.warningItem}>
                • {warning}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Reporter Info */}
      {incident.reportedBy && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reported By</Text>
          <View style={styles.card}>
            <Text style={styles.reporterName}>{incident.reportedBy.name}</Text>
            <Text style={styles.reportedDate}>
              {new Date(incident.createdAt).toLocaleString()}
            </Text>
          </View>
        </View>
      )}

      {/* Resolution Info */}
      {incident.status === 'resolved' && incident.resolutionNotes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ Resolution</Text>
          <View style={[styles.card, styles.resolvedCard]}>
            <Text style={styles.resolutionNotes}>{incident.resolutionNotes}</Text>
            {incident.resolvedAt && (
              <Text style={styles.resolvedDate}>
                Resolved on {new Date(incident.resolvedAt).toLocaleString()}
              </Text>
            )}
          </View>
        </View>
      )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.gray600,
    marginTop: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  photo: {
    width: '100%',
    height: 300,
    backgroundColor: theme.colors.gray200,
  },
  badgesContainer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
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
  card: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  category: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  address: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  listItem: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    lineHeight: 22,
  },
  warningCard: {
    backgroundColor: theme.colors.warning + '10',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  warningItem: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    lineHeight: 22,
  },
  reporterName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  reportedDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  resolvedCard: {
    backgroundColor: theme.colors.success + '10',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  resolutionNotes: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    lineHeight: 22,
  },
  resolvedDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});

export default IncidentDetailsScreen;
