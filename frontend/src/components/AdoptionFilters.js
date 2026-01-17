// // UI Component: Adoption filters modal with chip-based selection
// import React from "react";
// import {
//   Modal,
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import theme from "../theme";

// const AdoptionFilters = ({
//   visible,
//   filters,
//   onChangeFilter,
//   onClear,
//   onClose,
// }) => {
//   const filterOptions = {
//     species: [
//       { label: "All", value: "all", icon: "apps" },
//       { label: "Dogs", value: "dog", icon: "🐕" },
//       { label: "Cats", value: "cat", icon: "🐈" },
//       { label: "Others", value: "other", icon: "🐾" },
//     ],
//     gender: [
//       { label: "All", value: "all", icon: "apps" },
//       { label: "Male", value: "male", icon: "male" },
//       { label: "Female", value: "female", icon: "female" },
//     ],
//     size: [
//       { label: "All", value: "all", icon: "apps" },
//       { label: "Small", value: "small", icon: "🐁" },
//       { label: "Medium", value: "medium", icon: "🐕" },
//       { label: "Large", value: "large", icon: "🐎" },
//     ],
//     age: [
//       { label: "All", value: "all", icon: "apps" },
//       { label: "Puppy/Kitten", value: "puppy", icon: "🐣" },
//       { label: "Adult", value: "adult", icon: "🦴" },
//       { label: "Senior", value: "senior", icon: "🎖️" },
//     ],
//     vaccinated: [
//       { label: "All", value: "all", icon: "apps" },
//       { label: "Vaccinated", value: "yes", icon: "checkmark-circle" },
//       { label: "Not Vaccinated", value: "no", icon: "close-circle" },
//     ],
//   };

//   const renderFilterSection = (title, filterKey) => (
//     <View style={styles.filterSection}>
//       <Text style={styles.filterTitle}>{title}</Text>
//       <View style={styles.filterChips}>
//         {filterOptions[filterKey].map((option) => {
//           const isActive = filters[filterKey] === option.value;
//           return (
//             <TouchableOpacity
//               key={option.value}
//               style={[styles.chip, isActive && styles.chipActive]}
//               onPress={() => onChangeFilter(filterKey, option.value)}
//             >
//               {option.icon.startsWith("🐕") ||
//               option.icon.startsWith("🐈") ||
//               option.icon.startsWith("🐾") ||
//               option.icon.startsWith("🐁") ||
//               option.icon.startsWith("🐎") ||
//               option.icon.startsWith("🐣") ||
//               option.icon.startsWith("🦴") ||
//               option.icon.startsWith("🎖️") ? (
//                 <Text style={styles.emoji}>{option.icon}</Text>
//               ) : (
//                 <Ionicons
//                   name={option.icon}
//                   size={18}
//                   color={isActive ? theme.colors.white : theme.colors.gray600}
//                 />
//               )}
//               <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
//                 {option.label}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           {/* Header */}
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Filters</Text>
//             <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
//               <Ionicons name="close" size={28} color={theme.colors.textPrimary} />
//             </TouchableOpacity>
//           </View>

//           {/* Filters */}
//           <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//             {renderFilterSection("Species", "species")}
//             {renderFilterSection("Gender", "gender")}
//             {renderFilterSection("Size", "size")}
//             {renderFilterSection("Age", "age")}
//             {renderFilterSection("Vaccination Status", "vaccinated")}
//           </ScrollView>

