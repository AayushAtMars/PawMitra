// // UI Component: Adoption pet card for horizontal carousel
// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import theme from '../theme';

// const PetCard = ({
//   pet,
//   onPress,
//   onFavorite,
//   isFavorited = false,
//   style
// }) => {
//   const [favorited, setFavorited] = useState(isFavorited);

//   const handleFavorite = () => {
//     setFavorited(!favorited);
//     onFavorite?.(pet);
//   };

//   const getGenderIcon = (gender) => {
//     if (gender === 'male') return 'male';
//     if (gender === 'female') return 'female';
//     return 'help-circle-outline';
//   };

//   const getGenderColor = (gender) => {
//     if (gender === 'male') return theme.colors.info;
//     if (gender === 'female') return theme.colors.secondary;
//     return theme.colors.gray400;
//   };

//   return (
//     <TouchableOpacity
//       style={[styles.card, style]}
//       onPress={() => onPress?.(pet)}
//       activeOpacity={0.9}
//     >
//       {/* Pet Image */}
//       <View style={styles.imageContainer}>
//         {pet.photos && pet.photos.length > 0 ? (
//           <Image
//             source={{ uri: pet.photos[0].url }}
//             style={styles.image}
//             resizeMode="cover"
//           />
//         ) : (
//           <View style={styles.imagePlaceholder}>
//             <Ionicons name="paw" size={48} color={theme.colors.gray300} />
//           </View>
//         )}

//         {/* Favorite Button */}
//         <TouchableOpacity
//           style={styles.favoriteButton}
//           onPress={handleFavorite}
//           activeOpacity={0.8}
//         >
//           <Ionicons
//             name={favorited ? 'heart' : 'heart-outline'}
//             size={22}
//             color={favorited ? theme.colors.error : theme.colors.white}
//           />
//         </TouchableOpacity>

//         {/* Status Badge */}
//         {pet.status === 'available' && (
//           <View style={styles.statusBadge}>
//             <Text style={styles.statusText}>Available</Text>
//           </View>
//         )}
//       </View>

//       {/* Pet Info */}
//       <View style={styles.info}>
//         <View style={styles.header}>
//           <Text style={styles.name} numberOfLines={1}>
//             {String(pet.name || 'Unknown')}
//           </Text>
//           <Ionicons
//             name={getGenderIcon(pet.gender)}
//             size={18}
//             color={getGenderColor(pet.gender)}
//           />
//         </View>

//         <View style={styles.details}>
//           <View style={styles.detailRow}>
//             <Ionicons name="paw" size={14} color={theme.colors.textSecondary} />
//             <Text style={styles.detailText}>
//               {typeof pet.breed === 'string' ? pet.breed : (typeof pet.species === 'string' ? pet.species : 'Mixed')}
//             </Text>
//           </View>

//           {pet.age && (
//             <View style={styles.detailRow}>
//               <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
//               <Text style={styles.detailText}>
//                 {typeof pet.age === 'object' ? `${pet.age.value} ${pet.age.unit}` : String(pet.age)}
//               </Text>
//             </View>
//           )}
//         </View>

