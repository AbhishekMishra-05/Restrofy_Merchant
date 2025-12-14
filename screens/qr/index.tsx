import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import QRCode from "react-native-qrcode-svg";
import LinearGradient from "react-native-linear-gradient"; // Make sure to install this

export default function QRScreen({ navigation }) {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error("No logged-in user");

        let docRef = doc(db, "resturants", uid);
        let docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          docRef = doc(db, "restaurants", uid);
          docSnap = await getDoc(docRef);
        }

        if (docSnap.exists()) {
          setRestaurant({ id: uid, ...docSnap.data() });
        } else {
          throw new Error("Restaurant not found in Firestore");
        }
      } catch (error: any) {
        console.error("Error fetching restaurant:", error.message);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#770447ff" />
        <Text>Loading QR...</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Error: No restaurant data found.</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const qrValue = `https://foodo.com/restaurant/${restaurant.id}`;

  return (
    <LinearGradient colors={["#0b0202ff", "#080000ff"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{restaurant.restaurantName}</Text>

        {/* Instruction text above QR card */}
        <Text style={styles.instruction}>
          Scan the QR in the table to browse the menu
        </Text>

        {/* QR code card */}
        <View style={styles.qrCard}>
          <QRCode value={qrValue} size={220} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 90,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1e4e0eff",
    alignItems: "center",
  },
  instruction: {
    fontSize: 16,
    color: "#f7f4f4ff",
    textAlign: "center",
    marginTop: 50,
    paddingHorizontal: 20,
  },
  qrCard: {
    backgroundColor: "#fff",
    padding: 17,
    borderRadius: 3,
    elevation: 12,
    shadowColor: "#f9eff5ff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: "#020002ff",
    marginTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
