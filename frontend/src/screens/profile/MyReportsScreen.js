import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { incidentsAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import theme from "../../theme";

const MyReportsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      setLoading(true);
      const response = await incidentsAPI.getAll({ reportedBy: user.id });
      setReports(response.data.incidents || []);
    } catch (error) {
      console.error("Error fetching my reports:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyReports();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('IncidentDetails', { incidentId: item._id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.reportTitle} numberOfLines={1}>
          {item.aiAnalysis?.category ? item.aiAnalysis.category.replace('_', ' ').toUpperCase() : 'Incident Report'}
        </Text>
        <View style={[styles.badge, item.status === "resolved" ? styles.badgeSuccess : styles.badgePending]}>
          <Text style={[styles.badgeText, item.status === "resolved" ? styles.textSuccess : styles.textPending]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {item.description || item.aiAnalysis?.description}
      </Text>

      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={14} color="#6B7280" />
        <Text style={styles.metaText}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <View style={styles.dot} />
        <Ionicons name="location-outline" size={14} color="#6B7280" />
        <Text style={styles.metaText} numberOfLines={1}>
          {item.address || 'Location not available'}
        </Text>
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

      {loading && !refreshing ? (
        <View style={styles.center}>
          <Text>Loading reports...</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: theme.colors.gray500 }}>No reports submitted yet.</Text>
            </View>
          }
        />
      )}
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