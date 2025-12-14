// screens/auth/SignupDetailsScreen.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function SignupDetailsScreen({ navigation }) {
  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const handleNext = () => {
    if (!restaurantName || !address || !contactNumber) {
      Alert.alert("Error", "Please fill all details");
      return;
    }

    navigation.navigate("Signup", {
      restaurantName,
      address,
      contactNumber,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />

      <TextInput
        placeholder="Restaurant Name"
        style={styles.input}
        value={restaurantName}
        onChangeText={setRestaurantName}
      />

      <TextInput
        placeholder="Address"
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        placeholder="Contact Number"
        style={styles.input}
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />

      <TouchableOpacity onPress={handleNext} style={{ width: "100%" }}>
        <LinearGradient colors={["#8b005d", "#d40074"]} style={styles.signupButton}>
          <Text style={styles.signupText}>Next</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    width: "100%",
    color: "#000",
  },
  signupButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  signupText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
