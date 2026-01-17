// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   ActivityIndicator,
//   RefreshControl,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { petsAPI } from '../../services/api';
// import theme from '../../theme';

// /**
//  * LostFoundScreen
//  * Dedicated interface for lost & found pets
//  */
// const LostFoundScreen = ({ navigation }) => {
//   const [pets, setPets] = useState([]);
//   const [filteredPets, setFilteredPets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedType, setSelectedType] = useState('all'); // all, lost, found

//   useEffect(() => {
//     loadLostFoundPets();
//   }, []);

//   useEffect(() => {
//     filterPets();
//   }, [searchQuery, selectedType, pets]);

//   const loadLostFoundPets = async () => {
//     try {
//       setLoading(true);
//       const response = await petsAPI.getLostFound();
//       setPets(response.data.pets || []);
//     } catch (error) {
//       console.error('Error loading lost/found pets:', error);
//       Alert.alert('Error', 'Failed to load lost/found pets');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const filterPets = () => {
//     let filtered = pets;

//     // Filter by type
//     if (selectedType !== 'all') {
//       filtered = filtered.filter(p => p.lostFoundType === selectedType);
//     }

//     // Filter by search
//     if (searchQuery) {
//       filtered = filtered.filter(p =>
//         p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.species?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.breed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.address?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     setFilteredPets(filtered);
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     loadLostFoundPets();
//   };

//   const handleReportPet = () => {
//     navigation.navigate('AddPet', { isLostFound: true });
//   };

//   const renderPetCard = ({ item }) => (
//     <TouchableOpacity
//       style={styles.petCard}
//       onPress={() => {/* Navigate to pet details */}}
//     >
//       {/* Pet Image */}
//       {item.photos && item.photos.length > 0 && item.photos[0]?.url ? (
//         <Image source={{ uri: item.photos[0].url }} style={styles.petImage} />
//       ) : (
//         <View style={[styles.petImage, styles.imagePlaceholder]}>
//           <Ionicons name="paw" size={48} color={theme.colors.gray400} />
//         </View>
//       )}

//       {/* Type Badge */}
//       <View style={[
//         styles.typeBadge,
//         { backgroundColor: item.lostFoundType === 'lost' ? theme.colors.error : theme.colors.accent }
//       ]}>
//         <Text style={styles.typeBadgeText}>
//           {item.lostFoundType?.toUpperCase()}
//         </Text>
//       </View>

//       {/* Pet Info */}
//       <View style={styles.petInfo}>
//         <Text style={styles.petName}>{item.name || 'Unknown'}</Text>
//         <Text style={styles.petSpecies}>
//           {item.species?.charAt(0).toUpperCase() + item.species?.slice(1)}
//           {item.breed && ` • ${item.breed}`}
//         </Text>

//         {item.address && (
//           <View style={styles.locationRow}>
//             <Ionicons name="location" size={14} color={theme.colors.textSecondary} />
//             <Text style={styles.locationText} numberOfLines={1}>{item.address}</Text>
//           </View>
//         )}

//         {item.lastSeenDate && (
//           <View style={styles.dateRow}>
//             <Ionicons name="calendar" size={14} color={theme.colors.textSecondary} />
//             <Text style={styles.dateText}>
//               {item.lostFoundType === 'lost' ? 'Last seen: ' : 'Found: '}
//               {new Date(item.lastSeenDate).toLocaleDateString()}
//             </Text>
//           </View>
//         )}

//         {item.description && (
//           <Text style={styles.description} numberOfLines={2}>
//             {item.description}
//           </Text>
//         )}

