import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AdoptionFilters from "../../components/AdoptionFilters";
import PetDetailsModal from "../../components/PetDetailsModal";
import { petsAPI } from "../../services/api";
import theme from "../../theme";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const AdoptionScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [filters, setFilters] = useState({
    species: "all",
    gender: "all",
    size: "all",
    age: "all",
    vaccinated: "all",
  });

  const categories = [
    { id: "all", label: "All Pets", icon: "paw" },
    { id: "dog", label: "Dogs", icon: "paw" },
    { id: "cat", label: "Cats", icon: "paw" },
    { id: "bird", label: "Birds", icon: "leaf" },
    { id: "other", label: "Others", icon: "ellipsis-horizontal" },
  ];

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [])
  );

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, pets, activeCategory]);

  const loadPets = async () => {
    try {
      setLoading(true);
      const response = await petsAPI.getAll({ status: "available" });

      if (response.data.success || Array.isArray(response.data.pets)) {
        const allPets = response.data.pets || [];
        
        // Remove duplicates based on _id
        const uniquePets = allPets.filter((pet, index, self) =>
          index === self.findIndex((p) => p._id === pet._id)
        );
        
        setPets(uniquePets);
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

    // Category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.species?.toLowerCase() === activeCategory
      );
    }

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.species?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.breed?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Other filters
    if (filters.species !== "all") {
      filtered = filtered.filter((p) => p.species === filters.species);
    }

    if (filters.gender !== "all") {
      filtered = filtered.filter((p) => p.gender === filters.gender);
    }

    if (filters.size !== "all") {
      filtered = filtered.filter((p) => p.size === filters.size);
    }

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
    setActiveCategory("all");
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
    Alert.alert("Request to Adopt", `Send adoption request for ${pet.name}?`, [
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
    ]);
  };

  const handleContactOwner = (pet) => {
    Alert.alert("Contact Owner", "Contact feature coming soon!");
  };

  const renderCategoryItem = (category) => {
    const isActive = activeCategory === category.id;
    return (
      <TouchableOpacity
        key={category.id}
        style={[styles.categoryChip, isActive && styles.categoryChipActive]}
        onPress={() => setActiveCategory(category.id)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={category.icon}
          size={18}
          color={isActive ? "#fff" : theme.colors.textSecondary}
        />
        <Text
          style={[styles.categoryText, isActive && styles.categoryTextActive]}
        >
          {category.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPetCard = ({ item, index }) => {
    const imageUrl = item.photos?.[0]?.url;
    const displayAddress = typeof item.address === 'string' 
      ? item.address 
      : (item.location?.address || 'Location available');

    return (
      <TouchableOpacity
        style={[styles.petCard, { marginLeft: index % 2 === 0 ? 0 : 12 }]}
        onPress={() => handlePetPress(item)}
        activeOpacity={0.9}
      >
        {/* Image Container */}
        <View style={styles.cardImageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.cardImage} />
          ) : (
            <View style={[styles.cardImage, styles.imagePlaceholder]}>
              <Ionicons name="paw" size={40} color={theme.colors.gray300} />
            </View>
          )}
          
          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => handleFavorite(item)}
          >
            <Ionicons name="heart-outline" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Status Badge */}
          {item.healthStatus && typeof item.healthStatus === 'string' && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {item.healthStatus.includes("Vaccinated") ? "✓ Vaccinated" : "Healthy"}
              </Text>
            </View>
          )}
        </View>

        {/* Info Container */}
        <View style={styles.cardInfo}>
          <View style={styles.cardHeader}>
            <Text style={styles.petName} numberOfLines={1}>
              {item.name || "Unknown"}
            </Text>
            <Ionicons
              name={item.gender === "male" ? "male" : "female"}
              size={16}
              color={item.gender === "male" ? "#3B82F6" : "#EC4899"}
            />
          </View>

          <Text style={styles.petBreed} numberOfLines={1}>
            {item.species ? item.species.charAt(0).toUpperCase() + item.species.slice(1) : "Pet"}
            {item.breed && ` • ${item.breed}`}
          </Text>

          {item.age && (
            <View style={styles.ageRow}>
              <Ionicons name="time-outline" size={12} color={theme.colors.textSecondary} />
              <Text style={styles.ageText}>
                {typeof item.age === 'object' ? `${item.age.value} ${item.age.unit}` : item.age}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="paw" size={60} color={theme.colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>No Pets Found</Text>
      <Text style={styles.emptyText}>
        {searchQuery || activeCategory !== "all"
          ? "Try adjusting your search or filters"
          : "Be the first to add a pet for adoption!"}
      </Text>
      {(searchQuery || activeCategory !== "all") ? (
        <TouchableOpacity style={styles.clearBtn} onPress={handleClearFilters}>
          <Text style={styles.clearBtnText}>Clear All Filters</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.addPetBtn}
          onPress={() => navigation.navigate("AddPet")}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addPetBtnText}>Add a Pet</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Finding adorable pets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.greeting}>Find Your</Text>
          <Text style={styles.title}>Perfect Companion 🐾</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.navigate("MyPets")}
          >
            <Ionicons name="list" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerBtn, styles.addBtn]}
            onPress={() => navigation.navigate("AddPet")}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.colors.gray400} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search pets..."
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
          style={styles.filterBtn}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map(renderCategoryItem)}
      </ScrollView>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          <Text style={styles.statsNumber}>{filteredPets.length}</Text> pets available
        </Text>
      </View>

      {/* Pet Grid */}
      <FlatList
        data={filteredPets}
        renderItem={renderPetCard}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={renderEmpty}
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
    backgroundColor: "#FAFAFA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  addBtn: {
    backgroundColor: theme.colors.primary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginLeft: 10,
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  categoryContainer: {
    marginTop: 16,
    height: 48,
  },
  categoryContent: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  categoryTextActive: {
    color: "#fff",
  },
  statsBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  statsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statsNumber: {
    fontWeight: "700",
    color: theme.colors.primary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  petCard: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImageContainer: {
    position: "relative",
    height: 160,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F3F4F6",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(16, 185, 129, 0.9)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  cardInfo: {
    padding: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  petName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  petBreed: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  ageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ageText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  clearBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },
  clearBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  addPetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
  },
  addPetBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
});

export default AdoptionScreen;