// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   RefreshControl,
//   Dimensions,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { petsAPI } from '../../services/api';
// import theme from '../../theme';

// const { width } = Dimensions.get('window');
// const CARD_WIDTH = width - 40;

// const AdoptionScreen = ({ navigation }) => {
//   const [pets, setPets] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [showLostFound, setShowLostFound] = useState(false);

//   useEffect(() => {
//     loadPets();
//   }, [showLostFound]);

//   const loadPets = async () => {
//     try {
//       setLoading(true);
//       const response = showLostFound
//         ? await petsAPI.getLostFound()
//         : await petsAPI.getAll({ status: 'available' });
      
//       if (response.data.success) {
//         setPets(response.data.pets);
//         setCurrentIndex(0);
//       }
//     } catch (error) {
//       console.error('Error loading pets:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSwipeLeft = () => {
//     if (currentIndex < pets.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   const handleSwipeRight = async () => {
//     const currentPet = pets[currentIndex];
    
//     try {
//       await petsAPI.expressInterest(currentPet._id, {
//         message: 'I am interested in adopting this pet!',
//       });
      
//       if (currentIndex < pets.length - 1) {
//         setCurrentIndex(currentIndex + 1);
//       }
//     } catch (error) {
//       console.error('Error expressing interest:', error);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadPets();
//     setRefreshing(false);
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={theme.colors.primary} />
//       </View>
//     );
//   }

//   const currentPet = pets[currentIndex];

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>
//           {showLostFound ? 'Lost & Found' : 'Pet Adoption'}
//         </Text>
//         <TouchableOpacity
//           style={styles.toggleButton}
//           onPress={() => setShowLostFound(!showLostFound)}
//         >
//           <Ionicons
//             name={showLostFound ? 'paw' : 'search'}
//             size={24}
//             color={theme.colors.primary}
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Pet Cards */}
//       {pets.length === 0 ? (
//         <ScrollView
//           contentContainerStyle={styles.emptyContainer}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//         >
//           <Ionicons name="paw-outline" size={64} color={theme.colors.gray300} />
//           <Text style={styles.emptyText}>No pets available</Text>
//           <Text style={styles.emptySubtext}>
//             {showLostFound
//               ? 'No lost or found pets in your area'
//               : 'Check back later for new pets'}
//           </Text>
//         </ScrollView>
//       ) : (
//         <>
//           <View style={styles.cardContainer}>
//             {currentPet && (
//               <View style={styles.card}>
//                 {/* Pet Image */}
//                 {currentPet.photos && currentPet.photos.length > 0 && currentPet.photos[0]?.url ? (
//                   <Image
//                     source={{ uri: currentPet.photos[0].url }}
//                     style={styles.petImage}
//                     resizeMode="cover"
//                   />
//                 ) : (
//                   <View style={[styles.petImage, styles.imagePlaceholder]}>
//                     <Ionicons name="paw" size={64} color={theme.colors.gray400} />
//                   </View>
//                 )}

//                 {/* Pet Info */}
//                 <View style={styles.petInfo}>
//                   <View style={styles.petHeader}>
//                     <Text style={styles.petName}>{currentPet.name}</Text>
//                     {currentPet.isLostFound && (
//                       <View
//                         style={[
//                           styles.lostFoundBadge,
//                           {
//                             backgroundColor:
//                               currentPet.lostFoundType === 'lost'
//                                 ? theme.colors.error
//                                 : theme.colors.accent,
//                           },
//                         ]}
//                       >
//                         <Text style={styles.lostFoundText}>
//                           {currentPet.lostFoundType?.toUpperCase()}
//                         </Text>
//                       </View>
//                     )}
//                   </View>

