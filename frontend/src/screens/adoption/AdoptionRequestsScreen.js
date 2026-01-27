import React, { useState, useCallback } from 'react';
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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { petsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import theme from '../../theme';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AdoptionRequestsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchMyPetsWithRequests();
    }, [])
  );

  const fetchMyPetsWithRequests = async () => {
    try {
      setLoading(true);
      const response = await petsAPI.getAll({ owner: user?.id });
      const myPets = response.data.pets || [];
      
      // Filter pets that have adoption requests
      const petsWithRequests = myPets.filter(
        pet => pet.interestedUsers && pet.interestedUsers.length > 0
      );
      
      setPets(petsWithRequests);
    } catch (error) {
      console.error('Error fetching pets:', error);
      Alert.alert('Error', 'Failed to load adoption requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyPetsWithRequests();
  };

  const getTotalRequests = () => {
    return pets.reduce((total, pet) => total + (pet.interestedUsers?.length || 0), 0);
  };

  const renderPetCard = ({ item }) => {
    const imageUrl = item.photos?.[0]?.url;
    const requestCount = item.interestedUsers?.length || 0;
    
    return (
      <TouchableOpacity
        style={styles.petCard}
        onPress={() => navigation.navigate('PetRequests', { pet: item })}
        activeOpacity={0.7}
      >
        <View style={styles.petImageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.petImage} />
          ) : (
            <View style={[styles.petImage, styles.imagePlaceholder]}>
              <Ionicons name="paw" size={30} color={theme.colors.gray300} />
            </View>
          )}
        </View>
        
        <View style={styles.petInfo}>
          <Text style={styles.petName} numberOfLines={1}>
            {item.name || 'Unknown'}
          </Text>
          <Text style={styles.petBreed} numberOfLines={1}>
            {item.species ? item.species.charAt(0).toUpperCase() + item.species.slice(1) : 'Pet'}
            {item.breed && ` • ${item.breed}`}
          </Text>
          
          <View style={styles.requestBadge}>
            <Ionicons name="people" size={14} color={theme.colors.primary} />
            <Text style={styles.requestCount}>
              {requestCount} {requestCount === 1 ? 'Request' : 'Requests'}
            </Text>
          </View>
        </View>
        
        <Ionicons name="chevron-forward" size={24} color={theme.colors.gray400} />
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="mail-open-outline" size={60} color={theme.colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>No Adoption Requests</Text>
      <Text style={styles.emptyText}>
        When someone is interested in adopting your pet, you'll see their requests here.
      </Text>
      <TouchableOpacity
        style={styles.addPetBtn}
        onPress={() => navigation.navigate('Adoption')}
      >
        <Text style={styles.addPetBtnText}>View All Pets</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Adoption Requests</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Stats */}
      {pets.length > 0 && (
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{pets.length}</Text>
            <Text style={styles.statLabel}>Pets with Requests</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{getTotalRequests()}</Text>
            <Text style={styles.statLabel}>Total Requests</Text>
          </View>
        </View>
      )}

      {/* Pet List */}
      <FlatList
        data={pets}
        renderItem={renderPetCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  petImageContainer: {
    marginRight: 14,
  },
  petImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  requestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  requestCount: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  addPetBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
  },
  addPetBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AdoptionRequestsScreen;
