import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface HeaderProps {
  onPressSettings: () => void;
  onPressQRCode: () => void;
}

const Header: React.FC<HeaderProps> = ({ onPressSettings, onPressQRCode }) => {
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [greeting, setGreeting] = useState<string>("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 🕒 Greeting Logic
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "🌅 Good Morning";
    if (hour >= 12 && hour < 17) return "☀️ Good Afternoon";
    if (hour >= 17 && hour < 21) return "🌆 Good Evening";
    return "🌙 Good Night";
  };

  // 🔥 Fetch restaurant name
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "restaurants", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setRestaurantName(data.restaurantName || "Your Restaurant");
          }
        }
      } catch (error) {
        console.log("Error fetching restaurant name:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, []);

  // ⏱ Real-time greeting updater
  useEffect(() => {
    const updateGreeting = () => setGreeting(getGreeting());
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  // 💫 Fade-in animation
  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  return (
    <LinearGradient
      colors={["#800080", "#d147a3"]} // elegant purple gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.leftSection}>
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            }}
          >
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.name}>{restaurantName}</Text>
          </Animated.View>
        )}
      </View>

      {/* Right side - Menu & QR Code */}
      <View style={styles.iconGroup}>
        <TouchableOpacity style={styles.iconButton} onPress={onPressSettings}>
          <Ionicons name="menu-outline" size={26} color="#4b006e" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={onPressQRCode}>
          <Ionicons name="qr-code-outline" size={26} color="#4b006e" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 95,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  leftSection: {
    flexDirection: "column",
    justifyContent: "center",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#ffe4f2",
    marginTop: 3,
    letterSpacing: 0.5,
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 8,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
