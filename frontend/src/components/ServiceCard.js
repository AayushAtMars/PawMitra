// UI Component: Marketplace service tile
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const ServiceCard = ({ service, onPress, style }) => {
  const getServiceIcon = (type) => {
    const iconMap = {
      veterinary: 'medical',
      grooming: 'cut',
      training: 'school',
      boarding: 'home',
      adoption: 'paw',
      rescue: 'heart',
      ngo: 'people',
      shelter: 'business',
    };
    return iconMap[type?.toLowerCase()] || 'storefront';
  };

  const getServiceColor = (type) => {
    const colorMap = {
      veterinary: theme.colors.error,
      grooming: theme.colors.secondary,
      training: theme.colors.info,
      boarding: theme.colors.accent,
      adoption: theme.colors.primary,
      rescue: theme.colors.success,
      ngo: theme.colors.primary,
      shelter: theme.colors.accent,
    };
    return colorMap[type?.toLowerCase()] || theme.colors.primary;
  };

  const renderRating = (rating) => {
    if (!rating) return null;
    return (
      <View style={styles.rating}>
        <Ionicons name="star" size={14} color="#FFC107" />
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.card, style]}
      onPress={() => onPress?.(service)}
      activeOpacity={0.85}
    >
      {/* Icon Background */}
      <View style={[styles.iconContainer, { backgroundColor: getServiceColor(service.serviceType) + '20' }]}>
        <Ionicons 
          name={getServiceIcon(service.serviceType)} 
          size={32} 
          color={getServiceColor(service.serviceType)} 
        />
      </View>

      {/* Service Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {String(service.businessName || service.name || 'Service')}
        </Text>
        
        <View style={styles.typeRow}>
          <View style={[styles.typeBadge, { backgroundColor: getServiceColor(service.serviceType) }]}>
            <Text style={styles.typeText}>
              {String(service.serviceType || 'service').replace('_', ' ')}
            </Text>
          </View>
        </View>

        {service.location && (
          <View style={styles.location}>
            <Ionicons name="location" size={12} color={theme.colors.textSecondary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {String(service.location)}
            </Text>
          </View>
        )}

        {/* Rating and Distance */}
        <View style={styles.footer}>
          {renderRating(service.rating || 4.5)}
          {service.distance && (
            <Text style={styles.distance}>{String(service.distance)} km</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.md,
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  info: {
    gap: theme.spacing.xs,
  },
  name: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  typeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.white,
    textTransform: 'capitalize',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  distance: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});

export default ServiceCard;