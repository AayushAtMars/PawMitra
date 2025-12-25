// import { Ionicons } from "@expo/vector-icons";
// import React from "react";
// import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import theme from "../../theme";

// const SavedPetsScreen = ({ navigation }) => {
//   const savedPets = [
//     {
//       id: "1",
//       name: "Bella",
//       breed: "Labrador",
//       age: "2 Yrs",
//       image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80",
//     },
//     {
//       id: "2",
//       name: "Max",
//       breed: "Husky",
//       age: "1 Yr",
//       image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=400&q=80",
//     },
//   ];

//   const renderPet = ({ item }) => (
//     <TouchableOpacity style={styles.card} onPress={() => {/* Navigate to Pet Details */}}>
//       <Image source={{ uri: item.image }} style={styles.image} />
//       <TouchableOpacity style={styles.heartBtn}>
//         <Ionicons name="heart" size={20} color={theme.colors.error} />
//       </TouchableOpacity>
//       <View style={styles.info}>
//         <Text style={styles.name}>{item.name}</Text>
//         <Text style={styles.breed}>{item.breed} • {item.age}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Saved Pets</Text>
//         <View style={{ width: 24 }} />
//       </View>
//       <FlatList
//         data={savedPets}
//         renderItem={renderPet}
//         keyExtractor={item => item.id}
//         numColumns={2}
//         contentContainerStyle={styles.list}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F9FAFB" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 16,
//     backgroundColor: "#FFF",
//   },
//   headerTitle: { fontSize: 18, fontWeight: "700" },
//   list: { padding: 12 },
//   card: { flex: 1, backgroundColor: "#FFF", margin: 6, borderRadius: 16, overflow: "hidden", elevation: 2 },
//   image: { width: "100%", height: 140 },
//   heartBtn: { position: "absolute", top: 8, right: 8, backgroundColor: "#FFF", padding: 6, borderRadius: 20 },
//   info: { padding: 12 },
//   name: { fontSize: 16, fontWeight: "700", color: "#111827" },
//   breed: { fontSize: 12, color: "#6B7280", marginTop: 2 },
// });

// export default SavedPetsScreen;

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../../theme";

const SavedPetsScreen = ({ navigation }) => {
  const [savedPets, setSavedPets] = useState([]);

  // Reload data whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSavedPets();
    }, []),
  );

  const loadSavedPets = async () => {
    try {
      const data = await AsyncStorage.getItem("savedPets");
      if (data) {
        setSavedPets(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading saved pets:", error);
    }
  };

  const handleRemovePet = (petId) => {
    Alert.alert(
      "Remove Pet",
      "Are you sure you want to remove this pet from your favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const newList = savedPets.filter(item => item._id !== petId);
            setSavedPets(newList);
            await AsyncStorage.setItem("savedPets", JSON.stringify(newList));
          },
        },
      ],
    );
  };

  const renderPet = ({ item }) => {
    // Handle image source safely
    const imageSource = item.photos && item.photos.length > 0
      ? { uri: item.photos[0].url || item.photos[0] }
      : null; // Or a local placeholder

    return (
      <TouchableOpacity style={styles.card} onPress={() => {/* Navigate to Pet Details if you have one */}}>
        {imageSource
          ? <Image source={imageSource} style={styles.image} resizeMode="cover" />
          : (
            <View style={[styles.image, styles.placeholder]}>
              <Ionicons name="paw" size={40} color={theme.colors.gray300} />
            </View>
          )}

        <TouchableOpacity style={styles.heartBtn} onPress={() => handleRemovePet(item._id)}>
          <Ionicons name="heart" size={20} color={theme.colors.error} />
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.breed} numberOfLines={1}>
            {item.breed || item.species}
            {item.age ? ` • ${typeof item.age === "object" ? item.age.value : item.age}` : ""}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-dislike-outline" size={64} color={theme.colors.gray300} />
      <Text style={styles.emptyText}>No saved pets yet</Text>
      <Text style={styles.emptySubtext}>Go to Adoption and swipe right on pets you love!</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Pets</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={savedPets}
        renderItem={renderPet}
        keyExtractor={item => item._id || item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: theme.colors.textPrimary },
  list: { padding: 12 },
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    margin: 6,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: "100%", height: 140 },
  placeholder: { justifyContent: "center", alignItems: "center", backgroundColor: "#F3F4F6" },
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 6,
    borderRadius: 20,
  },
  info: { padding: 12 },
  name: { fontSize: 16, fontWeight: "700", color: "#111827" },
  breed: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
  },
});

export default SavedPetsScreen;