//           {/* Actions */}
//           <View style={styles.modalActions}>
//             <TouchableOpacity style={styles.clearButton} onPress={onClear}>
//               <Text style={styles.clearButtonText}>Clear All</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.applyButton} onPress={onClose}>
//               <Text style={styles.applyButtonText}>Apply Filters</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: "flex-end",
//     backgroundColor: theme.colors.overlay,
//   },
//   modalContent: {
//     backgroundColor: theme.colors.white,
//     borderTopLeftRadius: theme.borderRadius.xxl,
//     borderTopRightRadius: theme.borderRadius.xxl,
//     maxHeight: "85%",
//     ...theme.shadows.xl,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: theme.spacing.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.gray200,
//   },
//   modalTitle: {
//     fontSize: theme.typography.fontSize.xxl,
//     fontWeight: theme.typography.fontWeight.bold,
//     color: theme.colors.textPrimary,
//   },
//   scrollView: {
//     padding: theme.spacing.lg,
//   },
//   filterSection: {
//     marginBottom: theme.spacing.xl,
//   },
//   filterTitle: {
//     fontSize: theme.typography.fontSize.lg,
//     fontWeight: theme.typography.fontWeight.semibold,
//     color: theme.colors.textPrimary,
//     marginBottom: theme.spacing.md,
//   },
//   filterChips: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: theme.spacing.sm,
//   },
//   chip: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: theme.spacing.lg,
//     paddingVertical: theme.spacing.md,
//     borderRadius: theme.borderRadius.full,
//     backgroundColor: theme.colors.gray100,
//     gap: theme.spacing.sm,
//   },
//   chipActive: {
//     backgroundColor: theme.colors.primary,
//   },
//   emoji: {
//     fontSize: 18,
//   },
//   chipText: {
//     fontSize: theme.typography.fontSize.md,
//     color: theme.colors.gray600,
//     fontWeight: theme.typography.fontWeight.medium,
//   },
//   chipTextActive: {
//     color: theme.colors.white,
//   },
//   modalActions: {
//     flexDirection: "row",
//     padding: theme.spacing.lg,
//     gap: theme.spacing.md,
//     borderTopWidth: 1,
//     borderTopColor: theme.colors.gray200,
//   },
//   clearButton: {
//     flex: 1,
//     paddingVertical: theme.spacing.lg,
//     borderRadius: theme.borderRadius.lg,
//     backgroundColor: theme.colors.gray100,
//     alignItems: "center",
//   },
//   clearButtonText: {
//     fontSize: theme.typography.fontSize.md,
//     fontWeight: theme.typography.fontWeight.semibold,
//     color: theme.colors.textPrimary,
//   },
//   applyButton: {
//     flex: 1,
//     paddingVertical: theme.spacing.lg,
//     borderRadius: theme.borderRadius.lg,
//     backgroundColor: theme.colors.primary,
//     alignItems: "center",
//   },
//   applyButtonText: {
//     fontSize: theme.typography.fontSize.md,
//     fontWeight: theme.typography.fontWeight.semibold,
//     color: theme.colors.white,
//   },
// });

// export default AdoptionFilters;


import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../theme";

const AdoptionFilters = ({
  visible,
  filters,
  onChangeFilter,
  onClear,
  onClose,
}) => {
  const filterOptions = {
    species: [
      { label: "All", value: "all", icon: "apps" },
      { label: "Dogs", value: "dog", emoji: "🐕" },
      { label: "Cats", value: "cat", emoji: "🐈" },
      { label: "Others", value: "other", emoji: "🐾" },
    ],
    gender: [
      { label: "All", value: "all", icon: "apps" },
      { label: "Male", value: "male", icon: "male" },
      { label: "Female", value: "female", icon: "female" },
    ],
    size: [
      { label: "All", value: "all", icon: "apps" },
      { label: "Small", value: "small", emoji: "🐁" },
      { label: "Medium", value: "medium", emoji: "🐕" },
      { label: "Large", value: "large", emoji: "🐎" },
    ],
    age: [
      { label: "All", value: "all", icon: "apps" },
      { label: "Puppy/Kitten", value: "puppy", emoji: "🐣" },
      { label: "Adult", value: "adult", emoji: "🦴" },
      { label: "Senior", value: "senior", emoji: "🎖️" },
    ],
    vaccinated: [
      { label: "All", value: "all", icon: "apps" },
      { label: "Vaccinated", value: "yes", icon: "checkmark-circle" },
      { label: "Not Vaccinated", value: "no", icon: "close-circle" },
    ],
  };

  const renderFilterSection = (title, filterKey) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View style={styles.filterChips}>
        {filterOptions[filterKey].map((option) => {
          const isActive = filters[filterKey] === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onChangeFilter(filterKey, option.value)}
            >
              {option.emoji ? <Text style={styles.emoji}>{option.emoji}</Text> : (
                <Ionicons
                  name={option.icon}
                  size={18}
                  color={isActive ? theme.colors.white : theme.colors.gray600}
                />
              )}
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={28} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Filters */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {renderFilterSection("Species", "species")}
            {renderFilterSection("Gender", "gender")}
            {renderFilterSection("Size", "size")}
            {renderFilterSection("Age", "age")}
            {renderFilterSection("Vaccination Status", "vaccinated")}
          </ScrollView>

          {/* Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.clearButton} onPress={onClear}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={onClose}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.xxl,
    borderTopRightRadius: theme.borderRadius.xxl,
    maxHeight: "85%",
    ...theme.shadows.xl,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  filterSection: {
    marginBottom: theme.spacing.xl,
  },
  filterTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  filterChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray100,
    gap: theme.spacing.sm,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
  },
  emoji: {
    fontSize: 18,
  },
  chipText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray600,
    fontWeight: theme.typography.fontWeight.medium,
  },
  chipTextActive: {
    color: theme.colors.white,
  },
  modalActions: {
    flexDirection: "row",
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
  },
  clearButton: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.gray100,
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  applyButton: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.white,
  },
});

export default AdoptionFilters;
