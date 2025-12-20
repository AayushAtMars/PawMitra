import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { marketplaceAPI } from '../../services/api';
import theme from '../../theme';

const MarketplaceScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'pet_shop', name: 'Pet Shop', icon: 'storefront' },
    { id: 'veterinary', name: 'Vet', icon: 'medical' },
    { id: 'grooming', name: 'Grooming', icon: 'cut' },
    { id: 'training', name: 'Training', icon: 'school' },
    { id: 'boarding', name: 'Boarding', icon: 'home' },
  ];

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchQuery, selectedCategory, services]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await marketplaceAPI.getServices();
      setServices(response.data.services || response.data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadServices();
  };

  const handleContact = (service) => {
    if (service.contactInfo?.phone) {
      Linking.openURL(`tel:${service.contactInfo.phone}`);
    }
  };

  const renderServiceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => {/* Navigate to service details */}}
    >
      {/* Service Logo */}
      <View style={styles.cardHeader}>
        {item.logo?.url ? (
          <Image source={{ uri: item.logo.url }} style={styles.serviceLogo} />
        ) : (
          <View style={[styles.serviceLogo, styles.logoPlaceholder]}>
            <Ionicons name="business" size={32} color={theme.colors.gray400} />
          </View>
        )}
        
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName} numberOfLines={1}>{item.businessName}</Text>
          <Text style={styles.serviceCategory}>
            {item.category?.replace('_', ' ').toUpperCase()}
          </Text>
          {item.emergencyAvailable && (
            <View style={styles.emergencyBadge}>
              <Ionicons name="medical" size={12} color={theme.colors.error} />
              <Text style={styles.emergencyText}>
                Emergency {item.emergency24x7 && '24/7'}
              </Text>
            </View>
          )}
        </View>

        <View style={[
          styles.statusDot,
          { backgroundColor: item.isActive ? theme.colors.success : theme.colors.gray400 }
        ]} />
      </View>

      {/* Service Description */}
      {item.description && (
        <Text style={styles.serviceDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      {/* Contact Info */}
      <View style={styles.contactRow}>
        {item.contactInfo?.phone && (
          <View style={styles.contactItem}>
            <Ionicons name="call" size={14} color={theme.colors.primary} />
            <Text style={styles.contactText}>{item.contactInfo.phone}</Text>
          </View>
        )}
        {item.contactInfo?.email && (
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={14} color={theme.colors.primary} />
            <Text style={styles.contactText} numberOfLines={1}>{item.contactInfo.email}</Text>
          </View>
        )}
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.contactButton}
        onPress={() => handleContact(item)}
      >
        <Ionicons name="call" size={18} color={theme.colors.white} />
        <Text style={styles.contactButtonText}>Contact</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCategoryFilter = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.categoryChipActive
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons
        name={item.icon}
        size={18}
        color={selectedCategory === item.id ? theme.colors.white : theme.colors.primary}
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.categoryTextActive
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="business-outline" size={64} color={theme.colors.gray300} />
      <Text style={styles.emptyTitle}>No Services Found</Text>
      <Text style={styles.emptyText}>
        {searchQuery || selectedCategory !== 'all'
          ? 'Try adjusting your filters'
          : 'Be the first to register your service!'}
      </Text>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('RegisterService')}
      >
        <Ionicons name="add-circle" size={20} color={theme.colors.white} />
        <Text style={styles.registerButtonText}>Register Service</Text>
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
        <Text style={styles.title}>Marketplace</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MyServices')}>
          <Ionicons name="briefcase" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.colors.gray400} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.colors.gray400}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.colors.gray400} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filters */}
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryFilter}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesList}
      />

      {/* Services List */}
      <FlatList
        data={filteredServices}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
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
  categoriesList: {
    flexGrow: 0,
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    gap: theme.spacing.xs,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  categoryTextActive: {
    color: theme.colors.white,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  serviceCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  serviceLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: theme.spacing.md,
  },
  logoPlaceholder: {
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  serviceCategory: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.error + '10',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
    gap: 4,
  },
  emergencyText: {
    fontSize: 10,
    color: theme.colors.error,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  serviceDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  contactRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    flex: 1,
  },
  contactText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  contactButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.lg,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  registerButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default MarketplaceScreen;
