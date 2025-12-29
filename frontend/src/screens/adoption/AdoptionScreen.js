// UI-ONLY UPDATE: Redesigned adoption screen with search, filters, grid/list layouts, and featured carousel
// Preserves all existing API calls, navigation, and business logic
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { petsAPI } from "../../services/api";
import theme from "../../theme";
import PetCard from "../../components/PetCard";
import AdoptionFilters from "../../components/AdoptionFilters";
import PetDetailsModal from "../../components/PetDetailsModal";

const { width } = Dimensions.get("window");
const isWeb = width > 768;

const AdoptionScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [filters, setFilters] = useState({
    species: "all",
    gender: "all",
    size: "all",
    age: "all",
    vaccinated: "all",
  });

  useEffect(() => {
    loadPets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, pets]);

  const loadPets = async () => {
    try {
      setLoading(true);
      const response = await petsAPI.getAll({ status: "available" });

      if (response.data.success || Array.isArray(response.data.pets)) {
        const allPets = response.data.pets || [];
        setPets(allPets);
        // Featured: first 5 pets
        setFeaturedPets(allPets.slice(0, 5));
      }
    } catch (error) {
      console.error("Error loading pets:", error);
      Alert.alert("Error", "Failed to load pets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...pets];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.species?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.breed?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Species filter
    if (filters.species !== "all") {
      filtered = filtered.filter((p) => p.species === filters.species);
    }

    // Gender filter
    if (filters.gender !== "all") {
      filtered = filtered.filter((p) => p.gender === filters.gender);
    }

    // Size filter (if available in pet data)
    if (filters.size !== "all") {
      filtered = filtered.filter((p) => p.size === filters.size);
    }

    // Age filter
    if (filters.age !== "all") {
      filtered = filtered.filter((p) => {
        if (!p.age) return false;
        const ageStr = String(p.age).toLowerCase();
        if (filters.age === "puppy" || filters.age === "kitten") {
          return ageStr.includes("month") || ageStr.includes("puppy") || ageStr.includes("kitten");
        }
        if (filters.age === "adult") {
          return ageStr.includes("year") && !ageStr.includes("senior");
        }
        if (filters.age === "senior") {
          return ageStr.includes("senior") || parseInt(ageStr) > 7;
        }
        return true;
      });
    }

    // Vaccinated filter
    if (filters.vaccinated === "yes") {
      filtered = filtered.filter((p) => 
        p.healthStatus?.toLowerCase().includes("vaccinated")
      );
    }

    setFilteredPets(filtered);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      species: "all",
      gender: "all",
      size: "all",
      age: "all",
      vaccinated: "all",
    });
    setSearchQuery("");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPets();
  };

  const handlePetPress = (pet) => {
    setSelectedPet(pet);
  };

  const handleFavorite = async (pet) => {
    try {
      const savedData = await AsyncStorage.getItem("savedPets");
      let savedList = savedData ? JSON.parse(savedData) : [];

      const exists = savedList.find((p) => p._id === pet._id);
      if (exists) {
        savedList = savedList.filter((p) => p._id !== pet._id);
        Alert.alert("Removed", `${pet.name} removed from favorites`);
      } else {
        savedList.push(pet);
        Alert.alert("Saved!", `${pet.name} added to favorites`);
      }

      await AsyncStorage.setItem("savedPets", JSON.stringify(savedList));
    } catch (error) {
      console.error("Error saving favorite:", error);
    }
  };

  const handleRequestAdopt = async (pet) => {
    Alert.alert(
      "Request to Adopt",
      `Send adoption request for ${pet.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Request",
          onPress: async () => {
            try {
              await petsAPI.expressInterest(pet._id, {
                message: "I would like to adopt this pet",
              });
              Alert.alert("Success", "Adoption request sent!");
              setSelectedPet(null);
            } catch (error) {
              console.error("Error sending request:", error);
              Alert.alert("Error", "Failed to send request");
            }
          },
        },
      ]
    );
  };

  const handleContactOwner = (pet) => {
    Alert.alert("Contact Owner", "Contact feature coming soon!");
  };

  const renderFeaturedSection = () => {
    if (featuredPets.length === 0) return null;

    return (
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured Pets</Text>
        <FlatList
          horizontal
          data={featuredPets}
          keyExtractor={(item) => `featured-${item._id}`}
          renderItem={({ item }) => (
            <PetCard
              pet={item}
              onPress={handlePetPress}
              onFavorite={handleFavorite}
              style={styles.featuredCard}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredContent}
        />
      </View>
    );
  };

  const renderPetItem = ({ item }) => (
    <PetCard
      pet={item}
      onPress={handlePetPress}
      onFavorite={handleFavorite}
      style={viewMode === "grid" ? styles.gridCard : styles.listCard}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="paw-outline" size={64} color={theme.colors.gray300} />
      <Text style={styles.emptyTitle}>No Pets Found</Text>
      <Text style={styles.emptyText}>
        {searchQuery || Object.values(filters).some((f) => f !== "all")
          ? "Try adjusting your filters"
          : "Check back later for new pets"}
      </Text>
      {(searchQuery || Object.values(filters).some((f) => f !== "all")) && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
          <Text style={styles.clearButtonText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading pets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Find Your Companion</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("MyPets")}
          >
            <Ionicons name="list" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("AddPet")}
          >
            <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.colors.gray400} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, breed..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={theme.colors.gray400}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={theme.colors.gray400} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options" size={20} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      {/* Active Filter Chips */}
      {Object.values(filters).some((f) => f !== "all") && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.activeFilters}
          contentContainerStyle={styles.activeFiltersContent}
        >
          {Object.entries(filters).map(([key, value]) => {
            if (value === "all") return null;
            return (
              <View key={key} style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>
                  {key}: {value}
                </Text>
                <TouchableOpacity
                  onPress={() => handleFilterChange(key, "all")}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={16} color={theme.colors.white} />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <Text style={styles.resultsCount}>
          {filteredPets.length} {filteredPets.length === 1 ? "pet" : "pets"} available
        </Text>
        <View style={styles.toggleButtons}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === "grid" && styles.toggleButtonActive]}
            onPress={() => setViewMode("grid")}
          >
            <Ionicons
              name="grid"
              size={18}
              color={viewMode === "grid" ? theme.colors.white : theme.colors.gray600}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === "list" && styles.toggleButtonActive]}
            onPress={() => setViewMode("list")}
          >
            <Ionicons
              name="list"
              size={18}
              color={viewMode === "list" ? theme.colors.white : theme.colors.gray600}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Pet List */}
      <FlatList
        data={filteredPets}
        renderItem={renderPetItem}
        keyExtractor={(item) => item._id}
        numColumns={viewMode === "grid" && !isWeb ? 2 : 1}
        key={viewMode} // Force re-render on view change
        ListHeaderComponent={renderFeaturedSection}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={viewMode === "grid" && !isWeb ? styles.columnWrapper : null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Filters Modal */}
      <AdoptionFilters
        visible={showFilters}
        filters={filters}
        onChangeFilter={handleFilterChange}
        onClear={handleClearFilters}
        onClose={() => setShowFilters(false)}
      />

      {/* Pet Details Modal */}
      {selectedPet && (
        <PetDetailsModal
          visible={!!selectedPet}
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
          onRequestAdopt={handleRequestAdopt}
          onContactOwner={handleContactOwner}
          onFavorite={handleFavorite}
        />
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
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
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
  headerActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  iconButton: {
    padding: theme.spacing.sm,
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
    ...theme.shadows.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
  },
  filterButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginLeft: theme.spacing.sm,
  },
  activeFilters: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  activeFiltersContent: {
    gap: theme.spacing.sm,
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.sm,
  },
  activeFilterText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.medium,
    textTransform: "capitalize",
  },
  viewToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  resultsCount: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  toggleButtons: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  toggleButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.gray100,
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  featuredSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  featuredContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  featuredCard: {
    width: 200,
    marginRight: theme.spacing.md,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  gridCard: {
    flex: 1,
    marginBottom: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
  },
  listCard: {
    marginBottom: theme.spacing.md,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xxxl,
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
    textAlign: "center",
  },
  clearButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  clearButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default AdoptionScreen;