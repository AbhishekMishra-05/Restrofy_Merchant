import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { resetMerchantPassword } from "../../backend/auth";


export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
const handleForgotPassword = async () => {
  if (!email) {
    Alert.alert("Missing Email", "Please enter your registered email address.");
    return;
  }

  try {
    await resetMerchantPassword(email);
    Alert.alert(
      "Success",
      "Password reset link sent to your email!",
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"), // 👈 navigate back to Login screen
        },
      ]
    );
  } catch (err) {
    Alert.alert("Error", err.message);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
