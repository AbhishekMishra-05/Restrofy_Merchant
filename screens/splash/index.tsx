import React, { useEffect } from "react";
import { Text, Image, StyleSheet, StatusBar } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { checkLogin } from "../../backend/auth";
import { default_theme } from "../../assets/theme/color";
import { updateMerchantFCMToken } from "../../backend/fcm";
import { getApp } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";

const SplashScreen: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // ✅ Explicitly attach auth to the initialized Firebase app
    const app = getApp();
    const user = auth(app).currentUser;

    if (user) {
      updateMerchantFCMToken(user.uid);
    }
  }, []);

  useEffect(() => {
    const verify = async () => {
      const user = await checkLogin();
      if (user) {
        navigation.replace("Main", { uid: user.uid });
      } else {
        navigation.replace("Login");
      }
    };

    const timer = setTimeout(verify, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient colors={default_theme.splashcolors} style={styles.container}>
      <Text style={styles.title}>Restrofy</Text>
      <StatusBar backgroundColor={default_theme.statusbar} barStyle="light-content" />
      <Image
        source={require("../../assets/chef.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}>Serve Happiness to your plate</Text>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 32, fontWeight: "bold", color: default_theme.splashtitle, marginBottom: 30 },
  image: { width: 200, height: 200, marginBottom: 30 },
  subtitle: { fontSize: 16, fontStyle: "italic", color: default_theme.splashsubtittle },
});
