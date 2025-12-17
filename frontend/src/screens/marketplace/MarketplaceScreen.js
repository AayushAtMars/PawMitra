import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { marketplaceAPI } from '../../services/api';
import { getCurrentLocation, formatDistance, calculateDistance } from '../../utils/geolocation';
import theme from '../../theme';

const MarketplaceScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  const categories = [
    { id: 'all', name: 'All', icon: 'grid' },
    { id: 'veterinary', name: 'Vets', icon: 'medical' },
    { id: 'pet_shop', name: 'Shops', icon: 'storefront' },
    { id: 'grooming', name: 'Grooming', icon: 'cut' },
    { id: 'training', name: 'Training', icon: 'school' },
  ];

  useEffect(() => {
    getUserLocation();
    loadServices();
  }, [selectedCategory]);

  const getUserLocation = async () => {
    const result = await getCurrentLocation();
    if (result.success) {
      setUserLocation(result.location);
    }
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      
      if (userLocation) {
        const response = await marketplaceAPI.getNearbyServices({
          longitude: userLocation.coordinates[0],
          latitude: userLocation.coordinates[1],
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          maxDistance: 10000, // 10km
        });
        
        if (response.data.success) {
          setServices(response.data.services);
        }
      } else {
        const response = await marketplaceAPI.getServices({
          category: selectedCategory === 'all' ? undefined : selectedCategory,
        });
        
        if (response.data.success) {
          setServices(response.data.services);
        }
      }
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadServices();
    setRefreshing(false);
  };

  const filteredServices = services.filter(service =>
    service.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pet Services</Text>
        <TouchableOpacity style={styles.emergencyButton}>
          <Ionicons name="alert-circle" size={24} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.colors.gray400} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          placeholderTextColor={theme.colors.gray400}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon}
              size={20}
              color={
                selectedCategory === category.id
                  ? theme.colors.white
                  : theme.colors.gray600
              }
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Services List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.servicesList}
          contentContainerStyle={styles.servicesContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredServices.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="storefront-outline" size={64} color={theme.colors.gray300} />
              <Text style={styles.emptyText}>No services found</Text>
              <Text style={styles.emptySubtext}>Try a different category or location</Text>
            </View>
          ) : (
            filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                userLocation={userLocation}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

// Service Card Component
const ServiceCard = ({ service, userLocation }) => {
  const distance = userLocation && service.location
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        service.location.coordinates[1],
        service.location.coordinates[0]
      )
    : null;

  return (
    <View style={styles.serviceCard}>
      {/* Service Image/Logo */}
      <View style={styles.serviceImageContainer}>
        {service.logo?.url ? (
          <Image source={{ uri: service.logo.url }} style={styles.serviceLogo} />
        ) : (
          <View style={[styles.serviceLogo, styles.serviceLogoPlaceholder]}>
            <Ionicons name="storefront" size={32} color={theme.colors.gray400} />
          </View>
        )}
        {service.isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={12} color={theme.colors.white} />
          </View>
        )}
      </View>

      {/* Service Info */}
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{service.businessName}</Text>
        
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {service.category.replace('_', ' ').toUpperCase()}
          </Text>
        </View>

        {service.description && (
          <Text style={styles.serviceDescription} numberOfLines={2}>
            {service.description}
          </Text>
        )}

        {/* Rating */}
        {service.ratings?.average > 0 && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={theme.colors.warning} />
            <Text style={styles.ratingText}>
              {service.ratings.average.toFixed(1)} ({service.ratings.count} reviews)
            </Text>
          </View>
        )}

        {/* Distance */}
        {distance && (
          <View style={styles.distanceContainer}>
            <Ionicons name="location" size={16} color={theme.colors.primary} />
            <Text style={styles.distanceText}>{formatDistance(distance)} away</Text>
          </View>
        )}

        {/* Emergency Badge */}
        {service.emergencyAvailable && (
          <View style={styles.emergencyBadge}>
            <Ionicons name="flash" size={14} color={theme.colors.error} />
            <Text style={styles.emergencyText}>
              {service.emergency24x7 ? '24/7 Emergency' : 'Emergency Available'}
            </Text>
          </View>
        )}

        {/* Contact Button */}
        <View style={styles.contactButtons}>
          {service.contactInfo?.phone && (
            <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="call" size={18} color={theme.colors.primary} />
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.contactButton, styles.viewButton]}>
            <Ionicons name="information-circle" size={18} color={theme.colors.white} />
            <Text style={[styles.contactButtonText, styles.viewButtonText]}>
              View Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  emergencyButton: {
    padding: theme.spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    margin: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
  },
  categoriesContainer: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray600,
    fontWeight: theme.typography.fontWeight.medium,
  },
  categoryTextActive: {
    color: theme.colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servicesList: {
    flex: 1,
  },
  servicesContent: {
    padding: theme.spacing.lg,
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  serviceImageContainer: {
    position: 'relative',
  },
  serviceLogo: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
  },
  serviceLogoPlaceholder: {
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.warning,
    borderRadius: theme.borderRadius.full,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  serviceName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  categoryBadgeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  serviceDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  ratingText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  distanceText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.error + '10',
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  emergencyText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray100,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  viewButton: {
    backgroundColor: theme.colors.primary,
    flex: 1,
  },
  contactButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  viewButtonText: {
    color: theme.colors.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl * 2,
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
});

export default MarketplaceScreen;
