// screens/auth/OtpVerificationScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { confirmMerchantOTP } from "../../backend/auth";

export default function OtpVerificationScreen({ route, navigation }) {
  const { confirmation } = route.params;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

const handleVerifyOTP = async () => {
  try {
    const user = await confirmMerchantOTP(route.params.confirmation, otp);
    navigation.replace("Main", { restaurantID: user.uid });
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter the OTP sent to your phone</Text>
      <TextInput
        style={styles.input}
        placeholder="6-digit OTP"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
        <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify OTP"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: { width: "80%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 20 },
  button: { backgroundColor: "#8b005d", padding: 12, borderRadius: 8, width: "80%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