//                   <View style={styles.petDetails}>
//                     <View style={styles.detailItem}>
//                       <Ionicons name="paw" size={16} color={theme.colors.textSecondary} />
//                       <Text style={styles.detailText}>
//                         {currentPet.species?.charAt(0).toUpperCase() + currentPet.species?.slice(1)}
//                       </Text>
//                     </View>
//                     {currentPet.breed && (
//                       <View style={styles.detailItem}>
//                         <Ionicons name="ribbon" size={16} color={theme.colors.textSecondary} />
//                         <Text style={styles.detailText}>{currentPet.breed}</Text>
//                       </View>
//                     )}
//                     {currentPet.age && (
//                       <View style={styles.detailItem}>
//                         <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
//                         <Text style={styles.detailText}>
//                           {typeof currentPet.age === 'object' 
//                             ? `${currentPet.age.value} ${currentPet.age.unit}${currentPet.age.value > 1 ? 's' : ''}`
//                             : currentPet.age}
//                         </Text>
//                       </View>
//                     )}
//                     {currentPet.gender && (
//                       <View style={styles.detailItem}>
//                         <Ionicons
//                           name={currentPet.gender === 'male' ? 'male' : 'female'}
//                           size={16}
//                           color={theme.colors.textSecondary}
//                         />
//                         <Text style={styles.detailText}>
//                           {currentPet.gender.charAt(0).toUpperCase() + currentPet.gender.slice(1)}
//                         </Text>
//                       </View>
//                     )}
//                     {currentPet.size && (
//                       <View style={styles.detailItem}>
//                         <Ionicons name="resize" size={16} color={theme.colors.textSecondary} />
//                         <Text style={styles.detailText}>
//                           {typeof currentPet.size === 'object'
//                             ? currentPet.size.category || 'Unknown'
//                             : currentPet.size}
//                         </Text>
//                       </View>
//                     )}
//                   </View>

//                   {currentPet.description && (
//                     <Text style={styles.description} numberOfLines={3}>
//                       {currentPet.description}
//                     </Text>
//                   )}

//                   {currentPet.healthStatus && (
//                     <View style={styles.healthSection}>
//                       <Ionicons name="medical" size={16} color={theme.colors.accent} />
//                       <Text style={styles.healthText}>
//                         {typeof currentPet.healthStatus === 'object'
//                           ? `${currentPet.healthStatus.vaccinated ? 'Vaccinated' : 'Not Vaccinated'}${currentPet.healthStatus.neutered ? ', Neutered' : ''}`
//                           : currentPet.healthStatus}
//                       </Text>
//                     </View>
//                   )}

//                   {currentPet.address && (
//                     <View style={styles.locationSection}>
//                       <Ionicons name="location" size={16} color={theme.colors.primary} />
//                       <Text style={styles.locationText} numberOfLines={1}>
//                         {currentPet.address}
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//               </View>
//             )}
//           </View>

//           {/* Swipe Controls */}
//           <View style={styles.controls}>
//             <TouchableOpacity
//               style={[styles.controlButton, styles.rejectButton]}
//               onPress={handleSwipeLeft}
//             >
//               <Ionicons name="close" size={32} color={theme.colors.white} />
//             </TouchableOpacity>

//             <View style={styles.counterContainer}>
//               <Text style={styles.counterText}>
//                 {currentIndex + 1} / {pets.length}
//               </Text>
//             </View>

//             <TouchableOpacity
//               style={[styles.controlButton, styles.likeButton]}
//               onPress={handleSwipeRight}
//             >
//               <Ionicons name="heart" size={32} color={theme.colors.white} />
//             </TouchableOpacity>
//           </View>