//         {/* Contact Button */}
//         <TouchableOpacity
//           style={styles.contactButton}
//           onPress={() => Alert.alert('Contact', 'Contact feature coming soon!')}
//         >
//           <Ionicons name="call" size={16} color={theme.colors.white} />
//           <Text style={styles.contactButtonText}>Contact Owner</Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderEmpty = () => (
//     <View style={styles.emptyContainer}>
//       <Ionicons name="paw-outline" size={64} color={theme.colors.gray300} />
//       <Text style={styles.emptyTitle}>No {selectedType === 'all' ? 'Lost/Found' : selectedType} Pets</Text>
//       <Text style={styles.emptyText}>
//         {searchQuery
//           ? 'Try adjusting your search'
//           : 'Be the first to report a lost or found pet'}
//       </Text>
//       <TouchableOpacity style={styles.reportButton} onPress={handleReportPet}>
//         <Ionicons name="add-circle" size={20} color={theme.colors.white} />
//         <Text style={styles.reportButtonText}>Report Pet</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={theme.colors.primary} />
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
//         <Text style={styles.title}>Lost & Found</Text>
//         <TouchableOpacity onPress={handleReportPet}>
//           <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
//         </TouchableOpacity>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Ionicons name="search" size={20} color={theme.colors.gray400} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by name, breed, location..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholderTextColor={theme.colors.gray400}
//         />
//         {searchQuery.length > 0 && (
//           <TouchableOpacity onPress={() => setSearchQuery('')}>
//             <Ionicons name="close-circle" size={20} color={theme.colors.gray400} />
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Type Filters */}
//       <View style={styles.filtersContainer}>
//         <TouchableOpacity
//           style={[styles.filterChip, selectedType === 'all' && styles.filterChipActive]}
//           onPress={() => setSelectedType('all')}
//         >
//           <Text style={[styles.filterText, selectedType === 'all' && styles.filterTextActive]}>
//             All ({pets.length})
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.filterChip, selectedType === 'lost' && styles.filterChipActive]}
//           onPress={() => setSelectedType('lost')}
//         >
//           <Text style={[styles.filterText, selectedType === 'lost' && styles.filterTextActive]}>
//             Lost ({pets.filter(p => p.lostFoundType === 'lost').length})
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.filterChip, selectedType === 'found' && styles.filterChipActive]}
//           onPress={() => setSelectedType('found')}
//         >
//           <Text style={[styles.filterText, selectedType === 'found' && styles.filterTextActive]}>
//             Found ({pets.filter(p => p.lostFoundType === 'found').length})
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Pet List */}
//       <FlatList
//         data={filteredPets}
//         renderItem={renderPetCard}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={renderEmpty}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
//         }
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
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: theme.spacing.lg,
//     backgroundColor: theme.colors.white,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.gray200,
//   },
//   title: {
//     fontSize: theme.typography.fontSize.xl,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.textPrimary,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: theme.colors.white,
//     margin: theme.spacing.lg,
//     paddingHorizontal: theme.spacing.md,
//     borderRadius: theme.borderRadius.lg,
//     borderWidth: 1,
//     borderColor: theme.colors.gray200,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: theme.spacing.md,
//     paddingHorizontal: theme.spacing.sm,
//     fontSize: theme.typography.fontSize.md,
//     color: theme.colors.textPrimary,
//   },
//   filtersContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: theme.spacing.lg,
//     paddingBottom: theme.spacing.md,
//     gap: theme.spacing.sm,
//   },
//   filterChip: {
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.sm,
//     borderRadius: theme.borderRadius.full,
//     backgroundColor: theme.colors.white,
//     borderWidth: 1,
//     borderColor: theme.colors.gray300,
//   },
//   filterChipActive: {
//     backgroundColor: theme.colors.primary,
//     borderColor: theme.colors.primary,
//   },
//   filterText: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textPrimary,
//     fontWeight: theme.typography.fontWeight.medium,
//   },
//   filterTextActive: {
//     color: theme.colors.white,
//   },
//   listContent: {
//     padding: theme.spacing.lg,
//   },
//   petCard: {
//     backgroundColor: theme.colors.white,
//     borderRadius: theme.borderRadius.lg,
//     marginBottom: theme.spacing.md,
//     overflow: 'hidden',
//     ...theme.shadows.sm,
//   },
//   petImage: {
//     width: '100%',
//     height: 200,
//     backgroundColor: theme.colors.gray200,
//   },
//   imagePlaceholder: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   typeBadge: {
//     position: 'absolute',
//     top: theme.spacing.md,
//     right: theme.spacing.md,
//     paddingHorizontal: theme.spacing.sm,
//     paddingVertical: theme.spacing.xs,
//     borderRadius: theme.borderRadius.sm,
//   },
//   typeBadgeText: {
//     color: theme.colors.white,
//     fontSize: theme.typography.fontSize.xs,
//     fontWeight: theme.typography.fontWeight.bold,
//   },
//   petInfo: {
//     padding: theme.spacing.md,
//   },
//   petName: {
//     fontSize: theme.typography.fontSize.lg,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.textPrimary,
//     marginBottom: theme.spacing.xs,
//   },
//   petSpecies: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textSecondary,
//     marginBottom: theme.spacing.sm,
//   },
//   locationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: theme.spacing.xs,
//     gap: 4,
//   },
//   locationText: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textSecondary,
//     flex: 1,
//   },
//   dateRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: theme.spacing.sm,
//     gap: 4,
//   },
//   dateText: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textSecondary,
//   },
//   description: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textSecondary,
//     marginBottom: theme.spacing.md,
//     lineHeight: 20,
//   },
//   contactButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: theme.colors.primary,
//     paddingVertical: theme.spacing.sm,
//     borderRadius: theme.borderRadius.md,
//     gap: theme.spacing.xs,
//   },
//   contactButtonText: {
//     color: theme.colors.white,
//     fontSize: theme.typography.fontSize.sm,
//     fontWeight: theme.typography.fontWeight.semibold,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: theme.spacing.xxl * 2,
//   },
//   emptyTitle: {
//     fontSize: theme.typography.fontSize.xl,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.textPrimary,
//     marginTop: theme.spacing.lg,
//   },
//   emptyText: {
//     fontSize: theme.typography.fontSize.md,
//     color: theme.colors.textSecondary,
//     marginTop: theme.spacing.sm,
//     marginBottom: theme.spacing.xl,
//     textAlign: 'center',
//   },
//   reportButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: theme.colors.primary,
//     paddingHorizontal: theme.spacing.xl,
//     paddingVertical: theme.spacing.md,
//     borderRadius: theme.borderRadius.lg,
//     gap: theme.spacing.sm,
//   },
//   reportButtonText: {
//     color: theme.colors.white,
//     fontSize: theme.typography.fontSize.md,
//     fontWeight: theme.typography.fontWeight.semibold,
//   },
// });

