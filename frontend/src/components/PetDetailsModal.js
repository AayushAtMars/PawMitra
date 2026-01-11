// UI Component: Full pet details modal with image carousel and action buttons
import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../theme";

const { width } = Dimensions.get("window");

const PetDetailsModal = ({
  visible,
  pet,
  onClose,
  onRequestAdopt,
  onContactOwner,
  onFavorite,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  if (!pet) return null;

  const images = pet.photos && pet.photos.length > 0
    ? pet.photos.map((p) => p.url || p)
    : [];

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

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentImageIndex(index);
      },
    }
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color={theme.colors.white} />
        </TouchableOpacity>

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onFavorite?.(pet)}
        >
          <Ionicons name="heart" size={28} color={theme.colors.error} />
        </TouchableOpacity>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Image Carousel */}
          <View style={styles.imageSection}>
            {images.length > 0 ? (
              <>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                >
                  {images.map((img, index) => (
                    <Image
                      key={index}
                      source={{ uri: img }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  ))}
                </ScrollView>
                {/* Image Indicators */}
                {images.length > 1 && (
                  <View style={styles.indicators}>
                    {images.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.indicator,
                          index === currentImageIndex && styles.indicatorActive,
                        ]}
                      />
                    ))}
                  </View>
                )}
              </>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="paw" size={80} color={theme.colors.gray300} />
              </View>
            )}
          </View>

          {/* Pet Info */}
          <View style={styles.content}>
            {/* Name & Gender */}
            <View style={styles.header}>
              <View style={styles.nameSection}>
                <Text style={styles.name}>{String(pet.name || "Unknown")}</Text>
                <Ionicons
                  name={getGenderIcon(pet.gender)}
                  size={28}
                  color={getGenderColor(pet.gender)}
                />
              </View>
              {pet.isLostFound && (
                <View
                  style={[
                    styles.lostFoundBadge,
                    {
                      backgroundColor:
                        pet.lostFoundType === "lost"
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

            {/* Quick Info Cards */}
            <View style={styles.infoCards}>
              <View style={styles.infoCard}>
                <Ionicons name="paw" size={24} color={theme.colors.primary} />
                <Text style={styles.infoLabel}>Breed</Text>
                <Text style={styles.infoValue}>
                  {typeof pet.breed === 'string' ? pet.breed : (typeof pet.species === 'string' ? pet.species : 'Mixed')}
                </Text>
              </View>

              {pet.age && (
                <View style={styles.infoCard}>
                  <Ionicons name="calendar" size={24} color={theme.colors.secondary} />
                  <Text style={styles.infoLabel}>Age</Text>
                  <Text style={styles.infoValue}>
                    {typeof pet.age === 'object' ? `${pet.age.value} ${pet.age.unit}` : String(pet.age)}
                  </Text>
                </View>
              )}

              {pet.healthStatus && (
                <View style={styles.infoCard}>
                  <Ionicons name="medical" size={24} color={theme.colors.success} />
                  <Text style={styles.infoLabel}>Health</Text>
                  <Text style={styles.infoValue}>
                    {typeof pet.healthStatus === 'object'
                      ? (pet.healthStatus.vaccinated ? 'Vaccinated' : 'Not Vaccinated')
                      : String(pet.healthStatus)}
                  </Text>
                </View>
              )}
            </View>

            {/* Description */}
            {pet.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About {pet.name}</Text>
                <Text style={styles.description}>{String(pet.description)}</Text>
              </View>
            )}

            {/* Location */}
            {pet.address && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={20} color={theme.colors.primary} />
                  <Text style={styles.locationText}>{String(pet.address)}</Text>
                </View>
              </View>
            )}

            {/* Owner Info (if available) */}
            {pet.owner && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Owner</Text>
                <View style={styles.ownerCard}>
                  <View style={styles.ownerAvatar}>
                    <Ionicons name="person" size={24} color={theme.colors.primary} />
                  </View>
                  <View style={styles.ownerInfo}>
                    <Text style={styles.ownerName}>
                      {String(pet.owner.name || "Owner")}
                    </Text>
                    <Text style={styles.ownerMeta}>
                      Listed {new Date(pet.createdAt || Date.now()).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Spacer for buttons */}
            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => onContactOwner?.(pet)}
          >
            <Ionicons name="call" size={20} color={theme.colors.primary} />
            <Text style={styles.secondaryButtonText}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => onRequestAdopt?.(pet)}
          >
            <Ionicons name="heart" size={20} color={theme.colors.white} />
            <Text style={styles.primaryButtonText}>Request to Adopt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  closeButton: {
    position: "absolute",
    top: 48,
    left: theme.spacing.lg,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.full,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    position: "absolute",
    top: 48,
    right: theme.spacing.lg,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.full,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.md,
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    position: "relative",
    height: 400,
    backgroundColor: theme.colors.gray100,
  },
  image: {
    width: width,
    height: 400,
  },
  imagePlaceholder: {
    width: width,
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.gray100,
  },
  indicators: {
    position: "absolute",
    bottom: theme.spacing.lg,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.xs,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  indicatorActive: {
    backgroundColor: theme.colors.white,
    width: 24,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  nameSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  name: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  lostFoundBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  lostFoundText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  infoCards: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  infoCard: {
    flex: 1,
    backgroundColor: theme.colors.gray50,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  locationText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  ownerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.gray50,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  ownerMeta: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  actions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
    gap: theme.spacing.md,
    ...theme.shadows.lg,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.gray100,
    gap: theme.spacing.sm,
  },
  secondaryButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary,
  },
  primaryButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.secondary,
    gap: theme.spacing.sm,
  },
  primaryButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.white,
  },
});

export default PetDetailsModal;