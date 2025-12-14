// screens/ProfileScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

const ProfileScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF7A00" />

      {/* Header with gradient */}
      <LinearGradient
        colors={["#420628ff", "#a91381ff"]}
        style={styles.headerBg}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Wallet Balance</Text>
            <Text style={styles.balanceValue}>₹4750.00</Text>
          </View>
        </View>

        {/* Account Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={22} color="#630947ff" />
            <Text style={styles.sectionTitle}>Account Details</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color="#555" />
            <Text style={styles.info}>+91 9876543210</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color="#555" />
            <Text style={styles.info}>New Delhi, India</Text>
          </View>
        </View>

        {/* Membership Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="ribbon-outline" size={22} color="#6b0745ff" />
            <Text style={styles.sectionTitle}>Membership</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={18} color="#555" />
            <Text style={styles.info}>Role: Merchant</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color="#555" />
            <Text style={styles.info}>Member since: Jan 2025</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF7F2",
  },
  headerBg: {
    height: 90,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 25,
    elevation: 8,
  },
  backBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 45,
    left: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0a0000ff",
    letterSpacing: 0.5,
  },
  profileCard: {
    alignItems: "center",
    marginTop: 1,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 25,
    shadowColor: "#f934dfff",
    shadowOpacity: 0.7,
    shadowOffset: { width: 6, height: 4 },
    shadowRadius: 10,
    elevation: 10,
    borderColor: "#f62c98ff",
  },
 avatar: {
  width: 110,
  height: 110,
  borderRadius: 55,
  marginBottom: 10,
  borderWidth: 3,
  borderColor: "#fff",
  backgroundColor: "#eee",
  elevation: 6,
  shadowColor: "#1e0202ff",
  shadowOpacity: 0.15,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 4,
},

  
  name: {
    fontSize: 21,
    fontWeight: "700",
    color: "#0c0000ff",
  },
  email: {
    fontSize: 15,
    color: "#3a3939ff",
    marginBottom: 10,
  },
  balanceCard: {
    backgroundColor: "#dad0c3ff",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#f727a7ff",
    elevation : 0,
  },
  balanceLabel: {
    fontSize: 15,
    color: "#373737ff",
    marginRight: 8,
  },
  balanceValue: {
    fontSize: 17,
    color: "#1e0f01ff",
    fontWeight: "700",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    shadowColor: "#f231c8ff",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 9,
    elevation: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#591033ff",
    marginLeft: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  info: {
    fontSize: 15,
    color: "#333",
    marginLeft: 8,
  },
  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "#750442ff",
    marginHorizontal: 80,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 35,
    marginBottom: 40,
    elevation: 5,
  },
  logoutText: {
    color: "#fefbfbff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
