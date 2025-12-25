import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { incidentsAPI } from '../../services/api';
import theme from '../../theme';

const AllIncidentsScreen = ({ navigation }) => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, reported, resolved

  useEffect(() => {
    loadIncidents();
  }, [filter]);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const params = filter === 'all' ? {} : { status: filter };
      const response = await incidentsAPI.getAll({ ...params, limit: 50 });
      setIncidents(response.data.incidents || []);
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadIncidents();
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

  const renderIncidentCard = ({ item }) => (
    <TouchableOpacity
      style={styles.incidentCard}
      onPress={() => navigation.navigate('IncidentDetails', { incidentId: item._id })}
    >
      <View style={[styles.priorityIndicator, { 
        backgroundColor: getPriorityColor(item.aiAnalysis?.priority)
      }]} />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.incidentType}>
            {item.aiAnalysis?.category?.replace('_', ' ') || 'Animal'} in distress
          </Text>
          <View style={[styles.statusBadge, { 
            backgroundColor: item.status === 'resolved' 
              ? theme.colors.success 
              : item.status === 'volunteer_assigned'
              ? theme.colors.primary
              : theme.colors.warning
          }]}>
            <Text style={styles.statusText}>
              {item.status === 'volunteer_assigned' ? 'ASSIGNED' : item.status.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.incidentLocation} numberOfLines={1}>
          <Ionicons name="location" size={12} color={theme.colors.textSecondary} />
          {' '}{item.address || 'Location not available'}
        </Text>
        
        {item.aiAnalysis?.description && (
          <Text style={styles.incidentDescription} numberOfLines={2}>
            {item.aiAnalysis.description}
          </Text>
        )}
        
        <View style={styles.cardFooter}>
          <Text style={styles.incidentTime}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <Text style={[styles.priorityText, { color: getPriorityColor(item.aiAnalysis?.priority) }]}>
            {item.aiAnalysis?.priority?.toUpperCase() || 'MEDIUM'} PRIORITY
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
        onPress={() => setFilter('all')}
      >
        <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
          All
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, filter === 'reported' && styles.filterButtonActive]}
        onPress={() => setFilter('reported')}
      >
        <Text style={[styles.filterText, filter === 'reported' && styles.filterTextActive]}>
          Active
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, filter === 'resolved' && styles.filterButtonActive]}
        onPress={() => setFilter('resolved')}
      >
        <Text style={[styles.filterText, filter === 'resolved' && styles.filterTextActive]}>
          Resolved
        </Text>
      </TouchableOpacity>
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Incidents</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={incidents}
        renderItem={renderIncidentCard}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={theme.colors.gray300} />
            <Text style={styles.emptyText}>No incidents found</Text>
          </View>
        }
      />
    </View>
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
  filterContainer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray300,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray600,
  },
  filterTextActive: {
    color: theme.colors.white,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  incidentCard: {
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
  cardContent: {
    flex: 1,
    padding: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  incidentType: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    marginLeft: theme.spacing.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.bold,
  },
  incidentLocation: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  incidentDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incidentTime: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  priorityText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl * 2,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray600,
    marginTop: theme.spacing.md,
  },
});

export default AllIncidentsScreen;
