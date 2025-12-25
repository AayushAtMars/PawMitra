import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import theme from "../../theme";

const SettingsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [location, setLocation] = useState(true);

  const SettingItem = ({ icon, title, type = "link", value, onToggle }) => (
    <TouchableOpacity style={styles.item} disabled={type === "toggle"}>
      <View style={styles.itemLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={20} color={theme.colors.primary} />
        </View>
        <Text style={styles.itemText}>{title}</Text>
      </View>
      {type === "toggle"
        ? (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: "#D1D5DB", true: theme.colors.primary }}
          />
        )
        : <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.section}>
          <SettingItem
            icon="notifications-outline"
            title="Push Notifications"
            type="toggle"
            value={notifications}
            onToggle={setNotifications}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            type="toggle"
            value={darkMode}
            onToggle={setDarkMode}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="location-outline"
            title="Location Services"
            type="toggle"
            value={location}
            onToggle={setLocation}
          />
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.section}>
          <SettingItem icon="lock-closed-outline" title="Change Password" />
          <View style={styles.divider} />
          <SettingItem icon="shield-checkmark-outline" title="Privacy Policy" />
          <View style={styles.divider} />
          <SettingItem icon="document-text-outline" title="Terms of Service" />
        </View>

        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
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
  sectionTitle: { fontSize: 14, fontWeight: "600", color: "#6B7280", marginBottom: 8, marginTop: 16, marginLeft: 4 },
  section: { backgroundColor: "#FFF", borderRadius: 16, overflow: "hidden" },
  item: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  itemLeft: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 32,
    height: 32,
    backgroundColor: "#F0F9FF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemText: { fontSize: 16, color: "#1F2937" },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginLeft: 60 },
  deleteButton: { marginTop: 30, alignItems: "center", padding: 16 },
  deleteText: { color: theme.colors.error, fontWeight: "600" },
});

export default SettingsScreen;