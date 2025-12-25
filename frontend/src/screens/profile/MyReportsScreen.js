import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../../theme";

const MyReportsScreen = ({ navigation }) => {
  // Mock Data
  const reports = [
    { id: "1", title: "Injured Dog at Park", date: "2025-10-24", status: "Resolved", location: "Central Park" },
    { id: "2", title: "Stray Cat Colony", date: "2025-10-20", status: "Pending", location: "Sector 4" },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.reportTitle}>{item.title}</Text>
        <View style={[styles.badge, item.status === "Resolved" ? styles.badgeSuccess : styles.badgePending]}>
          <Text style={[styles.badgeText, item.status === "Resolved" ? styles.textSuccess : styles.textPending]}>
            {item.status}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={14} color="#6B7280" />
        <Text style={styles.metaText}>{item.date}</Text>
        <View style={styles.dot} />
        <Ionicons name="location-outline" size={14} color="#6B7280" />
        <Text style={styles.metaText}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Reports</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={reports}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
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
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  list: { padding: 16 },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  reportTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeSuccess: { backgroundColor: "#DEF7EC" },
  badgePending: { backgroundColor: "#FEF3C7" },
  badgeText: { fontSize: 12, fontWeight: "600" },
  textSuccess: { color: "#03543F" },
  textPending: { color: "#92400E" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  metaText: { fontSize: 13, color: "#6B7280", marginLeft: 4 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#D1D5DB", marginHorizontal: 8 },
});

export default MyReportsScreen;