//         {pet.address && (
//           <View style={styles.location}>
//             <Ionicons name="location" size={12} color={theme.colors.primary} />
//             <Text style={styles.locationText} numberOfLines={1}>
//               {String(pet.address)}
//             </Text>
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     width: 200,
//     backgroundColor: theme.colors.white,
//     borderRadius: theme.borderRadius.lg,
//     overflow: 'hidden',
//     marginRight: theme.spacing.md,
//     ...theme.shadows.md,
//   },
//   imageContainer: {
//     position: 'relative',
//     height: 180,
//     backgroundColor: theme.colors.gray100,
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
//   imagePlaceholder: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: theme.colors.gray100,
//   },
//   favoriteButton: {
//     position: 'absolute',
//     top: theme.spacing.sm,
//     right: theme.spacing.sm,
//     width: 36,
//     height: 36,
//     borderRadius: theme.borderRadius.full,
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   statusBadge: {
//     position: 'absolute',
//     bottom: theme.spacing.sm,
//     left: theme.spacing.sm,
//     backgroundColor: theme.colors.success,
//     paddingHorizontal: theme.spacing.sm,
//     paddingVertical: theme.spacing.xs,
//     borderRadius: theme.borderRadius.sm,
//   },
//   statusText: {
//     fontSize: theme.typography.fontSize.xs,
//     fontWeight: theme.typography.fontWeight.semibold,
//     color: theme.colors.white,
//   },
//   info: {
//     padding: theme.spacing.md,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: theme.spacing.xs,
//   },
//   name: {
//     flex: 1,
//     fontSize: theme.typography.fontSize.lg,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.textPrimary,
//     marginRight: theme.spacing.xs,
//   },
//   details: {
//     gap: theme.spacing.xs,
//     marginBottom: theme.spacing.sm,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: theme.spacing.xs,
//   },
//   detailText: {
//     fontSize: theme.typography.fontSize.sm,
//     color: theme.colors.textSecondary,
//   },
//   location: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     paddingTop: theme.spacing.xs,
//     borderTopWidth: 1,
//     borderTopColor: theme.colors.gray100,
//   },
//   locationText: {
//     flex: 1,
//     fontSize: theme.typography.fontSize.xs,
//     color: theme.colors.primary,
//   },
// });

// export default PetCard;

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../theme";

const { width } = Dimensions.get("window");

const PetCard = ({ pet, onPress, onFavorite, style }) => {
  if (!pet) return null;

  const getGenderIcon = (gender) => {
    if (gender === "male") return "male";
    if (gender === "female") return "female";
    return "help-circle-outline";
  };

  const getGenderColor = (gender) => {
    if (gender === "male") return theme.colors.info;
    if (gender === "female") return theme.colors.secondary;
    return theme.colors.gray400;
  };

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={() => onPress?.(pet)}
      activeOpacity={0.7}
    >
      {/* Pet Image */}
      <View style={styles.imageContainer}>
        {pet.photos && pet.photos.length > 0 && pet.photos[0]?.url
          ? (
            <Image
              source={{ uri: pet.photos[0].url }}
              style={styles.image}
              resizeMode="cover"
            />
          )
          : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="paw" size={48} color={theme.colors.gray300} />
            </View>
          )}

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            onFavorite?.(pet);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="heart-outline" size={24} color={theme.colors.white} />
        </TouchableOpacity>

        {/* Lost/Found Badge */}
        {pet.isLostFound && (
          <View
            style={[
              styles.lostFoundBadge,
              {
                backgroundColor: pet.lostFoundType === "lost"
                  ? theme.colors.error
                  : theme.colors.accent,
              },
            ]}
          >
            <Text style={styles.lostFoundText}>
              {String(pet.lostFoundType || "").toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Pet Info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {String(pet.name || "Unknown")}
          </Text>
          <Ionicons
            name={getGenderIcon(pet.gender)}
            size={18}
            color={getGenderColor(pet.gender)}
          />
        </View>

        <Text style={styles.species} numberOfLines={1}>
          {pet.species
            ? String(pet.species).charAt(0).toUpperCase() + String(pet.species).slice(1)
            : "Pet"}
          {pet.breed && ` • ${String(pet.breed)}`}
        </Text>

        {pet.age && (
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>
              {String(pet.age)}
            </Text>
          </View>
        )}

        {pet.address && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>
              {String(pet.address)}
            </Text>
          </View>
        )}

        {/* Health Badge */}
        {pet.healthStatus && (
          <View style={styles.healthBadge}>
            <Ionicons name="checkmark-circle" size={12} color={theme.colors.success} />
            <Text style={styles.healthText} numberOfLines={1}>
              {String(pet.healthStatus).includes("Vaccinated") ? "Vaccinated" : "Healthy"}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
    ...theme.shadows.md,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.gray100,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  lostFoundBadge: {
    position: "absolute",
    bottom: theme.spacing.sm,
    left: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  lostFoundText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  info: {
    padding: theme.spacing.md,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xs,
  },
  name: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  species: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
    gap: 4,
  },
  detailText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  healthBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: theme.colors.success + "15",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.xs,
    gap: 4,
  },
  healthText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.success,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default PetCard;


