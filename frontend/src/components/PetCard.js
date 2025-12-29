// UI Component: Adoption pet card for horizontal carousel
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const PetCard = ({ 
  pet, 
  onPress, 
  onFavorite,
  isFavorited = false,
  style 
}) => {
  const [favorited, setFavorited] = useState(isFavorited);

  const handleFavorite = () => {
    setFavorited(!favorited);
    onFavorite?.(pet);
  };

  const getGenderIcon = (gender) => {
    if (gender === 'male') return 'male';
    if (gender === 'female') return 'female';
    return 'help-circle-outline';
  };

  const getGenderColor = (gender) => {
    if (gender === 'male') return theme.colors.info;
    if (gender === 'female') return theme.colors.secondary;
    return theme.colors.gray400;
  };

  return (
    <TouchableOpacity 
      style={[styles.card, style]}
      onPress={() => onPress?.(pet)}
      activeOpacity={0.9}
    >
      {/* Pet Image */}
      <View style={styles.imageContainer}>
        {pet.photos && pet.photos.length > 0 ? (
          <Image 
            source={{ uri: pet.photos[0].url }} 
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="paw" size={48} color={theme.colors.gray300} />
          </View>
        )}
        
        {/* Favorite Button */}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleFavorite}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={favorited ? 'heart' : 'heart-outline'} 
            size={22} 
            color={favorited ? theme.colors.error : theme.colors.white} 
          />
        </TouchableOpacity>

        {/* Status Badge */}
        {pet.status === 'available' && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Available</Text>
          </View>
        )}
      </View>

      {/* Pet Info */}
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {String(pet.name || 'Unknown')}
          </Text>
          <Ionicons 
            name={getGenderIcon(pet.gender)} 
            size={18} 
            color={getGenderColor(pet.gender)} 
          />
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="paw" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>
              {String(pet.breed || pet.species || 'Mixed')}
            </Text>
          </View>
          
          {pet.age && (
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.detailText}>{String(pet.age)}</Text>
            </View>
          )}
        </View>

        {pet.location && (
          <View style={styles.location}>
            <Ionicons name="location" size={12} color={theme.colors.primary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {String(pet.location)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginRight: theme.spacing.md,
    ...theme.shadows.md,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: theme.colors.gray100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.gray100,
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.white,
  },
  info: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  name: {
    flex: 1,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginRight: theme.spacing.xs,
  },
  details: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  detailText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
  },
  locationText: {
    flex: 1,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
  },
});

export default PetCard;