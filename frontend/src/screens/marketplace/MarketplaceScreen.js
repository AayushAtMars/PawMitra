import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { marketplaceAPI } from "../../services/api";
import theme from "../../theme";

// --- Sub-Components for cleaner rendering ---

const CategoryPill = ({ item, isSelected, onPress }) => (
  <TouchableOpacity
    style={[
      styles.categoryChip,
      isSelected && styles.categoryChipActive,
    ]}
    onPress={() => onPress(item.id)}
    activeOpacity={0.7}
  >
    <Ionicons
      name={item.icon}
      size={16}
      color={isSelected ? "#FFF" : theme.colors.textSecondary}
    />
    <Text
      style={[
        styles.categoryText,
        isSelected && styles.categoryTextActive,
      ]}
    >
      {item.name}
    </Text>
  </TouchableOpacity>
);

const ServiceCard = ({ item, onContact, onPress }) => (
  <TouchableOpacity
    style={styles.serviceCard}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <View style={styles.cardInner}>
      {/* Header Section: Logo + Title + Status */}
      <View style={styles.cardHeader}>
        {item.logo?.url
          ? <Image source={{ uri: item.logo.url }} style={styles.serviceLogo} />
          : (
            <View style={[styles.serviceLogo, styles.logoPlaceholder]}>
              <Ionicons name="storefront" size={24} color={theme.colors.gray500} />
            </View>
          )}

        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.serviceName} numberOfLines={1}>{item.businessName}</Text>
            {item.isActive && (
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
              </View>
            )}
          </View>

          <Text style={styles.serviceCategory}>
            {item.category?.replace("_", " ")}
          </Text>
        </View>
      </View>

      {/* Emergency Badge (Conditional) */}
      {item.emergencyAvailable && (
        <View style={styles.emergencyContainer}>
          <View style={styles.emergencyBadge}>
            <Ionicons name="medical" size={12} color={theme.colors.error} />
            <Text style={styles.emergencyText}>
              Emergency {item.emergency24x7 ? "24/7" : "Available"}
            </Text>
          </View>
        </View>
      )}

      {/* Description */}
      {item.description && (
        <Text style={styles.serviceDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Footer: Contact Info & Action Button */}
      <View style={styles.cardFooter}>
        <View style={styles.contactInfo}>
          {item.contactInfo?.email && (
            <View style={styles.iconTextRow}>
              <Ionicons name="mail-outline" size={14} color={theme.colors.gray500} />
              <Text style={styles.footerText} numberOfLines={1}>{item.contactInfo.email}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.callButton}
          onPress={() => onContact(item)}
        >
          <Ionicons name="call" size={16} color="#FFF" />
          <Text style={styles.callButtonText}>Call Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

// --- Main Screen Component ---

const MarketplaceScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All", icon: "apps" },
    { id: "pet_shop", name: "Pet Shop", icon: "cart" },
    { id: "veterinary", name: "Vet", icon: "medical" },
    { id: "grooming", name: "Grooming", icon: "cut" },
    { id: "training", name: "Training", icon: "ribbon" },
    { id: "boarding", name: "Boarding", icon: "home" },
  ];

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchQuery, selectedCategory, services]);

  const loadServices = async () => {
    try {
      if (!refreshing) setLoading(true); // Don't show full loader on refresh
      const response = await marketplaceAPI.getServices();
      setServices(response.data.services || response.data || []);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterServices = () => {
    let filtered = services;
    if (selectedCategory !== "all") {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
        || s.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredServices(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadServices();
  };

  const handleContact = (service) => {
    if (service.contactInfo?.phone) {
      Linking.openURL(`tel:${service.contactInfo.phone}`);
    }
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={{ uri: "https://cdn-icons-png.flaticon.com/512/7486/7486744.png" }} // Placeholder illustration
        style={{ width: 120, height: 120, opacity: 0.5, marginBottom: 20 }}
      />
      <Text style={styles.emptyTitle}>No Services Found</Text>
      <Text style={styles.emptyText}>
        {searchQuery || selectedCategory !== "all"
          ? "We couldn't find any services matching your filters."
          : "The marketplace is currently empty."}
      </Text>
      <TouchableOpacity
        style={styles.registerButtonOutline}
        onPress={() => navigation.navigate("RegisterService")}
      >
        <Text style={styles.registerButtonTextOutline}>Register a Service</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Discover</Text>
          <Text style={styles.headerTitle}>Marketplace</Text>
        </View>
        <TouchableOpacity
          style={styles.myServicesButton}
          onPress={() => navigation.navigate("MyServices")}
        >
          <Ionicons name="briefcase" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search & Filter Section */}
      <View style={styles.filterSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.colors.gray400} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for vets, shops..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.gray400}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={theme.colors.gray400} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => (
            <CategoryPill
              item={item}
              isSelected={selectedCategory === item.id}
              onPress={setSelectedCategory}
            />
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          style={styles.categoriesList}
        />
      </View>

      {/* Main Content */}
      {loading
        ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Finding best services...</Text>
          </View>
        )
        : (
          <FlatList
            data={filteredServices}
            renderItem={({ item }) => (
              <ServiceCard
                item={item}
                onContact={handleContact}
                onPress={() => {/* Navigate details */}}
              />
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[theme.colors.primary]}
              />
            }
          />
        )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background || "#F8F9FA", // Fallback light gray
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  myServicesButton: {
    padding: 10,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },

  // Filter Section
  filterSection: {
    paddingBottom: theme.spacing.sm,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 1 },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textPrimary,
    height: "100%",
  },
  categoriesList: {
    flexGrow: 0,
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: 10,
    paddingBottom: 5,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
    }),
  },
  categoryText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#FFF",
  },

  // Cards
  listContent: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  serviceCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 },
      android: { elevation: 3 },
    }),
  },
  cardInner: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
  },
  serviceLogo: {
    width: 56,
    height: 56,
    borderRadius: 14,
    marginRight: 14,
  },
  logoPlaceholder: {
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  activeBadge: {
    padding: 4,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  serviceCategory: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emergencyContainer: {
    marginTop: 12,
    flexDirection: "row",
  },
  emergencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2", // Very light red
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  emergencyText: {
    fontSize: 11,
    color: theme.colors.error,
    fontWeight: "700",
  },
  serviceDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 12,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactInfo: {
    flex: 1,
    marginRight: 10,
  },
  iconTextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: theme.colors.gray500,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 6,
  },
  callButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: "center",
    maxWidth: "80%",
    marginBottom: 24,
    lineHeight: 22,
  },
  registerButtonOutline: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  registerButtonTextOutline: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
});

export default MarketplaceScreen;