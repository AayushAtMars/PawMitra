// // UI-ONLY UPDATE: Enhanced styling for My Pets screen with improved card layout
// // Preserves all existing business logic, API calls, and handlers
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   Alert,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { petsAPI } from '../../services/api';
// import { useAuth } from '../../context/AuthContext';
// import theme from '../../theme';

// const MyPetsScreen = ({ navigation }) => {
//   const { user } = useAuth();
//   const [pets, setPets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     fetchMyPets();
//   }, []);

//   const fetchMyPets = async () => {
//     try {
//       setLoading(true);
//       const response = await petsAPI.getAll({ owner: user.id });
//       setPets(response.data.pets || []);
//     } catch (error) {
//       console.error('Error fetching pets:', error);
//       Alert.alert('Error', 'Failed to load your pets');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchMyPets();
//   };

//   const handleEdit = (pet) => {
//     Alert.alert('Edit Pet', 'Pet editing coming soon!');
//   };

//   const handleDelete = (pet) => {
//     Alert.alert(
//       'Delete Pet',
//       `Are you sure you want to remove "${pet.name}"?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await petsAPI.delete(pet._id);
//               Alert.alert('Success', 'Pet removed');
//               fetchMyPets();
//             } catch (error) {
//               console.error('Error deleting pet:', error);
//               Alert.alert('Error', 'Failed to delete pet');
//             }
//           }
//         }
//       ]
//     );
//   };

//   const renderPetCard = ({ item }) => (
//     <View style={styles.card}>
//       {/* Pet Image & Quick Info */}
//       <View style={styles.cardTop}>
//         {item.photos && item.photos.length > 0 ? (
//           <Image source={{ uri: item.photos[0].url }} style={styles.petImage} />
//         ) : (
//           <View style={[styles.petImage, styles.imagePlaceholder]}>
//             <Ionicons name="paw" size={40} color={theme.colors.gray300} />
//           </View>
//         )}

//         <View style={styles.petInfo}>
//           <View style={styles.nameRow}>
//             <Text style={styles.petName}>{String(item.name)}</Text>
//             <Ionicons
//               name={item.gender === 'male' ? 'male' : item.gender === 'female' ? 'female' : 'help-circle'}
//               size={20}
//               color={item.gender === 'male' ? theme.colors.info : theme.colors.secondary}
//             />
//           </View>

//           <View style={styles.detailRow}>
//             <Ionicons name="paw" size={16} color={theme.colors.primary} />
//             <Text style={styles.detailText}>
//               {String(item.species).charAt(0).toUpperCase() + String(item.species).slice(1)}
//               {item.breed && ` • ${String(item.breed)}`}
//             </Text>
//           </View>

//           {item.age && (
//             <View style={styles.detailRow}>
//               <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
//               <Text style={styles.detailText}>{String(item.age)}</Text>
//             </View>
//           )}

//           {item.isLostFound && (
//             <View
//               style={[
//                 styles.statusBadge,
//                 {
//                   backgroundColor:
//                     item.lostFoundType === 'lost'
//                       ? theme.colors.error + '20'
//                       : theme.colors.success + '20',
//                 },
//               ]}
//             >
//               <Ionicons
//                 name={item.lostFoundType === 'lost' ? 'alert-circle' : 'checkmark-circle'}
//                 size={14}
//                 color={item.lostFoundType === 'lost' ? theme.colors.error : theme.colors.success}
//               />
//               <Text
//                 style={[
//                   styles.statusText,
//                   {
//                     color:
//                       item.lostFoundType === 'lost' ? theme.colors.error : theme.colors.success,
//                   },
//                 ]}
//               >
//                 {String(item.lostFoundType || '').toUpperCase()}
//               </Text>
//             </View>
//           )}
//         </View>
//       </View>

//       {/* Description */}
//       {item.description && (
//         <Text style={styles.description} numberOfLines={2}>
//           {String(item.description)}
//         </Text>
//       )}

//       {/* Health Status */}
//       {item.healthStatus && (
//         <View style={styles.healthBadge}>
//           <Ionicons name="medical" size={14} color={theme.colors.success} />
//           <Text style={styles.healthText}>{String(item.healthStatus)}</Text>
//         </View>
//       )}

//       {/* Actions */}
//       <View style={styles.cardActions}>
//         <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item)}>
//           <Ionicons name="create-outline" size={22} color={theme.colors.primary} />
//           <Text style={styles.actionText}>Edit</Text>
//         </TouchableOpacity>

//         <View style={styles.actionDivider} />

//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => Alert.alert('Share', 'Share pet profile coming soon!')}
//         >
//           <Ionicons name="share-outline" size={22} color={theme.colors.accent} />
//           <Text style={styles.actionText}>Share</Text>
//         </TouchableOpacity>

//         <View style={styles.actionDivider} />

