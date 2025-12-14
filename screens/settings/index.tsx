// screens/SettingsScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      { text: "Logout", onPress: () => console.log("Logged out") },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Account Section */}
        <View style={styles.accountCard}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.profileImage}
          />
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>johndoe@example.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.optionCard}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.option}>
            <Text style={styles.optionText}>App Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#ccc", true: "#7d1563ff" }}
              thumbColor={notifications ? "#fff" : "#fff"}
            />
          </View>
        </View>

        {/* App Preferences */}
        <View style={styles.optionCard}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          <TouchableOpacity style={styles.optionTouchable}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="language-outline" size={22} color="#7b1350ff" style={{ marginRight: 10 }} />
              <Text style={styles.optionText}>Language</Text>
            </View>
            <Text style={styles.optionSubText}>{language}</Text>
          </TouchableOpacity>

          <View style={styles.option}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="moon-outline" size={22} color="#7a1651ff" style={{ marginRight: 10 }} />
              <Text style={styles.optionText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#ccc", true: "#821555ff" }}
              thumbColor={darkMode ? "#fff" : "#fff"}
            />
          </View>
        </View>

        {/* Security & Privacy */}
        <View style={styles.optionCard}>
          <Text style={styles.sectionTitle}>Security & Privacy</Text>
          <TouchableOpacity style={styles.optionTouchable}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="lock-closed-outline" size={22} color="#54173bff" style={{ marginRight: 10 }} />
              <Text style={styles.optionText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Support & About */}
        <View style={styles.optionCard}>
          <Text style={styles.sectionTitle}>Support & About</Text>
          <TouchableOpacity style={styles.optionTouchable}>
            <Text style={styles.optionText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionTouchable}>
            <Text style={styles.optionText}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>App Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f6" },
  header: {
    backgroundColor: "#430926ff",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#e8dbdbff",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  backButton: { paddingRight: 10 },
  headerText: {
    color: "#f1e5e5ff",
    fontSize: 22,
    fontWeight: "700",
  },
  scrollContainer: { padding: 20 },
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#f030b0ff",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  profileImage: { width: 60, height: 60, borderRadius: 30 },
  profileName: { fontSize: 18, fontWeight: "600", color: "#222" },
  profileEmail: { fontSize: 14, color: "#454444ff" },
  editButton: {
    marginLeft: "auto",
    backgroundColor: "#7e084bff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editText: { color: "#fff", fontWeight: "600" },
  optionCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: "#514f50ff", padding: 15 },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  optionTouchable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  optionText: { fontSize: 16, color: "#333", fontWeight: "500" },
  optionSubText: { fontSize: 14, color: "#242424ff" },
  logoutButton: {
    backgroundColor: "#500b3aff",
    paddingVertical: 11,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  logoutText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  footer: { alignItems: "center", marginBottom: 20 },
  footerText: { color: "#0f0e0eff", fontSize: 14 },
});
