import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import {
  checkMerchantPhoneExists,
  phoneLoginMerchant,
} from "../../backend/auth"; // ✅ Import both helpers

export default function PhoneNumberScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("IN");
  const [callingCode, setCallingCode] = useState("91");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 6) {
      Alert.alert("Invalid Number", "Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);
      const fullPhone = `+${callingCode}${phoneNumber}`;
      console.log("🔍 Checking Firestore for:", fullPhone);

      // 🔹 Step 1: Check if merchant exists
      const exists = await checkMerchantPhoneExists(fullPhone);

      if (!exists) {
        // ❌ Merchant not found → go to signup screen
        setLoading(false);
        console.warn("⚠️ Merchant not found — redirecting to Signup");
        navigation.navigate("SignupDetails", { phoneNumber: fullPhone });
        return;
      }

      // ✅ Merchant found → proceed to send OTP
      console.log("✅ Merchant exists — sending OTP...");
      const confirmation = await phoneLoginMerchant(fullPhone);
      setLoading(false);
      navigation.navigate("OtpVerification", { confirmation });

    } catch (error) {
      setLoading(false);
      console.error("❌ Error during OTP process:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your phone number</Text>

      <View style={styles.phoneContainer}>
        <CountryPicker
          countryCode={countryCode}
          withFlag
          withCallingCode
          withFilter
          withCallingCodeButton
          onSelect={(country) => {
            setCountryCode(country.cca2);
            setCallingCode(country.callingCode[0]);
          }}
          containerButtonStyle={styles.countryPicker}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSendOTP}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Checking..." : "Send OTP"}
        </Text>
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
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "80%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  countryPicker: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "#8b005d",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