//         <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item)}>
//           <Ionicons name="trash-outline" size={22} color={theme.colors.error} />
//           <Text style={[styles.actionText, { color: theme.colors.error }]}>Remove</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderEmpty = () => (
//     <View style={styles.emptyContainer}>
//       <View style={styles.emptyIcon}>
//         <Ionicons name="paw-outline" size={80} color={theme.colors.gray300} />
//       </View>
//       <Text style={styles.emptyTitle}>No Pets Yet</Text>
//       <Text style={styles.emptyText}>Add your first pet for adoption or lost/found</Text>
//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => navigation.navigate('AddPet')}
//       >
//         <Ionicons name="add-circle" size={20} color={theme.colors.white} />
//         <Text style={styles.addButtonText}>Add Your First Pet</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={theme.colors.primary} />
//         <Text style={styles.loadingText}>Loading your pets...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
//         </TouchableOpacity>
//         <Text style={styles.title}>My Pets</Text>
//         <TouchableOpacity onPress={() => navigation.navigate('AddPet')}>
//           <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
//         </TouchableOpacity>
//       </View>

//       {/* Stats Bar */}
//       {pets.length > 0 && (
//         <View style={styles.statsBar}>
//           <View style={styles.statItem}>
//             <Text style={styles.statValue}>{pets.length}</Text>
//             <Text style={styles.statLabel}>Total Pets</Text>
//           </View>
//           <View style={styles.statDivider} />
//           <View style={styles.statItem}>
//             <Text style={styles.statValue}>
//               {pets.filter((p) => p.status === 'available').length}
//             </Text>
//             <Text style={styles.statLabel}>Available</Text>
//           </View>
//           <View style={styles.statDivider} />
//           <View style={styles.statItem}>
//             <Text style={styles.statValue}>{pets.filter((p) => p.isLostFound).length}</Text>
//             <Text style={styles.statLabel}>Lost/Found</Text>
//           </View>
//         </View>
//       )}

//       {/* Pet List */}
//       <FlatList
//         data={pets}
//         renderItem={renderPetCard}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={renderEmpty}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: theme.colors.background,
//   },
//   loadingText: {
//     marginTop: theme.spacing.md,
//     fontSize: theme.typography.fontSize.md,
//     color: theme.colors.textSecondary,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: theme.spacing.lg,
//     backgroundColor: theme.colors.white,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.gray200,
//   },
//   title: {
//     fontSize: theme.typography.fontSize.xxl,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.textPrimary,
//   },
//   statsBar: {
//     flexDirection: 'row',
//     backgroundColor: theme.colors.white,
//     padding: theme.spacing.lg,
//     marginHorizontal: theme.spacing.lg,
//     marginTop: theme.spacing.lg,
//     borderRadius: theme.borderRadius.lg,
//     ...theme.shadows.sm,
//   },
//   statItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statValue: {
//     fontSize: theme.typography.fontSize.xxl,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.primary,
//   },
//   statLabel: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textSecondary,
//     marginTop: theme.spacing.xs,
//   },
//   statDivider: {
//     width: 1,
//     backgroundColor: theme.colors.gray200,
//   },
//   listContent: {
//     padding: theme.spacing.lg,
//   },
//   card: {
//     backgroundColor: theme.colors.white,
//     borderRadius: theme.borderRadius.xl,
//     padding: theme.spacing.lg,
//     marginBottom: theme.spacing.lg,
//     ...theme.shadows.md,
//   },
//   cardTop: {
//     flexDirection: 'row',
//     marginBottom: theme.spacing.md,
//   },
//   petImage: {
//     width: 100,
//     height: 100,
//     borderRadius: theme.borderRadius.lg,
//     marginRight: theme.spacing.md,
//   },
//   imagePlaceholder: {
//     backgroundColor: theme.colors.gray100,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   petInfo: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   nameRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: theme.spacing.sm,
//   },
//   petName: {
//     fontSize: theme.typography.fontSize.xl,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.textPrimary,
//     flex: 1,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: theme.spacing.xs,
//     gap: theme.spacing.xs,
//   },
//   detailText: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textSecondary,
//     flex: 1,
//   },
//   statusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'flex-start',
//     paddingHorizontal: theme.spacing.sm,
//     paddingVertical: theme.spacing.xs,
//     borderRadius: theme.borderRadius.sm,
//     marginTop: theme.spacing.sm,
//     gap: 4,
//   },
//   statusText: {
//     fontSize: theme.typography.fontSize.xs,
//     fontWeight: theme.typography.fontWeight.bold,
//   },
//   description: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textSecondary,
//     marginBottom: theme.spacing.md,
//     lineHeight: 20,
//   },
//   healthBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: theme.colors.success + '15',
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.sm,
//     borderRadius: theme.borderRadius.sm,
//     alignSelf: 'flex-start',
//     marginBottom: theme.spacing.md,
//     gap: theme.spacing.xs,
//   },
//   healthText: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.success,
//     fontWeight: theme.typography.fontWeight.semibold,
//   },
//   cardActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: theme.colors.gray200,
//     paddingTop: theme.spacing.md,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: theme.spacing.xs,
//     paddingVertical: theme.spacing.sm,
//   },
//   actionDivider: {
//     width: 1,
//     height: 24,
//     backgroundColor: theme.colors.gray200,
//   },
//   actionText: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textPrimary,
//     fontWeight: theme.typography.fontWeight.medium,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: theme.spacing.xxxl * 2,
//   },
//   emptyIcon: {
//     width: 120,
//     height: 120,
//     borderRadius: theme.borderRadius.full,
//     backgroundColor: theme.colors.gray100,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: theme.spacing.xl,
//   },
//   emptyTitle: {
//     fontSize: theme.typography.fontSize.xxl,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.textPrimary,
//     marginBottom: theme.spacing.sm,
//   },
//   emptyText: {
//     fontSize: theme.typography.fontSize.md,
//     color: theme.colors.textSecondary,
//     marginBottom: theme.spacing.xl,
//     textAlign: 'center',
//   },
//   addButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: theme.colors.primary,
//     paddingHorizontal: theme.spacing.xl,
//     paddingVertical: theme.spacing.lg,
//     borderRadius: theme.borderRadius.lg,
//     gap: theme.spacing.sm,
//     ...theme.shadows.md,
//   },
//   addButtonText: {
//     color: theme.colors.white,
//     fontSize: theme.typography.fontSize.md,
//     fontWeight: theme.typography.fontWeight.semibold,
//   },
// });

