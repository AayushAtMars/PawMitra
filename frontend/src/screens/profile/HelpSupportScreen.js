import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../../theme";

const HelpSupportScreen = ({ navigation }) => {
  const contactSupport = () => Linking.openURL("mailto:support@pawmitra.com");
  const openWebsite = () => Linking.openURL("https://pawmitra.com");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          <Ionicons name="headset" size={48} color={theme.colors.primary} />
          <Text style={styles.bannerTitle}>How can we help you?</Text>
          <Text style={styles.bannerText}>Find answers to common questions or contact our support team.</Text>
        </View>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.contactCard} onPress={contactSupport}>
            <View style={[styles.iconCircle, { backgroundColor: "#E0E7FF" }]}>
              <Ionicons name="mail" size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Email Support</Text>
            <Text style={styles.cardDesc}>Get response within 24h</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={openWebsite}>
            <View style={[styles.iconCircle, { backgroundColor: "#DEF7EC" }]}>
              <Ionicons name="globe" size={24} color="#059669" />
            </View>
            <Text style={styles.cardTitle}>Website</Text>
            <Text style={styles.cardDesc}>Visit our FAQ page</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Common Questions</Text>
        {/* Simple Static FAQ List */}
        <View style={styles.faqList}>
          {["How do I report an injured animal?", "How can I volunteer?", "Is the adoption process free?"].map((
            q,
            index,
          ) => (
            <TouchableOpacity key={index} style={styles.faqItem}>
              <Text style={styles.faqText}>{q}</Text>
              <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  content: { padding: 20 },
  banner: { alignItems: "center", marginBottom: 30, paddingVertical: 20 },
  bannerTitle: { fontSize: 22, fontWeight: "700", marginTop: 16, color: "#1F2937" },
  bannerText: { textAlign: "center", color: "#6B7280", marginTop: 8, maxWidth: "80%" },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12, color: "#1F2937" },
  grid: { flexDirection: "row", gap: 12, marginBottom: 30 },
  contactCard: { flex: 1, backgroundColor: "#FFF", padding: 16, borderRadius: 16, alignItems: "center", elevation: 1 },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: { fontWeight: "600", color: "#1F2937" },
  cardDesc: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  faqList: { backgroundColor: "#FFF", borderRadius: 16 },
  faqItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  faqText: { color: "#374151", fontSize: 15 },
});

export default HelpSupportScreen;