//           {/* Instructions */}
//           <View style={styles.instructions}>
//             <Text style={styles.instructionText}>
//               ❌ Skip • ❤️ Interested
//             </Text>
//           </View>
//         </>
//       )}
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
//     fontSize: theme.typography.fontSize.xxl,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.textPrimary,
//   },
//   toggleButton: {
//     padding: theme.spacing.sm,
//   },
//   cardContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: theme.spacing.lg,
//   },
//   card: {
//     width: CARD_WIDTH,
//     backgroundColor: theme.colors.white,
//     borderRadius: theme.borderRadius.xxl,
//     overflow: 'hidden',
//     ...theme.shadows.xl,
//   },
//   petImage: {
//     width: '100%',
//     height: 300,
//     backgroundColor: theme.colors.gray200,
//   },
//   imagePlaceholder: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   petInfo: {
//     padding: theme.spacing.lg,
//   },
//   petHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: theme.spacing.md,
//   },
//   petName: {
//     fontSize: theme.typography.fontSize.xxl,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.textPrimary,
//   },
//   lostFoundBadge: {
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.xs,
//     borderRadius: theme.borderRadius.full,
//   },
//   lostFoundText: {
//     color: theme.colors.white,
//     fontSize: theme.typography.fontSize.xs,
//     fontWeight: theme.typography.fontWeight.bold,
//   },
//   petDetails: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: theme.spacing.md,
//     marginBottom: theme.spacing.md,
//   },
//   detailItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: theme.spacing.xs,
//   },
//   detailText: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textSecondary,
//   },
//   description: {
//     fontSize: theme.typography.fontSize.md,
//     color: theme.colors.textPrimary,
//     marginBottom: theme.spacing.md,
//     lineHeight: 22,
//   },
//   healthSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: theme.spacing.sm,
//     backgroundColor: theme.colors.accent + '10',
//     padding: theme.spacing.sm,
//     borderRadius: theme.borderRadius.md,
//     marginBottom: theme.spacing.sm,
//   },
//   healthText: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.accent,
//     fontWeight: theme.typography.fontWeight.medium,
//   },
//   locationSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: theme.spacing.sm,
//   },
//   locationText: {
//     flex: 1,
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textSecondary,
//   },
//   controls: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: theme.spacing.lg,
//     gap: theme.spacing.xl,
//   },
//   controlButton: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...theme.shadows.lg,
//   },
//   rejectButton: {
//     backgroundColor: theme.colors.gray500,
//   },
//   likeButton: {
//     backgroundColor: theme.colors.secondary,
//   },
//   counterContainer: {
//     paddingHorizontal: theme.spacing.lg,
//   },
//   counterText: {
//     fontSize: theme.typography.fontSize.lg,
//     fontWeight: theme.typography.fontWeight.semibold,
//     color: theme.colors.textPrimary,
//   },
//   instructions: {
//     alignItems: 'center',
//     paddingBottom: theme.spacing.lg,
//   },
//   instructionText: {
//     fontSize: theme.typography.fontSize.md,
//     color: theme.colors.textSecondary,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: theme.spacing.xl,
//   },
//   emptyText: {
//     fontSize: theme.typography.fontSize.lg,
//     fontWeight: theme.typography.fontWeight.medium,
//     color: theme.colors.textSecondary,
//     marginTop: theme.spacing.md,
//   },
//   emptySubtext: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textSecondary,
//     marginTop: theme.spacing.xs,
//     textAlign: 'center',
//   },
// });

// export default AdoptionScreen;


import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { petsAPI } from "../../services/api";
import theme from "../../theme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

const AdoptionScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLostFound, setShowLostFound] = useState(false);

  useEffect(() => {
    loadPets();
  }, [showLostFound]);

  const loadPets = async () => {
    try {
      setLoading(true);
      const response = showLostFound
        ? await petsAPI.getLostFound()
        : await petsAPI.getAll({ status: "available" });

      if (response.data.success || Array.isArray(response.data.pets)) {
        setPets(response.data.pets || []);
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error("Error loading pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeLeft = () => {
    if (currentIndex < pets.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert("End of list", "Check back later for more pets!");
    }
  };

  // --- UPDATED LOGIC ---
  const handleSwipeRight = async () => {
    const currentPet = pets[currentIndex];

    try {
      // 1. Save locally to "Saved Pets"
      const savedData = await AsyncStorage.getItem("savedPets");
      let savedList = savedData ? JSON.parse(savedData) : [];

      // Avoid duplicates
      if (!savedList.find(p => p._id === currentPet._id)) {
        savedList.push(currentPet);
        await AsyncStorage.setItem("savedPets", JSON.stringify(savedList));
        Alert.alert("Saved!", `${currentPet.name} has been added to your Saved Pets.`);
      }

      // 2. Optional: Call API if you want to notify backend
      // await petsAPI.expressInterest(currentPet._id, { message: 'Interested' });

      // 3. Move to next card
      if (currentIndex < pets.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        Alert.alert("That's all!", "You've gone through all available pets.");
      }
    } catch (error) {
      console.error("Error saving pet:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPets();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const currentPet = pets[currentIndex];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {showLostFound ? "Lost & Found" : "Pet Adoption"}
        </Text>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowLostFound(!showLostFound)}
        >
          <Ionicons
            name={showLostFound ? "paw" : "search"}
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Pet Cards */}
      {pets.length === 0 || !currentPet
        ? (
          <ScrollView
            contentContainerStyle={styles.emptyContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            <Ionicons name="paw-outline" size={64} color={theme.colors.gray300} />
            <Text style={styles.emptyText}>No pets available</Text>
            <Text style={styles.emptySubtext}>
              {showLostFound
                ? "No lost or found pets in your area"
                : "Check back later for new pets"}
            </Text>
          </ScrollView>
        )
        : (
          <>
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                {/* Pet Image */}
                {currentPet.photos && currentPet.photos.length > 0
                  ? (
                    <Image
                      source={{ uri: currentPet.photos[0].url || currentPet.photos[0] }}
                      style={styles.petImage}
                      resizeMode="cover"
                    />
                  )
                  : (
                    <View style={[styles.petImage, styles.imagePlaceholder]}>
                      <Ionicons name="paw" size={64} color={theme.colors.gray400} />
                    </View>
                  )}

                {/* Pet Info */}
                <View style={styles.petInfo}>
                  <View style={styles.petHeader}>
                    <Text style={styles.petName}>{currentPet.name}</Text>
                    {currentPet.isLostFound && (
                      <View
                        style={[styles.lostFoundBadge, {
                          backgroundColor: currentPet.lostFoundType === "lost"
                            ? theme.colors.error
                            : theme.colors.accent,
                        }]}
                      >
                        <Text style={styles.lostFoundText}>
                          {currentPet.lostFoundType?.toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.petDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="paw" size={16} color={theme.colors.textSecondary} />
                      <Text style={styles.detailText}>
                        {currentPet.species || "Unknown"}
                      </Text>
                    </View>
                    {currentPet.breed && (
                      <View style={styles.detailItem}>
                        <Ionicons name="ribbon" size={16} color={theme.colors.textSecondary} />
                        <Text style={styles.detailText}>{currentPet.breed}</Text>
                      </View>
                    )}
                  </View>

                  {currentPet.description && (
                    <Text style={styles.description} numberOfLines={3}>
                      {currentPet.description}
                    </Text>
                  )}

                  <View style={styles.locationSection}>
                    <Ionicons name="location" size={16} color={theme.colors.primary} />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {currentPet.address || "Location not provided"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Swipe Controls */}
            <View style={styles.controls}>
              <TouchableOpacity
                style={[styles.controlButton, styles.rejectButton]}
                onPress={handleSwipeLeft}
              >
                <Ionicons name="close" size={32} color={theme.colors.white} />
              </TouchableOpacity>

              <View style={styles.counterContainer}>
                <Text style={styles.counterText}>
                  {currentIndex + 1} / {pets.length}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.controlButton, styles.likeButton]}
                onPress={handleSwipeRight}
              >
                <Ionicons name="heart" size={32} color={theme.colors.white} />
              </TouchableOpacity>
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
              <Text style={styles.instructionText}>
                ❌ Skip • ❤️ Save to Favorites
              </Text>
            </View>
          </>
        )}
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
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  toggleButton: {
    padding: theme.spacing.sm,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxl,
    overflow: "hidden",
    ...theme.shadows.xl,
  },
  petImage: {
    width: "100%",
    height: 300,
    backgroundColor: theme.colors.gray200,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  petInfo: {
    padding: theme.spacing.lg,
  },
  petHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  petName: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  lostFoundBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  lostFoundText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  petDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  detailText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  description: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  locationSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginTop: 8,
  },
  locationText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
    gap: theme.spacing.xl,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.lg,
  },
  rejectButton: {
    backgroundColor: theme.colors.gray500,
  },
  likeButton: {
    backgroundColor: theme.colors.secondary,
  },
  counterContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  counterText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  instructions: {
    alignItems: "center",
    paddingBottom: theme.spacing.lg,
  },
  instructionText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
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
    textAlign: "center",
  },
});

export default AdoptionScreen;