// export default MyPetsScreen;


import React, { useState, useEffect, useCallback } from 'react';
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

const MyPetsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchMyPets();
    }, [])
  );

  const fetchMyPets = async () => {
    try {
      setLoading(true);
      const response = await petsAPI.getAll({ owner: user?.id });
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
              await petsAPI.delete(pet._id);
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
      {/* Pet Image & Quick Info */}
      <View style={styles.cardTop}>
        {item.photos && item.photos.length > 0 ? (
          <Image source={{ uri: item.photos[0].url }} style={styles.petImage} />
        ) : (
          <View style={[styles.petImage, styles.imagePlaceholder]}>
            <Ionicons name="paw" size={40} color={theme.colors.gray300} />
          </View>
        )}

        <View style={styles.petInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.petName} numberOfLines={1}>{String(item.name)}</Text>
            <Ionicons
              name={item.gender === 'male' ? 'male' : item.gender === 'female' ? 'female' : 'help-circle'}
              size={20}
              color={item.gender === 'male' ? theme.colors.info : theme.colors.secondary}
            />
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="paw" size={16} color={theme.colors.primary} />
            <Text style={styles.detailText} numberOfLines={1}>
              {String(item.species).charAt(0).toUpperCase() + String(item.species).slice(1)}
              {item.breed && ` • ${String(item.breed)}`}
            </Text>
          </View>

          {item.age && (
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.detailText}>{String(item.age)}</Text>
            </View>
          )}

          {item.isLostFound && (
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    item.lostFoundType === 'lost'
                      ? theme.colors.error + '20'
                      : theme.colors.success + '20',
                },
              ]}
            >
              <Ionicons
                name={item.lostFoundType === 'lost' ? 'alert-circle' : 'checkmark-circle'}
                size={14}
                color={item.lostFoundType === 'lost' ? theme.colors.error : theme.colors.success}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      item.lostFoundType === 'lost' ? theme.colors.error : theme.colors.success,
                  },
                ]}
              >
                {String(item.lostFoundType || '').toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Description */}
      {item.description && (
        <Text style={styles.description} numberOfLines={2}>
          {String(item.description)}
        </Text>
      )}

      {/* Health Status */}
      {item.healthStatus && (
        <View style={styles.healthBadge}>
          <Ionicons name="medical" size={14} color={theme.colors.success} />
          <Text style={styles.healthText} numberOfLines={1}>{String(item.healthStatus)}</Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item)}>
          <Ionicons name="create-outline" size={22} color={theme.colors.primary} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Share', 'Share pet profile coming soon!')}
        >
          <Ionicons name="share-outline" size={22} color={theme.colors.accent} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item)}>
          <Ionicons name="trash-outline" size={22} color={theme.colors.error} />
          <Text style={[styles.actionText, { color: theme.colors.error }]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="paw-outline" size={80} color={theme.colors.gray300} />
      </View>
      <Text style={styles.emptyTitle}>No Pets Yet</Text>
      <Text style={styles.emptyText}>Add your first pet for adoption or lost/found</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPet')}
      >
        <Ionicons name="add-circle" size={20} color={theme.colors.white} />
        <Text style={styles.addButtonText}>Add Your First Pet</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your pets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>My Pets</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddPet')}>
          <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      {pets.length > 0 && (
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{pets.length}</Text>
            <Text style={styles.statLabel}>Total Pets</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {pets.filter((p) => p.status === 'available').length}
            </Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{pets.filter((p) => p.isLostFound).length}</Text>
            <Text style={styles.statLabel}>Lost/Found</Text>
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
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
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.gray200,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  cardTop: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  petImage: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.md,
  },
  imagePlaceholder: {
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  petName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  detailText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.sm,
    gap: 4,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  description: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  healthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success + '15',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  healthText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.success,
    fontWeight: theme.typography.fontWeight.semibold,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
    paddingTop: theme.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    flex: 1,
    justifyContent: 'center',
  },
  actionDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.gray200,
  },
  actionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxxl * 2,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
    ...theme.shadows.md,
  },
  addButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default MyPetsScreen;


