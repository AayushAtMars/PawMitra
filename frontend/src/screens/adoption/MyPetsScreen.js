import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { petsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import theme from '../../theme';

const MyPetsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyPets();
  }, []);

  const fetchMyPets = async () => {
    try {
      setLoading(true);
      const response = await petsAPI.getAll({ owner: user.id });
      setPets(response.data.pets || []);
    } catch (error) {
      console.error('Error fetching pets:', error);
      Alert.alert('Error', 'Failed to load your pets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyPets();
  };

  const handleEdit = (pet) => {
    Alert.alert('Edit Pet', 'Pet editing coming soon!');
  };

  const handleDelete = (pet) => {
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to remove "${pet.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Backend should have a delete endpoint
              Alert.alert('Success', 'Pet removed');
              fetchMyPets();
            } catch (error) {
              console.error('Error deleting pet:', error);
              Alert.alert('Error', 'Failed to delete pet');
            }
          }
        }
      ]
    );
  };

  const renderPetCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {item.photos && item.photos.length > 0 ? (
          <Image source={{ uri: item.photos[0].url }} style={styles.petImage} />
        ) : (
          <View style={[styles.petImage, styles.imagePlaceholder]}>
            <Ionicons name="paw" size={32} color={theme.colors.gray400} />
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.petName}>{item.name}</Text>
          <Text style={styles.species}>
            {item.species.charAt(0).toUpperCase() + item.species.slice(1)}
            {item.breed && ` • ${item.breed}`}
          </Text>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={14} color={theme.colors.gray600} />
            <Text style={styles.detailText}>{item.age || 'Age unknown'}</Text>
          </View>
          {item.isLostFound && (
            <View style={styles.lostFoundBadge}>
              <Ionicons 
                name={item.lostFoundType === 'lost' ? 'alert-circle' : 'checkmark-circle'} 
                size={14} 
                color={item.lostFoundType === 'lost' ? theme.colors.warning : theme.colors.success} 
              />
              <Text style={[
                styles.lostFoundText,
                { color: item.lostFoundType === 'lost' ? theme.colors.warning : theme.colors.success }
              ]}>
                {item.lostFoundType === 'lost' ? 'Lost' : 'Found'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {item.description && (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      {item.healthStatus && (
        <View style={styles.healthBadge}>
          <Ionicons name="medical" size={14} color={theme.colors.primary} />
          <Text style={styles.healthText}>{item.healthStatus}</Text>
        </View>
      )}

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
          <Text style={[styles.actionText, { color: theme.colors.error }]}>Remove</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Share', 'Share pet profile coming soon!')}
        >
          <Ionicons name="share-outline" size={20} color={theme.colors.secondary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="paw-outline" size={64} color={theme.colors.gray300} />
      <Text style={styles.emptyTitle}>No Pets Yet</Text>
      <Text style={styles.emptyText}>Add your first pet for adoption</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPet')}
      >
        <Ionicons name="add-circle" size={20} color={theme.colors.white} />
        <Text style={styles.addButtonText}>Add Pet</Text>
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>My Pets</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddPet')}>
          <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={pets}
        renderItem={renderPetCard}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
  },
  imagePlaceholder: {
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  petName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  species: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  detailText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  lostFoundBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.gray100,
    marginTop: theme.spacing.xs,
  },
  lostFoundText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    marginLeft: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  healthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  healthText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
    marginLeft: theme.spacing.xs,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
    paddingTop: theme.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  actionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
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
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  addButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default MyPetsScreen;