// export default LostFoundScreen;


import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { petsAPI } from "../../services/api";
import theme from "../../theme";

const LostFoundScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    loadLostFoundPets();
  }, []);

  useEffect(() => {
    filterPets();
  }, [searchQuery, selectedType, pets]);

  const loadLostFoundPets = async () => {
    try {
      setLoading(true);
      const response = await petsAPI.getLostFound();
      setPets(response.data.pets || []);
    } catch (error) {
      console.error("Error loading lost/found pets:", error);
      Alert.alert("Error", "Failed to load lost/found pets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterPets = () => {
    let filtered = pets;

    if (selectedType !== "all") {
      filtered = filtered.filter(p => p.lostFoundType === selectedType);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase())
        || p.species?.toLowerCase().includes(searchQuery.toLowerCase())
        || p.breed?.toLowerCase().includes(searchQuery.toLowerCase())
        || p.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPets(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadLostFoundPets();
  };

  const handleReportPet = () => {
    navigation.navigate("AddPet", { isLostFound: true });
  };

  const renderPetCard = ({ item }) => (
    <TouchableOpacity
      style={styles.petCard}
      onPress={() => Alert.alert("Pet Details", "Details coming soon!")}
    >
      {/* Pet Image */}
      {item.photos && item.photos.length > 0 && item.photos[0]?.url
        ? <Image source={{ uri: item.photos[0].url }} style={styles.petImage} />
        : (
          <View style={[styles.petImage, styles.imagePlaceholder]}>
            <Ionicons name="paw" size={48} color={theme.colors.gray400} />
          </View>
        )}

      {/* Type Badge */}
      <View
        style={[
          styles.typeBadge,
          { backgroundColor: item.lostFoundType === "lost" ? theme.colors.error : theme.colors.accent },
        ]}
      >
        <Text style={styles.typeBadgeText}>
          {item.lostFoundType?.toUpperCase()}
        </Text>
      </View>

      {/* Pet Info */}
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name || "Unknown"}</Text>
        <Text style={styles.petSpecies}>
          {item.species?.charAt(0).toUpperCase() + item.species?.slice(1)}
          {item.breed && ` • ${item.breed}`}
        </Text>

        {item.address && (
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.locationText} numberOfLines={1}>{item.address}</Text>
          </View>
        )}

        {item.lastSeenDate && (
          <View style={styles.dateRow}>
            <Ionicons name="calendar" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.dateText}>
              {item.lostFoundType === "lost" ? "Last seen: " : "Found: "}
              {new Date(item.lastSeenDate).toLocaleDateString()}
            </Text>
          </View>
        )}

        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        {/* Contact Button */}
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => Alert.alert("Contact", "Contact feature coming soon!")}
        >
          <Ionicons name="call" size={16} color={theme.colors.white} />
          <Text style={styles.contactButtonText}>Contact Owner</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="paw-outline" size={64} color={theme.colors.gray300} />
      <Text style={styles.emptyTitle}>No {selectedType === "all" ? "Lost/Found" : selectedType} Pets</Text>
      <Text style={styles.emptyText}>
        {searchQuery
          ? "Try adjusting your search"
          : "Be the first to report a lost or found pet"}
      </Text>
      <TouchableOpacity style={styles.reportButton} onPress={handleReportPet}>
        <Ionicons name="add-circle" size={20} color={theme.colors.white} />
        <Text style={styles.reportButtonText}>Report Pet</Text>
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Lost & Found</Text>
        <TouchableOpacity onPress={handleReportPet}>
          <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.colors.gray400} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, breed, location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.colors.gray400}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={theme.colors.gray400} />
          </TouchableOpacity>
        )}
      </View>

      {/* Type Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterChip, selectedType === "all" && styles.filterChipActive]}
          onPress={() => setSelectedType("all")}
        >
          <Text style={[styles.filterText, selectedType === "all" && styles.filterTextActive]}>
            All ({pets.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, selectedType === "lost" && styles.filterChipActive]}
          onPress={() => setSelectedType("lost")}
        >
          <Text style={[styles.filterText, selectedType === "lost" && styles.filterTextActive]}>
            Lost ({pets.filter(p => p.lostFoundType === "lost").length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, selectedType === "found" && styles.filterChipActive]}
          onPress={() => setSelectedType("found")}
        >
          <Text style={[styles.filterText, selectedType === "found" && styles.filterTextActive]}>
            Found ({pets.filter(p => p.lostFoundType === "found").length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Pet List */}
      <FlatList
        data={filteredPets}
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
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  filtersContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  filterTextActive: {
    color: theme.colors.white,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  petCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
    ...theme.shadows.sm,
  },
  petImage: {
    width: "100%",
    height: 200,
    backgroundColor: theme.colors.gray200,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  typeBadge: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  typeBadgeText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  petInfo: {
    padding: theme.spacing.md,
  },
  petName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  petSpecies: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
    gap: 4,
  },
  locationText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    gap: 4,
  },
  dateText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  description: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "center",
    justifyContent: "center",
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
    textAlign: "center",
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  reportButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default LostFoundScreen;

