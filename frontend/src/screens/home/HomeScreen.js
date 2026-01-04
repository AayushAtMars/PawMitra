// UI-ONLY UPDATE: Enhanced Home screen with modern design
// Preserves all existing business logic, API calls, navigation, and function signatures
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { incidentsAPI, petsAPI, volunteersAPI } from '../../services/api';
import theme from '../../theme';

// UI Components
import HomeHero from '../../components/HomeHero';
import PetCard from '../../components/PetCard';
import ServiceCard from '../../components/ServiceCard';
import FloatingReportButton from '../../components/FloatingReportButton';
import FloatingChatButton from '../../components/FloatingChatButton';

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
  const [recentPets, setRecentPets] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch statistics and recent data
      const [incidentsRes, petsRes, volunteersRes] = await Promise.all([
        incidentsAPI.getAll({ limit: 5 }),
        petsAPI.getAll({ status: 'available', limit: 6 }),
        volunteersAPI.getStats().catch(() => ({ data: { activeVolunteers: 0 } })),
      ]);

      setStats({
        totalIncidents: incidentsRes.data.total || 0,
        activeIncidents: incidentsRes.data.incidents?.filter(i => i.status === 'reported').length || 0,
        petsAvailable: petsRes.data.pets?.length || 0,
        volunteersActive: volunteersRes.data.activeVolunteers || 0,
      });

      setRecentIncidents(incidentsRes.data.incidents || []);
      setRecentPets(petsRes.data.pets || []);
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

  // Mock marketplace services - replace with actual API call
  const mockServices = [
    {
      _id: '1',
      businessName: 'PetCare Veterinary',
      serviceType: 'veterinary',
      location: 'Sector 17, Chandigarh',
      rating: 4.8,
      distance: 2.3,
    },
    {
      _id: '2',
      businessName: 'Pampered Paws Grooming',
      serviceType: 'grooming',
      location: 'Sector 35, Chandigarh',
      rating: 4.6,
      distance: 3.1,
    },
  ];

  const renderStatCard = (title, value, icon, color) => (
    <View style={[styles.statCard, { borderLeftColor: color }]} key={`stat-${title}`}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{String(value)}</Text>
        <Text style={styles.statLabel}>{title}</Text>
      </View>
    </View>
  );

  const renderIncidentCard = (incident) => (
    <TouchableOpacity
      key={incident._id}
      style={styles.incidentCard}
      onPress={() => navigation.navigate('IncidentDetails', { incidentId: incident._id })}
      activeOpacity={0.8}
    >
      <View style={[styles.priorityBadge, {
        backgroundColor: incident.aiAnalysis?.priority === 'high' || incident.aiAnalysis?.priority === 'critical'
          ? theme.colors.error
          : incident.aiAnalysis?.priority === 'medium'
            ? theme.colors.warning
            : theme.colors.success
      }]}>
        <Text style={styles.priorityText}>
          {String(incident.aiAnalysis?.priority || 'MEDIUM').toUpperCase()}
        </Text>
      </View>
      <Text style={styles.incidentType}>
        {String(incident.aiAnalysis?.category || 'Animal').replace('_', ' ')} in distress
      </Text>
      <View style={styles.incidentLocationRow}>
        <Ionicons name="location" size={14} color={theme.colors.textSecondary} />
        <Text style={styles.incidentLocation} numberOfLines={1}>
          {String(incident.address || 'Location not available')}
        </Text>
      </View>
      <Text style={styles.incidentTime}>
        {new Date(incident.createdAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading PawMitra...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <HomeHero
          userName={user?.name?.split(' ')[0] || 'Friend'}
          onReportPress={() => navigation.navigate('Report')}
          onAdoptPress={() => navigation.navigate('Adoption')}
          onMarketplacePress={() => navigation.navigate('Marketplace')}
          onVolunteerPress={() => user?.isVolunteer
            ? navigation.navigate('Volunteer')
            : navigation.navigate('Profile')}
        />

        {/* Community Impact Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Impact</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Active Cases', stats.activeIncidents, 'alert-circle', theme.colors.error)}
            {renderStatCard('Available Pets', stats.petsAvailable, 'paw', theme.colors.secondary)}
            {renderStatCard('Volunteers', stats.volunteersActive, 'people', theme.colors.primary)}
            {renderStatCard('Total Reports', stats.totalIncidents, 'document-text', theme.colors.accent)}
          </View>
        </View>

        {/* Pets for Adoption Carousel */}
        {recentPets.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Find Your Companion</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Adoption')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={recentPets}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <PetCard
                  pet={item}
                  onPress={(pet) => console.log('Pet pressed:', pet)}
                  onFavorite={(pet) => console.log('Favorited:', pet)}
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
            />
          </View>
        )}

        {/* Recent Incidents */}
        {recentIncidents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Incidents</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AllIncidents')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {recentIncidents.slice(0, 3).map(renderIncidentCard)}
          </View>
        )}

        {/* Marketplace Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pet Services Near You</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Marketplace')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.servicesGrid}>
            {mockServices.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onPress={(service) => console.log('Service pressed:', service)}
                style={styles.serviceCard}
              />
            ))}
          </View>
        </View>

        {/* Community Message */}
        <View style={styles.communityCard}>
          <View style={styles.communityIcon}>
            <Ionicons name="heart" size={40} color={theme.colors.secondary} />
          </View>
          <Text style={styles.communityTitle}>Thank you for being a PawMitra!</Text>
          <Text style={styles.communityText}>
            Together we've helped countless animals find safety and loving homes.
          </Text>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Buttons */}
      <FloatingChatButton onPress={() => navigation.navigate('Chat')} />
      <FloatingReportButton onPress={() => navigation.navigate('Report')} />
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
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxxl + theme.spacing.xl,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
  },
  seeAll: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  statsGrid: {
    gap: theme.spacing.md,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderLeftWidth: 4,
    ...theme.shadows.sm,
  },
  statIcon: {
    width: 52,
    height: 52,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  carouselContent: {
    paddingRight: theme.spacing.lg,
  },
  incidentCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  priorityText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  incidentType: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    textTransform: 'capitalize',
  },
  incidentLocation: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    flex: 1,
    marginLeft: theme.spacing.xs,
  },
  incidentLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  incidentTime: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  servicesGrid: {
    gap: theme.spacing.md,
  },
  serviceCard: {
    flex: 1,
  },
  communityCard: {
    backgroundColor: theme.colors.secondary + '15',
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.secondary + '30',
  },
  communityIcon: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  communityTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  communityText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSpacer: {
    height: theme.spacing.xl,
  },
});

export default HomeScreen;