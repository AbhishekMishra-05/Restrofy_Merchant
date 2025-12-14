// screens/auth/SignupAuthScreen.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { signup } from "../../backend/auth";
import messaging from "@react-native-firebase/messaging";
import { updateMerchantFCMToken } from "../../backend/fcm";

export default function SignupScreen({ navigation, route }) {
  const { restaurantName, address, contactNumber } = route.params;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const checkEmailExists = async (email: string) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (error) {
      console.error("Error checking email:", error);
      throw new Error("Invalid email address or connection issue.");
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      const exists = await checkEmailExists(email);
      if (exists) {
        Alert.alert("Error", "Email already exists. Please use another.");
        return;
      }

      const { uid } = await signup(email, password, restaurantName, {
        address,
        contactNumber,
      });

      Alert.alert("Success", "Account created successfully!");
      navigation.replace("Main", { restaurantID: uid });
    } catch (error: any) {
      Alert.alert("Signup Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Image source={require("../../assets/logo.png")} style={styles.logo} />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="gray"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="gray"
      />

      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="gray"
      />

      <TouchableOpacity onPress={handleSignup} style={{ width: "100%" }}>
        <LinearGradient
          colors={["#8b005d", "#d40074"]}
          style={styles.signupButton}
        >
          <Text style={styles.signupText}>Create Account</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
    padding: 12,
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
