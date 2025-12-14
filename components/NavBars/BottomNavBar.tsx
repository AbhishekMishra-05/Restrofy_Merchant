import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Home, Menu } from "lucide-react-native";

type BottomNavBarProps = {
  onHomePress?: () => void;
  onMenuPress?: () => void;
  activeTab?: "home" | "menu";
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({
  onHomePress,
  onMenuPress,
  activeTab = "home",
}) => {
  return (
    <View style={styles.container}>
      {/* Home Button */}
      <TouchableOpacity style={styles.button} onPress={onHomePress} activeOpacity={0.8}>
        <View style={styles.iconWrapper}>
          <Home size={26} color={activeTab === "home" ? "#007AFF" : "#888"} />
          {activeTab === "home" && <View style={styles.activeDot} />}
        </View>
        <Text
          style={[
            styles.label,
            { color: activeTab === "home" ? "#007AFF" : "#888" },
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* Menu Button */}
      <TouchableOpacity style={styles.button} onPress={onMenuPress} activeOpacity={0.8}>
        <View style={styles.iconWrapper}>
          <Menu size={26} color={activeTab === "menu" ? "#007AFF" : "#888"} />
          {activeTab === "menu" && <View style={styles.activeDot} />}
        </View>
        <Text
          style={[
            styles.label,
            { color: activeTab === "menu" ? "#007AFF" : "#888" },
          ]}
        >
          Menu
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  button: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 4,
  },
  iconWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  activeDot: {
    position: "absolute",
    bottom: -6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#007AFF",
  },
});
