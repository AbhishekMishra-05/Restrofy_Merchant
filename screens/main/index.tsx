import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/cards/Header";
import BottomNavBar from "../../components/NavBars/BottomNavBar";
import HomeScreen from "../home/index";
import MenuScreen from "../menu/index";
import SidebarWithModal from "../../components/modals/Sidebar";

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState<"home" | "menu">("home");
  const sidebarRef = useRef<any>(null);
  const navigation = useNavigation();

  // ⚙️ Settings (Sidebar)
  const handleSettingsPress = () => {
    sidebarRef.current?.open();
  };

  // 📷 QR Code Button Handler
const handleQRCodePress = () => {
  navigation.navigate("QRScreen");
};


  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <Header
        title={activeTab === "home" ? "🏠 Home" : "📋 Menu"}
        onPressSettings={handleSettingsPress}
        onPressQRCode={handleQRCodePress} // ✅ Added QR navigation
      />

      {/* Sidebar */}
      <SidebarWithModal ref={sidebarRef} />

      {/* Middle Content */}
      <View style={styles.middle}>
        {activeTab === "home" ? <HomeScreen /> : <MenuScreen />}
      </View>

      {/* Bottom Navigation */}
      <BottomNavBar
        activeTab={activeTab}
        onHomePress={() => setActiveTab("home")}
        onMenuPress={() => setActiveTab("menu")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  middle: { flex: 1 },
});
